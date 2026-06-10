"use client";

import { FormEvent, useState } from "react";

type ValidationResult = {
  valid: boolean;
  status?: string | null;
  productName?: string;
  amount?: number;
  currency?: string;
  unlockReference?: string;
  unlockCreatedAt?: string;
  purchaseCreatedAt?: string;
  error?: string;
};

export default function UnlockLookupPage() {
  const [reference, setReference] = useState("");
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanedReference = reference.trim().toUpperCase();

    if (!cleanedReference) {
      setResult({
        valid: false,
        error: "Please enter an unlock reference.",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        `/api/unlock/validate?ref=${encodeURIComponent(cleanedReference)}`,
      );

      const data = (await response.json()) as ValidationResult;
      setResult(data);
    } catch {
      setResult({
        valid: false,
        error: "Unable to check this unlock reference.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-3xl flex-col items-center justify-center text-center">
        <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-200">
          Unlock lookup
        </div>

        <h1 className="mt-8 text-4xl font-black tracking-tight sm:text-5xl">
          Check your unlock reference.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
          Enter your Pro Football Intel unlock reference to confirm whether your
          paid checkout has been recorded.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 w-full max-w-xl">
          <label
            htmlFor="unlockReference"
            className="block text-left text-sm font-semibold text-zinc-300"
          >
            Unlock reference
          </label>

          <input
            id="unlockReference"
            value={reference}
            onChange={(event) => setReference(event.target.value)}
            placeholder="PFI_..."
            className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-mono text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-emerald-400/60"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="mt-5 w-full rounded-full bg-emerald-400 px-6 py-4 text-sm font-bold text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Checking..." : "Check unlock reference"}
          </button>
        </form>

        {result ? (
          <div className="mt-8 w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-6 text-left shadow-2xl shadow-emerald-950/20">
            {result.valid ? (
              <>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">
                  Valid purchase
                </p>

                <p className="mt-4 break-all rounded-2xl border border-emerald-400/20 bg-black/30 px-4 py-4 font-mono text-sm font-bold text-emerald-300">
                  {result.unlockReference}
                </p>

                <div className="mt-5 space-y-2 text-sm text-zinc-300">
                  <p>
                    <span className="font-semibold text-white">Status:</span>{" "}
                    {result.status}
                  </p>
                  <p>
                    <span className="font-semibold text-white">Product:</span>{" "}
                    {result.productName}
                  </p>
                  <p>
                    <span className="font-semibold text-white">Amount:</span>{" "}
                    £{((result.amount ?? 0) / 100).toFixed(2)}
                  </p>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-200">
                  Not valid
                </p>

                <p className="mt-4 text-sm leading-6 text-zinc-300">
                  {result.error ??
                    "This unlock reference could not be verified as a paid purchase."}
                </p>
              </>
            )}
          </div>
        ) : null}

        <a
          href="https://profbint.com"
          className="mt-10 text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
        >
          Return to Pro Football Intel
        </a>
      </section>
    </main>
  );
}