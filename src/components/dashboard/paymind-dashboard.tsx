"use client";

import {
  useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Activity, ArrowUpRight, Bell, BrainCircuit, ChartNoAxesCombined, ChevronDown, CircleHelp, Command, CreditCard, Gem, LayoutDashboard, Menu, Settings, ShieldCheck, ShoppingBag, Sparkles, Wallet, X, Zap
} from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis
} from "recharts";

const chartData = [
  { month: "May", spending: 3200, budget: 5200 },
  { month: "Jun", spending: 4100, budget: 5200 },
  { month: "Jul", spending: 2900, budget: 5200 },
  { month: "Aug", spending: 4700, budget: 5200 },
  { month: "Sep", spending: 3600, budget: 5200 },
  { month: "Oct", spending: 3900, budget: 5200 },
];

const products = [
  {
    name: "Performance Laptop",
    category: "COMPUTING",
    price: "₹64,999",
    score: "94",
    color: "from-violet-500/25 to-indigo-500/5",
    icon: "💻",
    reason: "Strong programming and multitasking fit",
  },
  {
    name: "Wireless Headphones",
    category: "AUDIO",
    price: "₹8,499",
    score: "91",
    color: "from-cyan-500/20 to-blue-500/5",
    icon: "🎧",
    reason: "Balanced audio and everyday value",
  },
  {
    name: "Smart Tablet",
    category: "PRODUCTIVITY",
    price: "₹29,999",
    score: "88",
    color: "from-fuchsia-500/20 to-purple-500/5",
    icon: "📱",
    reason: "Portable productivity option",
  },
];

const activities = [
  { title: "Workspace initialized", detail: "PAYMIND X demo environment", time: "Just now", icon: Zap },
  { title: "AI intelligence module", detail: "Integration planned", time: "Upcoming", icon: BrainCircuit },
  { title: "PayPal Sandbox", detail: "Payment connection pending", time: "Upcoming", icon: CreditCard },
];

const navigation = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "AI Shopping", icon: BrainCircuit },
  { name: "Discover Products", icon: ShoppingBag },
  { name: "Transactions", icon: CreditCard },
  { name: "Analytics", icon: ChartNoAxesCombined },
];

