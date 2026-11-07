"use client";
import Link from "next/link";

import { useState } from "react";
import { CheckCircle2, LoaderCircle, ShieldCheck } from "lucide-react";

type Result = {
  status?: string;
  captureId?: string;
  message?: string;
  error?: string;
};

export default function CheckoutSuccessPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  async function completeCapture() {
    setLoading(true);
    setResult(null);

    try {
      const stored = sessionStorage.getItem("paymind-paypal-pending");

      if (!stored) {
        throw new Error(
          "The pending Sandbox order was not found in this browser session. Please start checkout again."
        );
      }

      const pending = JSON.parse(stored) as {
        orderId?: string;
        proof?: string;
        createdAt?: number;
      };

      const returnedOrderId = new URLSearchParams(window.location.search).get("token");

      if (
        !pending.orderId ||
        !pending.proof ||
        !pending.createdAt ||
        !returnedOrderId ||
        returnedOrderId !== pending.orderId ||
        Date.now() - pending.createdAt > 2 * 60 * 60 * 1000
      ) {
        sessionStorage.removeItem("paymind-paypal-pending");
        throw new Error("The pending order proof is missing or expired.");
      }

      const response = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: pending.orderId,
          proof: pending.proof,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "PayPal capture could not be verified.");
      }

      if (data.status !== "COMPLETED") {
        throw new Error("PayPal has not confirmed a completed payment.");
      }

      sessionStorage.removeItem("paymind-paypal-pending");
      setResult(data);
    } catch (err) {
      setResult({
        error: err instanceof Error ? err.message : "Capture failed.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#080b14] px-5 py-16 text-white">
      <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center sm:p-10">
        {result?.status === "COMPLETED" ? (
          <>
            <CheckCircle2 className="mx-auto text-emerald-400" size={52} />
            <h1 className="mt-5 text-3xl font-bold">Sandbox payment completed</h1>
            <p className="mt-3 text-slate-400">{result.message}</p>
            <p className="mt-5 break-all text-xs text-slate-500">
              Capture reference: {result.captureId}
            </p>
          </>
        ) : (
          <>
            <ShieldCheck className="mx-auto text-blue-300" size={48} />
            <h1 className="mt-5 text-3xl font-bold">PayPal approval returned</h1>
            <p className="mt-3 leading-7 text-slate-400">
              If you approved the $1.00 USD Sandbox demo purchase in PayPal,
              select below to ask PAYMIND X to verify and capture it.
            </p>

            <button
              type="button"
              onClick={completeCapture}
              disabled={loading}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-4 font-semibold transition hover:bg-blue-500 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LoaderCircle className="animate-spin" size={18} />
                  Verifying with PayPal...
                </>
              ) : (
                "Verify approval and complete test payment"
              )}
            </button>

            {result?.error && (
              <p role="alert" className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-left text-sm text-red-300">
                {result.error}
              </p>
            )}
          </>
        )}

        <Link
          href="/"
          className="mt-8 inline-block text-sm text-slate-400 hover:text-white"
        >
          Return to PAYMIND X
        </Link>
      </div>
    </main>
  );
}

