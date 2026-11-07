"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, Search, ShoppingBag, Laptop, Headphones,
  Smartphone, PackageSearch, ShieldCheck, Sparkles
} from "lucide-react";

const categories = [
  { name: "All products", icon: ShoppingBag },
  { name: "Laptops", icon: Laptop },
  { name: "Audio", icon: Headphones },
  { name: "Mobiles", icon: Smartphone },
];

export default function ProductDiscovery() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All products");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(
    "Search will become available when the eBay product provider is connected."
  );

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!query.trim()) {
      setMessage("Enter a product name to begin your search.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `/api/products?q=${encodeURIComponent(query.trim())}&category=${encodeURIComponent(category)}`
      );
      const data = await response.json();
      setMessage(data.message || "Product provider is not available yet.");
    } catch {
      setMessage("Could not contact the product service. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#080b16] px-5 py-7 text-white md:px-9">
      <div className="mx-auto max-w-[1250px]">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-slate-400 transition hover:text-white">
          <ArrowLeft size={15} /> Back to overview
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mt-7 overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-br from-[#211747] via-[#151638] to-[#10243b] p-7 md:p-10"
        >
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-violet-500/20 blur-[90px]" />
          <div className="relative max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-white/[0.06] px-3 py-1.5 text-[10px] font-bold tracking-widest text-violet-200">
              <Sparkles size={13} /> SMART PRODUCT DISCOVERY
            </div>
            <h1 className="text-3xl font-black tracking-tight md:text-5xl">
              Find products.
              <span className="block bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent">
                Choose with confidence.
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">
              Search products, compare available options and make more informed
              shopping decisions with PAYMIND X.
            </p>
          </div>
        </motion.div>

        <section className="mt-7 rounded-2xl border border-white/[0.08] bg-[#101526] p-5 md:p-7">
          <div className="mb-5">
            <h2 className="text-lg font-bold">Discover products</h2>
            <p className="mt-1 text-xs text-slate-500">
              Product search provider: eBay Browse API · Connection pending
            </p>
          </div>

          <form onSubmit={handleSearch}>
            <label htmlFor="product-query" className="mb-2 block text-xs font-semibold text-slate-300">
              What are you looking for?
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-white/10 bg-[#080b16] px-4 focus-within:border-violet-400/50">
                <Search size={18} className="shrink-0 text-slate-500" />
                <input
                  id="product-query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Example: laptop for programming"
                  className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-600"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-7 py-3 text-xs font-bold transition hover:brightness-110 disabled:opacity-50"
              >
                {loading ? "Checking..." : "Search products"}
                <Search size={14} className="ml-2 inline" />
              </button>
            </div>

            <div className="mt-5">
              <p className="mb-3 text-[10px] font-bold tracking-widest text-slate-500">
                PRODUCT CATEGORY
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.map((item) => {
                  const Icon = item.icon;
                  const selected = category === item.name;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setCategory(item.name)}
                      className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs transition ${
                        selected
                          ? "border-violet-400/40 bg-violet-500/15 text-violet-200"
                          : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <Icon size={14} />
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </form>
        </section>

        <section className="mt-5 rounded-2xl border border-dashed border-violet-400/20 bg-[#101526]/70 px-5 py-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
            <PackageSearch size={30} />
          </div>
          <h2 className="mt-5 text-lg font-bold">Your product results will appear here</h2>
          <p className="mx-auto mt-2 max-w-lg text-xs leading-6 text-slate-400">
            Live product listings, seller information, images and prices will
            be displayed after the eBay Browse API integration is completed.
            No sample listings are being presented as real products.
          </p>

          {message && (
            <div className="mx-auto mt-6 max-w-xl rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-4 text-xs leading-5 text-amber-200">
              {message}
            </div>
          )}

          <div className="mt-7 flex flex-wrap items-center justify-center gap-5 text-[10px] text-slate-500">
            <span className="inline-flex items-center gap-2"><ShieldCheck size={13} /> Verified provider data planned</span>
            <span className="inline-flex items-center gap-2"><Sparkles size={13} /> AI comparison planned</span>
          </div>
        </section>

        <footer className="mt-8 border-t border-white/[0.07] py-5 text-[10px] text-slate-600">
          PAYMIND X · PRODUCT DISCOVERY · DEVELOPMENT PREVIEW
        </footer>
      </div>
    </main>
  );
}
