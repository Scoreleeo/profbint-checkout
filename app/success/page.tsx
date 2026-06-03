export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-3xl flex-col items-center justify-center text-center">
        <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-200">
          Payment successful
        </div>

        <h1 className="mt-8 text-4xl font-black tracking-tight sm:text-5xl">
          Your checkout is complete.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
          Thanks for your purchase. Unlock verification will be connected in a
          later safe step. For now, you can return to Pro Football Intel.
        </p>

        <a
          href="https://profbint.com"
          className="mt-10 rounded-full bg-emerald-400 px-6 py-4 text-sm font-bold text-black transition hover:bg-emerald-300"
        >
          Return to Pro Football Intel
        </a>
      </section>
    </main>
  );
}