export default function PaymindDashboard() {
  const router = useRouter();
  const [active, setActive] = useState("Overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [prompt, setPrompt] = useState("");

  return (
    <main className="min-h-screen bg-[#080b16] text-white">
      <div className="flex min-h-screen">
        {mobileOpen && (
          <button
            aria-label="Close navigation"
            className="fixed inset-0 z-30 bg-black/70 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <aside className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-white/[0.07] bg-[#0c1020] px-5 py-6 transition-transform lg:static lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="mb-11 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-lg shadow-violet-500/20">
                <Gem size={22} />
              </div>
              <div>
                <div className="text-lg font-black tracking-tight">PAYMIND <span className="text-violet-400">X</span></div>
                <div className="text-[9px] font-bold tracking-[0.25em] text-slate-500">INTELLIGENT COMMERCE</div>
              </div>
            </div>
            <button onClick={() => setMobileOpen(false)} className="lg:hidden text-slate-400"><X /></button>
          </div>

          <div className="mb-3 px-3 text-[10px] font-bold tracking-[0.2em] text-slate-600">WORKSPACE</div>
          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => { if (item.name === "Discover Products") { router.push("/discover"); } else if (item.name === "AI Shopping") { router.push("/ai-shopping"); } else { setActive(item.name); } setMobileOpen(false); }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all ${active === item.name ? "border border-violet-400/20 bg-violet-500/10 text-violet-300" : "text-slate-400 hover:bg-white/[0.04] hover:text-white"}`}
                >
                  <Icon size={18} />
                  {item.name}
                  {item.name === "AI Shopping" && <span className="ml-auto rounded-md bg-violet-500/20 px-2 py-0.5 text-[9px] text-violet-300">AI</span>}
                </button>
              );
            })}
          </nav>

          <div className="mt-9 mb-3 px-3 text-[10px] font-bold tracking-[0.2em] text-slate-600">PREFERENCES</div>
          <button className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 hover:bg-white/[0.04]"><Settings size={18} /> Settings</button>
          <button className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 hover:bg-white/[0.04]"><CircleHelp size={18} /> Help center</button>

          <div className="mt-auto rounded-2xl border border-violet-400/15 bg-gradient-to-br from-violet-500/15 to-cyan-500/[0.04] p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold text-violet-300"><Sparkles size={15} /> PAYMIND AI</div>
            <p className="text-xs leading-5 text-slate-400">Your purchase intelligence companion is being prepared.</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-violet-400 to-cyan-400" />
            </div>
            <div className="mt-2 text-[9px] text-slate-500">DEVELOPMENT PREVIEW</div>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-white/[0.07] bg-[#080b16]/90 px-5 backdrop-blur-xl md:px-8">
            <div className="flex items-center gap-3">
              <button className="text-slate-300 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu /></button>
              <div>
                <div className="text-sm font-semibold">{active}</div>
                <div className="text-[10px] text-slate-500">Your commerce intelligence workspace</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-500 sm:flex"><Command size={13} /> Search workspace <span className="ml-3">⌘ K</span></div>
              <button className="relative rounded-xl border border-white/10 p-2.5 text-slate-400 hover:text-white" aria-label="Notifications"><Bell size={17} /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-400" /></button>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/15 text-xs font-bold text-violet-300">PX</div>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] space-y-7 p-5 md:p-8">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-r from-[#211747] via-[#151638] to-[#10243b] p-6 md:p-9">
              <div className="pointer-events-none absolute -right-10 -top-28 h-72 w-72 rounded-full bg-violet-500/20 blur-[85px]" />
              <div className="pointer-events-none absolute bottom-[-100px] right-[30%] h-52 w-52 rounded-full bg-cyan-400/10 blur-[80px]" />
              <div className="relative max-w-2xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-white/[0.06] px-3 py-1.5 text-[10px] font-bold tracking-widest text-violet-200"><Sparkles size={13} /> INTELLIGENCE, MEETS COMMERCE</div>
                <h1 className="text-3xl font-black leading-tight tracking-tight md:text-5xl">Make every purchase <span className="bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent">smarter.</span></h1>
                <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">Discover better choices, understand your budget and stay in control of every payment.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button onClick={() => router.push("/ai-shopping")} className="rounded-xl bg-white px-5 py-3 text-xs font-bold text-[#15152c] shadow-xl shadow-black/20 transition hover:-translate-y-0.5"><Sparkles size={14} className="mr-2 inline" /> Explore AI shopping</button>
                  <button onClick={() => router.push("/discover")} className="rounded-xl border border-white/20 bg-white/[0.06] px-5 py-3 text-xs font-bold text-white hover:bg-white/10">Discover products <ArrowUpRight size={14} className="ml-2 inline" /></button>
                </div>
              </div>
              <div className="absolute right-10 top-1/2 hidden -translate-y-1/2 lg:block">
                <div className="flex h-44 w-44 items-center justify-center rounded-full border border-violet-300/20 bg-white/[0.025] shadow-[0_0_80px_rgba(139,92,246,0.12)]">
                  <div className="flex h-28 w-28 items-center justify-center rounded-full border border-cyan-300/20 bg-gradient-to-br from-violet-500/30 to-cyan-500/20"><BrainCircuit size={54} className="text-cyan-200" /></div>
                </div>
              </div>
            </motion.div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><h2 className="text-lg font-bold">Your overview</h2><p className="mt-1 text-xs text-slate-500">A preview of your commerce intelligence workspace</p></div>
              <span className="rounded-lg border border-amber-400/20 bg-amber-400/[0.07] px-3 py-1.5 text-[10px] font-bold tracking-wide text-amber-300">DEMO DATA · NOT REAL TRANSACTIONS</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Demo spending", value: "₹18,450", change: "Sample figure", icon: Wallet, color: "violet" },
                { label: "Demo savings", value: "₹6,200", change: "Illustrative only", icon: Gem, color: "cyan" },
                { label: "Purchases", value: "08", change: "Sample count", icon: ShoppingBag, color: "fuchsia" },
                { label: "Budget status", value: "Healthy", change: "Example scenario", icon: ShieldCheck, color: "emerald" },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className="rounded-2xl border border-white/[0.07] bg-[#101526] p-5 transition hover:border-violet-400/25">
                    <div className="flex items-center justify-between"><span className="text-xs text-slate-400">{stat.label}</span><div className="rounded-xl bg-white/[0.05] p-2 text-violet-300"><Icon size={18} /></div></div>
                    <div className="mt-4 text-2xl font-black tracking-tight">{stat.value}</div>
                    <div className="mt-2 text-[10px] text-slate-500">{stat.change}</div>
                  </motion.div>
                );
              })}
            </div>

            <div className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
              <div className="rounded-2xl border border-white/[0.07] bg-[#101526] p-5 md:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div><h3 className="font-bold">Spending intelligence</h3><p className="mt-1 text-xs text-slate-500">Illustrative monthly spending trend</p></div>
                  <span className="rounded-lg bg-white/[0.04] px-3 py-2 text-[10px] text-slate-400">6 MONTHS <ChevronDown size={12} className="ml-2 inline" /></span>
                </div>
                <div className="mt-6 h-[230px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs><linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9b87ff" stopOpacity={0.35} /><stop offset="100%" stopColor="#9b87ff" stopOpacity={0} /></linearGradient></defs>
                      <CartesianGrid stroke="#ffffff0b" vertical={false} />
                      <XAxis dataKey="month" stroke="#64748b" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                      <YAxis stroke="#64748b" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ background: "#171d31", border: "1px solid #34314e", borderRadius: 12, fontSize: 12 }} />
                      <Area type="monotone" dataKey="spending" stroke="#a78bfa" strokeWidth={3} fill="url(#spendGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-[#101526] p-5 md:p-6">
                <div className="flex items-center justify-between"><h3 className="font-bold">AI purchase advisor</h3><span className="rounded-md bg-violet-500/15 px-2 py-1 text-[9px] font-bold text-violet-300">PREVIEW</span></div>
                <p className="mt-2 text-xs leading-5 text-slate-500">Describe what you need. The AI shopping workflow will help evaluate your options.</p>
                <div className="mt-5 rounded-xl border border-violet-400/20 bg-violet-500/[0.06] p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-bold text-violet-300"><BrainCircuit size={15} /> Your intelligent shopping prompt</div>
                  <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Example: Find a laptop for programming under ₹65,000..." className="min-h-[90px] w-full resize-none bg-transparent text-sm text-white outline-none placeholder:text-slate-600" />
                  <button onClick={() => router.push("/ai-shopping")} className="mt-2 w-full rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 py-3 text-xs font-bold shadow-lg shadow-violet-900/20 hover:brightness-110"><Sparkles size={14} className="mr-2 inline" /> Open AI shopping workspace</button>
                  <p className="mt-2 text-[9px] text-slate-500">AI integration is not connected yet. This preview does not send your prompt to an AI model.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-bold">Explore recommendations</h2><p className="mt-1 text-xs text-slate-500">Illustrative catalogue cards · Not live product listings</p></div><button onClick={() => router.push("/discover")} className="text-xs font-semibold text-violet-300 hover:text-cyan-300">Explore catalogue <ArrowUpRight size={14} className="ml-1 inline" /></button></div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product, index) => (
                <motion.div key={product.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101526] transition hover:-translate-y-1 hover:border-violet-400/30">
                  <div className={`flex h-36 items-center justify-center bg-gradient-to-br ${product.color}`}><span className="text-6xl drop-shadow-xl">{product.icon}</span></div>
                  <div className="p-5">
                    <div className="text-[9px] font-bold tracking-[0.18em] text-violet-300">{product.category}</div>
                    <div className="mt-2 font-bold">{product.name}</div>
                    <div className="mt-1 text-xs text-slate-500">{product.reason}</div>
                    <div className="mt-5 flex items-end justify-between"><div><div className="text-[9px] text-slate-500">Illustrative price</div><div className="mt-1 text-lg font-black">{product.price}</div></div><div className="rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06] px-3 py-2 text-center"><div className="text-sm font-black text-cyan-300">{product.score}</div><div className="text-[8px] text-slate-500">SAMPLE SCORE</div></div></div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/[0.07] bg-[#101526] p-5">
                <h3 className="font-bold">Budget intelligence</h3>
                <p className="mt-1 text-xs text-slate-500">Illustrative budget scenario</p>
                <div className="mt-6 flex items-end justify-between"><span className="text-xs text-slate-400">Example budget used</span><span className="text-lg font-black">₹18,450 <span className="text-xs font-normal text-slate-500">/ ₹30,000</span></span></div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[61.5%] rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" /></div>
                <div className="mt-3 flex justify-between text-[10px] text-slate-500"><span>61.5% used</span><span>₹11,550 remaining</span></div>
              </div>
              <div className="rounded-2xl border border-white/[0.07] bg-[#101526] p-5">
                <h3 className="font-bold">Platform activity</h3>
                <p className="mt-1 text-xs text-slate-500">Development environment status</p>
                <div className="mt-5 space-y-4">
                  {activities.map((activity) => {
                    const Icon = activity.icon;
                    return <div key={activity.title} className="flex items-center gap-3"><div className="rounded-xl bg-white/[0.05] p-2.5 text-violet-300"><Icon size={17} /></div><div className="min-w-0 flex-1"><div className="text-xs font-semibold">{activity.title}</div><div className="mt-1 text-[10px] text-slate-500">{activity.detail}</div></div><span className="text-[9px] text-slate-500">{activity.time}</span></div>;
                  })}
                </div>
              </div>
            </div>

            <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] py-5 text-[10px] text-slate-600">
              <span>© 2026 PAYMIND X · AI COMMERCE INTELLIGENCE</span>
              <span className="flex items-center gap-2"><Activity size={12} /> DEVELOPMENT PREVIEW · SANDBOX NOT CONNECTED</span>
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}


