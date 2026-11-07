"use client";
import Link from "next/link";

import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ReceiptText,
} from "lucide-react";

type DemoTransaction = {
  reference: string;
  amount: string;
  currency: string;
  status: "SIMULATED";
  createdAt: string;
};

export default function CheckoutPage() {
  const [transaction, setTransaction] = useState<DemoTransaction | null>(null);

  function runDemo() {
    const simulatedTransaction: DemoTransaction = {
      reference: `PMX-DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      amount: "1.00",
      currency: "USD",
      status: "SIMULATED",
      createdAt: new Date().toISOString(),
    };

    sessionStorage.setItem(
      "paymind-demo-transaction",
      JSON.stringify(simulatedTransaction)
    );

    setTransaction(simulatedTransaction);
  }

  return (
    <main className="min-h-screen bg-[#080b14] px-5 py-16 text-white">
      <div className="mx-auto max-w-xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to PAYMIND X
        </Link>

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-7 shadow-2xl sm:p-9">
          <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300">
            <ShieldCheck size={25} />
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-300">
            PAYMIND X · Demo Environment
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight">
            No-payment demo checkout
          </h1>

          <p className="mt-3 leading-7 text-slate-400">
            Explore the checkout experience without signing in to PayPal,
            entering card details, approving an order, or making a payment.
          </p>

          <div className="my-8 rounded-2xl border border-white/10 bg-black/20 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">
                  PAYMIND X Demo Transaction
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Illustrative transaction only
                </p>
              </div>
              <p className="text-2xl font-bold">$1.00</p>
            </div>

            <div className="mt-4 border-t border-white/10 pt-3 text-xs text-slate-500">
              Fixed illustrative amount · USD · No money transferred
            </div>
          </div>

          {!transaction ? (
            <button
              type="button"
              onClick={runDemo}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-4 font-semibold transition hover:bg-blue-500"
            >
              <Sparkles size={18} />
              Run no-payment demo
              <ArrowLeft className="rotate-180" size={18} />
            </button>
          ) : (
            <div
              role="status"
              className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.07] p-5"
            >
              <CheckCircle2
                className="text-emerald-400"
                size={30}
              />

              <h2 className="mt-3 text-xl font-bold">
                Demo flow completed
              </h2>

              <p className="mt-2 text-sm font-semibold text-emerald-300">
                SIMULATED — NOT A REAL PAYPAL PAYMENT
              </p>

              <div className="mt-5 space-y-3 border-t border-white/10 pt-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400">Demo reference</span>
                  <span className="break-all text-right font-mono text-slate-200">
                    {transaction.reference}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Illustrative amount</span>
                  <span className="font-semibold">
                    {transaction.currency} {transaction.amount}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Status</span>
                  <span className="font-semibold text-emerald-300">
                    {transaction.status}
                  </span>
                </div>
              </div>

              <p className="mt-5 text-xs leading-5 text-slate-400">
                This result was generated locally in your browser.
                No PayPal API request, order approval, capture, or money
                transfer occurred.
              </p>

              <button
                type="button"
                onClick={() => setTransaction(null)}
                className="mt-5 w-full rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
              >
                Run demo again
              </button>
            </div>
          )}

          <div className="mt-6 flex items-start gap-3 rounded-xl border border-blue-400/10 bg-blue-400/[0.04] p-4">
            <ReceiptText
              className="mt-0.5 shrink-0 text-blue-300"
              size={18}
            />
            <p className="text-xs leading-5 text-slate-400">
              Demo Mode is separate from the PayPal Sandbox integration.
              The existing PayPal backend routes and credentials are
              preserved, but this page does not invoke them.
            </p>
          </div>

          <p className="mt-5 text-center text-xs text-slate-500">
            Simulation only · No real purchase · No payment authorization
          </p>
        </section>
      </div>
    </main>
  );
}
