const portalCards = [
  {
    title: "Start checkout",
    href: "/test-checkout",
    description: "Run the secure Stripe checkout flow for premium access.",
    accent: "from-emerald-400 to-teal-300",
    border: "border-emerald-400/25",
    badge: "Payment",
  },
  {
    title: "Unlock lookup",
    href: "/unlock",
    description: "Quickly check whether a PFI unlock reference is valid.",
    accent: "from-blue-400 to-cyan-300",
    border: "border-blue-400/25",
    badge: "Validate",
  },
  {
    title: "Purchase details",
    href: "/purchase",
    description: "View product, amount, status, and purchase timestamps.",
    accent: "from-orange-400 to-amber-300",
    border: "border-orange-400/25",
    badge: "Receipt",
  },
  {
    title: "Unlock history",
    href: "/unlock-history",
    description: "Review the full unlock timeline and verification status.",
    accent: "from-fuchsia-400 to-purple-300",
    border: "border-fuchsia-400/25",
    badge: "History",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-10 text-white">
      <section className="mx-auto flex min-h-[calc(100vh-180px)] w-full max-w-7xl flex-col">
        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr]">
          <section>
            <div className="inline-flex rounded-full border border-orange-400/25 bg-orange-400/10 px-4 py-2 text-sm font-black text-orange-200 shadow-lg shadow-orange-950/20">
              2026/27 Season Checkout Portal
            </div>

            <h1 className="mt-8 max-w-4xl text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
              Payments, unlocks and purchase verification in one secure hub.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              The Pro Football Intel checkout portal handles premium prediction
              payments, secure unlock references, receipt lookup, and customer
              purchase verification separately from the main prediction app.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="/test-checkout"
                className="rounded-full bg-emerald-400 px-7 py-4 text-sm font-black text-black shadow-xl shadow-emerald-950/30 transition hover:bg-emerald-300"
              >
                Start test checkout
              </a>

              <a
                href="/unlock"
                className="rounded-full border border-blue-400/30 bg-blue-400/10 px-7 py-4 text-sm font-black text-blue-100 transition hover:bg-blue-400/20"
              >
                Check unlock reference
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
                <p className="text-3xl font-black text-emerald-300">01</p>
                <p className="mt-3 font-bold text-white">Pay securely</p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Stripe handles checkout while purchase data is saved safely.
                </p>
              </div>

              <div className="rounded-3xl border border-orange-400/20 bg-orange-400/10 p-5">
                <p className="text-3xl font-black text-orange-300">02</p>
                <p className="mt-3 font-bold text-white">Receive unlock</p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  A secure PFI reference is generated after confirmed payment.
                </p>
              </div>

              <div className="rounded-3xl border border-blue-400/20 bg-blue-400/10 p-5">
                <p className="text-3xl font-black text-blue-300">03</p>
                <p className="mt-3 font-bold text-white">Verify anytime</p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Customers can look up purchases and unlock history anytime.
                </p>
              </div>
            </div>
          </section>

          <aside className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.3em] text-emerald-200">
                  Customer portal
                </p>
                <h2 className="mt-2 text-2xl font-black text-white">
                  Checkout dashboard
                </h2>
              </div>

              <div className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-sm font-black text-emerald-200">
                Live
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              {portalCards.map((card) => (
                <a
                  key={card.href}
                  href={card.href}
                  className={`group rounded-3xl border ${card.border} bg-white/[0.045] p-5 transition hover:-translate-y-1 hover:bg-white/[0.075]`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div
                        className={`inline-flex rounded-full bg-gradient-to-r ${card.accent} px-3 py-1 text-xs font-black text-black`}
                      >
                        {card.badge}
                      </div>

                      <h3 className="mt-4 text-xl font-black text-white">
                        {card.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-zinc-400">
                        {card.description}
                      </p>
                    </div>

                    <span className="text-2xl text-zinc-500 transition group-hover:text-white">
                      →
                    </span>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-black/25 p-5">
              <p className="font-black text-white">Support</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Need help with a payment or unlock reference?
              </p>
              <a
                href="mailto:support@profbint.com"
                className="mt-3 inline-flex text-sm font-black text-emerald-300 hover:text-emerald-200"
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