import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { paypalRequest, verifyOrderProof } from "@/lib/paypal";

const RequestSchema = z.object({
  orderId: z.string().min(10).max(64).regex(/^[A-Z0-9-]+$/),
  proof: z.string().min(30).max(150),
});

type PayPalCapture = {
  id?: string;
  status?: string;
  amount?: {
    currency_code?: string;
    value?: string;
  };
};

type PayPalOrder = {
  id?: string;
  status?: string;
  intent?: string;
  purchase_units?: Array<{
    custom_id?: string;
    amount?: {
      currency_code?: string;
      value?: string;
    };
    payments?: {
      captures?: PayPalCapture[];
    };
  }>;
};

function isExpectedDemoOrder(order: PayPalOrder): boolean {
  const unit = order.purchase_units?.[0];

  return (
    order.intent === "CAPTURE" &&
    unit?.custom_id === "PAYMIND-X-SANDBOX-DEMO" &&
    unit.amount?.currency_code === "USD" &&
    unit.amount?.value === "1.00"
  );
}

function completedCapture(order: PayPalOrder): PayPalCapture | undefined {
  return order.purchase_units
    ?.flatMap((unit) => unit.payments?.captures ?? [])
    .find(
      (capture) =>
        capture.status === "COMPLETED" &&
        capture.amount?.currency_code === "USD" &&
        capture.amount?.value === "1.00"
    );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid capture request." },
        { status: 400 }
      );
    }

    const { orderId, proof } = parsed.data;

    if (!verifyOrderProof(orderId, proof)) {
      return NextResponse.json(
        { error: "Order verification failed." },
        { status: 403 }
      );
    }

    // Fetch the order from PayPal before attempting capture.
    const order = await paypalRequest<PayPalOrder>(
      `/v2/checkout/orders/${encodeURIComponent(orderId)}`,
      { method: "GET" }
    );

    if (order.id !== orderId || !isExpectedDemoOrder(order)) {
      return NextResponse.json(
        { error: "This is not a valid PAYMIND X demo order." },
        { status: 400 }
      );
    }

    // Safe response for a previously completed capture.
    if (order.status === "COMPLETED") {
      const existingCapture = completedCapture(order);

      if (existingCapture?.id) {
        return NextResponse.json(
          {
            status: "COMPLETED",
            captureId: existingCapture.id,
            message: "Sandbox payment was already completed.",
          },
          { headers: { "Cache-Control": "no-store" } }
        );
      }
    }

    if (order.status !== "APPROVED") {
      return NextResponse.json(
        { error: "The PayPal order has not been approved." },
        { status: 409 }
      );
    }

    const requestId = createHash("sha256")
      .update(`PAYMIND-X-CAPTURE-${orderId}`)
      .digest("hex")
      .slice(0, 32);

    const captured = await paypalRequest<PayPalOrder>(
      `/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
      {
        method: "POST",
        headers: { "PayPal-Request-Id": requestId },
        body: JSON.stringify({}),
      }
    );

    const capture = completedCapture(captured);

    if (captured.status !== "COMPLETED" || !capture?.id) {
      return NextResponse.json(
        { error: "PayPal has not confirmed a completed capture." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        status: "COMPLETED",
        captureId: capture.id,
        message: "PAYMIND X Sandbox payment completed successfully.",
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error(
      "[PayPal capture-order]",
      error instanceof Error ? error.message : "Unknown error"
    );

    return NextResponse.json(
      { error: "Unable to verify or capture the Sandbox order." },
      {
        status: 502,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}

