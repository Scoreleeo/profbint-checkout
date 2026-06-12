const portalCards = [
  {
    title: "Start checkout",
    href: "/test-checkout",
    description: "Run secure Stripe checkout for premium access.",
    accent: "from-emerald-400 to-teal-300",
    border: "border-emerald-400/25",
    badge: "Payment",
  },
  {
    title: "Unlock lookup",
    href: "/unlock",
    description: "Check whether a PFI unlock reference is valid.",
    accent: "from-blue-400 to-cyan-300",
    border: "border-blue-400/25",
    badge: "Validate",
  },
  {
    title: "Purchase details",
    href: "/purchase",
    description: "View your receipt, status, amount, and dates.",
    accent: "from-orange-400 to-amber-300",
    border: "border-orange-400/25",
    badge: "Receipt",
  },
  {
    title: "Unlock history",
    href: "/unlock-history",
    description: "Review your full unlock timeline.",
    accent: "from-fuchsia-400 to-purple-300",
    border: "border-fuchsia-400/25",
    badge: "History",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen px-5 py-6 text-white sm:px-6 sm:py-10">
      <section className="mx-auto flex w-full max-w-7xl flex-col">
        <div className="grid gap-8 py-4 sm:py-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <section>
            <div className="inline-flex rounded-full border border-orange-400/25 bg-orange-400/10 px-4 py-2 text-xs font-black text-orange-200 shadow-lg shadow-orange-950/20 sm:text-sm">
              2026/27 Season Checkout Portal
            </div>

            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[0.95] tracking-tight text-white sm:mt-8 sm:text-6xl lg:text-7xl">
              Secure football checkout hub.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:mt-6 sm:text-lg sm:leading-8">
              Pay securely, receive your PFI unlock reference, and verify your
              Pro Football Intel purchase whenever you need it.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4">
              <a
                href="/test-checkout"
                className="rounded-full bg-emerald-400 px-6 py-3.5 text-center text-sm font-black text-black shadow-xl shadow-emerald-950/30 transition hover:bg-emerald-300 sm:px-7 sm:py-4"
              >
                Start checkout
              </a>

              <a
                href="/unlock"
                className="rounded-full border border-blue-400/30 bg-blue-400/10 px-6 py-3.5 text-center text-sm font-black text-blue-100 transition hover:bg-blue-400/20 sm:px-7 sm:py-4"
              >
                Check unlock reference
              </a>
            </div>

            <div className="mt-7 grid gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-4">
              <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-4 sm:p-5">
                <p className="text-2xl font-black text-emerald-300 sm:text-3xl">
                  01
                </p>
                <p className="mt-2 font-bold text-white sm:mt-3">
                  Pay securely
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Stripe handles checkout while your purchase is recorded.
                </p>
              </div>

              <div className="rounded-3xl border border-orange-400/20 bg-orange-400/10 p-4 sm:p-5">
                <p className="text-2xl font-black text-orange-300 sm:text-3xl">
                  02
                </p>
                <p className="mt-2 font-bold text-white sm:mt-3">
                  Receive unlock
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  A secure PFI reference is generated after payment.
                </p>
              </div>

              <div className="rounded-3xl border border-blue-400/20 bg-blue-400/10 p-4 sm:p-5">
                <p className="text-2xl font-black text-blue-300 sm:text-3xl">
                  03
                </p>
                <p className="mt-2 font-bold text-white sm:mt-3">
                  Verify anytime
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Look up your purchase and unlock history anytime.
                </p>
              </div>
            </div>
          </section>

          <aside className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-4 shadow-2xl shadow-black/30 backdrop-blur sm:rounded-[2rem] sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-200 sm:text-sm sm:tracking-[0.3em]">
                  Customer portal
                </p>
                <h2 className="mt-2 text-xl font-black text-white sm:text-2xl">
                  Checkout dashboard
                </h2>
              </div>

              <div className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-black text-emerald-200 sm:px-4 sm:py-2 sm:text-sm">
                Live
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:mt-6 sm:gap-4">
              {portalCards.map((card) => (
                <a
                  key={card.href}
                  href={card.href}
                  className={`group rounded-3xl border ${card.border} bg-white/[0.045] p-4 transition hover:-translate-y-1 hover:bg-white/[0.075] sm:p-5`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div
                        className={`inline-flex rounded-full bg-gradient-to-r ${card.accent} px-3 py-1 text-xs font-black text-black`}
                      >
                        {card.badge}
                      </div>

                      <h3 className="mt-3 text-lg font-black text-white sm:mt-4 sm:text-xl">
                        {card.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-zinc-400">
                        {card.description}
                      </p>
                    </div>

                    <span className="text-xl text-zinc-500 transition group-hover:text-white sm:text-2xl">
                      →
                    </span>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-5 rounded-3xl border border-white/10 bg-black/25 p-4 sm:mt-6 sm:p-5">
              <p className="font-black text-white">Support</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Need help with a payment or unlock reference?
              </p>
              <a
                href="mailto:support@profbint.com"
                className="mt-3 inline-flex text-sm font-black text-orange-300 hover:text-orange-200"
              >
                support@profbint.com
              </a>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}