import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  goal: z.string().trim().min(5).max(1000),
  budget: z.number().positive().max(100000000).optional(),
  currency: z.string().trim().max(10).default("INR"),
  context: z.string().trim().max(1000).optional(),
});

function isTemporaryGeminiError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const apiError = error as {
    status?: number;
    code?: string;
    message?: string;
  };

  const status = Number(apiError.status);
  const details = `${apiError.code ?? ""} ${apiError.message ?? ""}`;

  return (
    status === 429 ||
    status === 503 ||
    status === 504 ||
    /UNAVAILABLE|RESOURCE_EXHAUSTED|high demand|rate.?limit|gateway timeout|deadline exceeded/i.test(details)
  );
}

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        status: "invalid_request",
        message: "Request body must contain valid JSON.",
      },
      { status: 400 }
    );
  }

  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        status: "invalid_request",
        message: "Provide a shopping goal between 5 and 1000 characters and a valid optional budget.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        status: "ai_not_configured",
        message: "Gemini API key is not configured on the server.",
      },
      { status: 503 }
    );
  }

  const { goal, budget, currency, context } = parsed.data;

  const prompt = `
You are PAYMIND X, an AI shopping and purchase-intelligence assistant.

Help the user reason about this shopping need:
${goal}

Budget: ${budget !== undefined ? `${currency} ${budget}` : "Not specified"}
Additional context: ${context || "None"}

Instructions:
- Give practical buying criteria and a concise recommendation strategy.
- If a budget is provided, explain how to stay within it.
- Never invent current product listings, prices, seller details, ratings, stock, or shipping availability.
- Do not claim that you searched a live catalogue.
- Clearly distinguish general advice from verified product information.
- Do not initiate, authorize, or capture any payment.
- The user must explicitly approve any future payment through the PayPal checkout flow.
- Explain what product information would be useful to compare.
- Use clear, helpful language.
`;

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      timeout: 25000,
      retryOptions: { attempts: 1 },
    },
  });
  const maxAttempts = 2;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      const recommendation = response.text?.trim();

      if (!recommendation) {
        return NextResponse.json(
          {
            status: "empty_ai_response",
            message: "The AI returned an empty response. Please try again.",
          },
          { status: 502 }
        );
      }

      return NextResponse.json({
        status: "success",
        provider: "Google Gemini",
        recommendation,
        payment_authorized: false,
        live_product_data_used: false,
      });
    } catch (error) {
      const temporary = isTemporaryGeminiError(error);

      console.error("PAYMIND X Gemini request failed:", {
        attempt,
        temporary,
        upstreamStatus:
          error && typeof error === "object"
            ? (error as { status?: number }).status
            : undefined,
      });

      if (temporary && attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        continue;
      }

      if (temporary) {
        return NextResponse.json(
          {
            status: "ai_temporarily_unavailable",
            message:
              "Gemini is temporarily busy. Your request was not processed. Please try again shortly.",
            retryable: true,
          },
          {
            status: 503,
            headers: { "Retry-After": "10" },
          }
        );
      }

      return NextResponse.json(
        {
          status: "ai_request_failed",
          message: "The AI recommendation could not be generated. Please try again.",
          retryable: false,
        },
        { status: 502 }
      );
    }
  }

  return NextResponse.json(
    {
      status: "ai_temporarily_unavailable",
      message: "Gemini is temporarily unavailable. Please try again shortly.",
      retryable: true,
    },
    { status: 503 }
  );
}
