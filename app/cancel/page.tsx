export default function CancelPage() {
  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-3xl flex-col items-center justify-center text-center">
        <div className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-sm font-semibold text-yellow-100">
          Checkout cancelled
        </div>

        <h1 className="mt-8 text-4xl font-black tracking-tight sm:text-5xl">
          No payment was taken.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
          Your checkout was cancelled safely. You can return to Pro Football
          Intel and try again when you are ready.
        </p>

        <a
          href="https://profbint.com"
          className="mt-10 rounded-full border border-white/10 bg-white/10 px-6 py-4 text-sm font-bold text-white transition hover:bg-white/15"
        >
          Return to Pro Football Intel
        </a>
      </section>
    </main>
  );
}