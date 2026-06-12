export default function CancelPage() {
  return (
    <main className="min-h-screen px-6 py-10 text-white">
      <section className="mx-auto flex min-h-[calc(100vh-120px)] max-w-4xl flex-col items-center justify-center text-center">
        <div className="rounded-full border border-orange-400/30 bg-orange-400/10 px-5 py-2 text-sm font-black text-orange-200 shadow-lg shadow-orange-950/20">
          Checkout cancelled
        </div>

        <h1 className="mt-8 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">
          No payment was taken.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
          Your checkout was cancelled safely. You can return to Pro Football
          Intel, try checkout again, or contact support if you need help.
        </p>

        <div className="mt-10 grid w-full max-w-4xl gap-5 md:grid-cols-3">
          <div className="rounded-3xl border border-orange-400/20 bg-orange-400/10 p-5 text-left">
            <p className="text-3xl font-black text-orange-300">01</p>
            <p className="mt-3 font-bold text-white">Payment stopped</p>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Stripe checkout was cancelled before payment completion.
            </p>
          </div>

          <div className="rounded-3xl border border-blue-400/20 bg-blue-400/10 p-5 text-left">
            <p className="text-3xl font-black text-blue-300">02</p>
            <p className="mt-3 font-bold text-white">No charge made</p>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              No paid unlock reference was generated from this checkout attempt.
            </p>
          </div>

          <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5 text-left">
            <p className="text-3xl font-black text-emerald-300">03</p>
            <p className="mt-3 font-bold text-white">Try again anytime</p>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              You can safely restart checkout whenever you are ready.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="/test-checkout"
            className="rounded-full bg-emerald-400 px-6 py-4 text-sm font-black text-black transition hover:bg-emerald-300"
          >
            Try checkout again
          </a>

          <a
            href="/"
            className="rounded-full border border-white/10 bg-white/5 px-6 py-4 text-sm font-bold text-white transition hover:bg-white/10"
          >
            Checkout dashboard
          </a>

          <a
            href="https://profbint.com"
            className="rounded-full border border-blue-400/30 bg-blue-400/10 px-6 py-4 text-sm font-bold text-blue-100 transition hover:bg-blue-400/20"
          >
            Return to Pro Football Intel
          </a>
        </div>

        <p className="mt-8 text-sm text-zinc-500">
          Need help?{" "}
          <a
            href="mailto:support@profbint.com"
            className="font-bold text-orange-300 hover:text-orange-200"
          >
            support@profbint.com
          </a>
        </p>
      </section>
    </main>
  );
}