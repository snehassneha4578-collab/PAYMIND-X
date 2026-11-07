import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createOrderProof, paypalRequest } from "@/lib/paypal";

const DEMO_PRODUCT_ID = "sandbox-demo";
const DEMO_PRODUCT_NAME = "PAYMIND X Sandbox Demo Purchase";
const DEMO_AMOUNT = "1.00";

type PayPalOrderResponse = {
  id?: string;
  links?: Array<{ href: string; rel: string }>;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    // Only the predefined demo item is accepted.
    // No client-supplied amount, currency, or product price is trusted.
    if (!body || body.productId !== DEMO_PRODUCT_ID) {
      return NextResponse.json(
        { error: "Invalid demo product." },
        { status: 400 }
      );
    }

    const origin = request.nextUrl.origin;

    const order = await paypalRequest<PayPalOrderResponse>(
      "/v2/checkout/orders",
      {
        method: "POST",
        headers: {
          "PayPal-Request-Id": randomUUID(),
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              reference_id: "PAYMIND-X-SANDBOX-DEMO",
              custom_id: "PAYMIND-X-SANDBOX-DEMO",
              description: DEMO_PRODUCT_NAME,
              amount: {
                currency_code: "USD",
                value: DEMO_AMOUNT,
                breakdown: {
                  item_total: {
                    currency_code: "USD",
                    value: DEMO_AMOUNT,
                  },
                },
              },
              items: [
                {
                  name: DEMO_PRODUCT_NAME,
                  quantity: "1",
                  unit_amount: {
                    currency_code: "USD",
                    value: DEMO_AMOUNT,
                  },
                  category: "DIGITAL_GOODS",
                },
              ],
            },
          ],
          application_context: {
            brand_name: "PAYMIND X",
            user_action: "PAY_NOW",
            shipping_preference: "NO_SHIPPING",
            return_url: `${origin}/checkout/success`,
            cancel_url: `${origin}/checkout/cancel`,
          },
        }),
      }
    );

    const approvalLink = order.links?.find(
      (link) => link.rel === "approve" || link.rel === "payer-action"
    );

    if (!order.id || !approvalLink?.href) {
      throw new Error("PayPal did not return a usable approval link.");
    }

    return NextResponse.json(
      {
        orderId: order.id,
        approveUrl: approvalLink.href,
        proof: createOrderProof(order.id),
      },
      {
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (error) {
    console.error(
      "[PayPal create-order]",
      error instanceof Error ? error.message : "Unknown error"
    );

    return NextResponse.json(
      { error: "Unable to create the Sandbox demo order." },
      {
        status: 502,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}

