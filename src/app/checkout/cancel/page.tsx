export default function CheckoutCancelPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080b14] px-5 py-16 text-white">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
        <div className="text-4xl">↩</div>
        <h1 className="mt-5 text-3xl font-bold">Checkout cancelled</h1>
        <p className="mt-3 leading-7 text-slate-400">
          The Sandbox checkout was cancelled. No capture was requested by
          PAYMIND X.
        </p>
        <a
          href="/checkout"
          className="mt-8 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500"
        >
          Return to demo checkout
        </a>
      </div>
    </main>
  );
}
