"use client";
import Link from "next/link";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";

type AIResult = {
  status?: string;
  provider?: string;
  recommendation?: string;
  message?: string;
  payment_authorized?: boolean;
};

export default function AIShoppingAssistant() {
  const [goal, setGoal] = useState("");
  const [budget, setBudget] = useState("");
  const [context, setContext] = useState("");
  const [result, setResult] = useState<AIResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal,
          ...(budget.trim() ? { budget: Number(budget), currency: "INR" } : {}),
          ...(context.trim() ? { context } : {}),
        }),
      });

      const data: AIResult = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to generate a recommendation.");
      }

      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#080b18] px-5 py-8 text-white md:px-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
          Back to dashboard
        </Link>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-br from-[#171632] via-[#11152b] to-[#101d32] p-7 md:p-10"
        >
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="relative">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/10 px-3 py-1.5 text-xs font-medium text-violet-200">
              <Sparkles className="h-3.5 w-3.5" />
              INTELLIGENT PURCHASE ADVISOR
            </div>

            <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
              Think smarter.
              <span className="block bg-gradient-to-r from-violet-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
                Shop wiser.
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
              Describe what you need. PAYMIND X uses AI to help you evaluate
              your priorities, budget and buying criteria before you purchase.
            </p>
          </div>
        </motion.section>

        <div className="mt-8 grid gap-7 lg:grid-cols-[1fr_0.9fr]">
          <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-violet-500/15 p-3 text-violet-300">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Your shopping brief</h2>
                <p className="text-sm text-slate-400">Tell the AI what matters.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="goal" className="mb-2 block text-sm font-medium text-slate-200">
                  What are you looking for?
                </label>
                <textarea
                  id="goal"
                  required
                  minLength={5}
                  maxLength={1000}
                  value={goal}
                  onChange={(event) => setGoal(event.target.value)}
                  placeholder="Example: I need a laptop for programming, machine learning and college work..."
                  className="min-h-32 w-full resize-y rounded-2xl border border-white/10 bg-[#0b1020] p-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/70"
                />
              </div>

              <div>
                <label htmlFor="budget" className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200">
                  <Wallet className="h-4 w-4 text-cyan-300" />
                  Your budget (? INR)
                </label>
                <input
                  id="budget"
                  type="number"
                  min="1"
                  max="100000000"
                  value={budget}
                  onChange={(event) => setBudget(event.target.value)}
                  placeholder="e.g. 70000"
                  className="w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-sm outline-none transition placeholder:text-slate-500 focus:border-cyan-400/70"
                />
              </div>

              <div>
                <label htmlFor="context" className="mb-2 block text-sm font-medium text-slate-200">
                  Additional requirements (optional)
                </label>
                <input
                  id="context"
                  maxLength={1000}
                  value={context}
                  onChange={(event) => setContext(event.target.value)}
                  placeholder="e.g. Lightweight, long battery life, 16 GB RAM..."
                  className="w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-sm outline-none transition placeholder:text-slate-500 focus:border-violet-400/70"
                />
              </div>

              <button
                type="submit"
                disabled={loading || goal.trim().length < 5}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-4 font-semibold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                    Thinking...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Generate AI recommendation
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-cyan-400/10 p-3 text-cyan-300">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">AI insights</h2>
                <p className="text-sm text-slate-400">Your purchase intelligence.</p>
              </div>
            </div>

            {loading && (
              <div className="flex min-h-64 flex-col items-center justify-center text-center">
                <LoaderCircle className="mb-4 h-9 w-9 animate-spin text-violet-300" />
                <p className="font-medium">Analyzing your shopping needs</p>
                <p className="mt-2 text-sm text-slate-400">Preparing your recommendation...</p>
              </div>
            )}

            {!loading && !result && !error && (
              <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 p-6 text-center">
                <BrainCircuit className="mb-4 h-12 w-12 text-violet-300/70" />
                <p className="font-medium text-slate-200">Your insights will appear here</p>
                <p className="mt-2 max-w-xs text-sm leading-6 text-slate-400">
                  Submit your shopping brief to receive AI-generated buying guidance.
                </p>
              </div>
            )}

            {error && (
              <div role="alert" className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5 text-sm leading-7 text-amber-200">
                {error}
              </div>
            )}

            {result?.recommendation && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-violet-300/20 bg-violet-400/5 p-5"
              >
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-violet-200">
                  <Sparkles className="h-4 w-4" />
                  {result.provider || "AI"} recommendation
                </div>
                <div className="whitespace-pre-wrap text-sm leading-7 text-slate-200">
                  {result.recommendation}
                </div>
              </motion.div>
            )}
          </section>
        </div>

        <div className="mt-7 flex items-start gap-3 rounded-2xl border border-emerald-400/15 bg-emerald-400/5 p-5">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
          <p className="text-xs leading-6 text-slate-300">
            <strong className="text-emerald-200">Your payment stays under your control.</strong>
            {" "}AI recommendations do not authorize transactions. Any future PayPal payment
            requires your explicit approval through checkout. Product prices and availability
            are not verified by this AI advice endpoint.
          </p>
        </div>
      </div>
    </main>
  );
}
