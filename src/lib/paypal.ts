import { createHmac, timingSafeEqual } from "node:crypto";

type PayPalConfig = {
  clientId: string;
  clientSecret: string;
  baseUrl: string;
};

function getConfig(): PayPalConfig {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const baseUrl = process.env.PAYPAL_BASE_URL;

  if (!clientId || !clientSecret || !baseUrl) {
    throw new Error("PayPal server configuration is incomplete.");
  }

  if (!/^https:\/\/api-m\.sandbox\.paypal\.com$/.test(baseUrl) &&
      !/^https:\/\/api-m\.paypal\.com$/.test(baseUrl)) {
    throw new Error("PayPal API base URL is not an approved endpoint.");
  }

  return { clientId, clientSecret, baseUrl };
}

export async function getPayPalAccessToken(): Promise<string> {
  const config = getConfig();
  const credentials = Buffer.from(
    `${config.clientId}:${config.clientSecret}`
  ).toString("base64");

  const response = await fetch(`${config.baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`PayPal authentication failed (${response.status}).`);
  }

  const data = await response.json() as { access_token?: string };

  if (!data.access_token) {
    throw new Error("PayPal did not return an access token.");
  }

  return data.access_token;
}

export async function paypalRequest<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const config = getConfig();
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(`${config.baseUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });

  const responseText = await response.text();

  if (!response.ok) {
    let diagnostic: {
      name?: string;
      message?: string;
      debug_id?: string;
      details?: Array<{ issue?: string; description?: string }>;
    } = {};

    try {
      diagnostic = JSON.parse(responseText);
    } catch {
      // Do not log raw response bodies.
    }

    const issues = (diagnostic.details ?? [])
      .map((item) => {
        const issue = String(item.issue ?? "UNKNOWN").slice(0, 100);
        const description = String(item.description ?? "").slice(0, 250);
        return `${issue}: ${description}`;
      })
      .join(" | ");

    const safeMessage = [
      `PayPal API request failed (${response.status})`,
      diagnostic.name ? `name=${diagnostic.name}` : "",
      diagnostic.message ? `message=${String(diagnostic.message).slice(0, 300)}` : "",
      issues ? `issues=${issues}` : "",
      diagnostic.debug_id ? `debug_id=${diagnostic.debug_id}` : "",
    ].filter(Boolean).join("; ");

    throw new Error(safeMessage);
  }

  try {
    return JSON.parse(responseText) as T;
  } catch {
    throw new Error("PayPal returned an invalid JSON response.");
  }
}

// A proof binds a PayPal order ID to a server-generated timestamp.
// The signing key never leaves the server.
export function createOrderProof(orderId: string): string {
  const config = getConfig();
  const timestamp = Date.now().toString();
  const signature = createHmac("sha256", config.clientSecret)
    .update(`${orderId}.${timestamp}`)
    .digest("hex");

  return `${timestamp}.${signature}`;
}

export function verifyOrderProof(
  orderId: string,
  proof: string
): boolean {
  try {
    const config = getConfig();
    const parts = proof.split(".");

    if (parts.length !== 2) return false;

    const [timestampText, suppliedSignature] = parts;
    if (!/^\d{13}$/.test(timestampText)) return false;
    if (!/^[a-f0-9]{64}$/i.test(suppliedSignature)) return false;

    const timestamp = Number(timestampText);
    const age = Date.now() - timestamp;

    // Proofs are valid for two hours.
    if (!Number.isSafeInteger(timestamp) || age < 0 || age > 2 * 60 * 60 * 1000) {
      return false;
    }

    const expectedSignature = createHmac("sha256", config.clientSecret)
      .update(`${orderId}.${timestampText}`)
      .digest("hex");

    const expected = Buffer.from(expectedSignature, "hex");
    const supplied = Buffer.from(suppliedSignature, "hex");

    return expected.length === supplied.length &&
      timingSafeEqual(expected, supplied);
  } catch {
    return false;
  }
}

