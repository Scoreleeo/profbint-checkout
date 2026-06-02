export default function Home() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
              Pro Football Intel
            </p>
            <h1 className="mt-2 text-xl font-bold tracking-tight text-white">
              Secure Checkout
            </h1>
          </div>

          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
            2026/27 Season Ready
          </div>
        </header>

        <div className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <section>
            <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-200">
              Premium prediction access
            </div>

            <h2 className="mt-8 max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Unlock football predictions with a clean, secure payment flow.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              This checkout area is being prepared for Pro Football Intel locked
              predictions. Payment will be handled here separately from the main
              prediction site, keeping the public app stable and focused.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-2xl font-bold text-white">1</p>
                <p className="mt-2 text-sm text-zinc-300">
                  Choose a locked prediction on profbint.com.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-2xl font-bold text-white">2</p>
                <p className="mt-2 text-sm text-zinc-300">
                  Complete secure checkout here.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-2xl font-bold text-white">3</p>
                <p className="mt-2 text-sm text-zinc-300">
                  Return and unlock the prediction.
                </p>
              </div>
            </div>

            <div className="mt-10 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-5 text-sm leading-6 text-yellow-100">
              Stripe checkout is not active yet. This page is Phase 1 only:
              branding, structure, and checkout foundation.
            </div>
          </section>

          <aside className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-emerald-950/20 backdrop-blur">
            <div className="rounded-2xl bg-[#07111f] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-400">
                Checkout preview
              </p>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">
                      Locked Match Prediction
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">
                      Premium football intelligence
                    </p>
                  </div>

                  <div className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-300">
                    Secure
                  </div>
                </div>

                <div className="mt-6 space-y-3 text-sm text-zinc-300">
                  <div className="flex justify-between">
                    <span>Prediction access</span>
                    <span>Coming soon</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment provider</span>
                    <span>Stripe later</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span>Foundation ready</span>
                  </div>
                </div>

                <div className="mt-6 h-px bg-white/10" />

                <button
                  type="button"
                  disabled
                  className="mt-6 w-full cursor-not-allowed rounded-full bg-zinc-700 px-5 py-4 text-sm font-bold text-zinc-300"
                >
                  Checkout coming soon
                </button>
              </div>

              <p className="mt-6 text-sm leading-6 text-zinc-400">
                Real payment buttons, success pages, cancel pages, and unlock
                verification will be added later in small safe steps.
              </p>
            </div>
          </aside>
        </div>

        <footer className="border-t border-white/10 py-6 text-sm text-zinc-500">
          © 2026 Pro Football Intel. Checkout app foundation.
        </footer>
      </section>
    </main>
  );
}