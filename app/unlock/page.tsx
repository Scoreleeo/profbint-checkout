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

function formatProductName(productName?: string) {
  if (!productName) return "Pro Football Intel Premium Prediction";
  if (productName === "pro_football_intel_prediction") {
    return "Pro Football Intel Premium Prediction";
  }
  return productName;
}

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
    <main className="min-h-screen px-6 py-10 text-white">
      <section className="mx-auto flex min-h-[calc(100vh-120px)] max-w-5xl flex-col items-center justify-center text-center">
        <div className="rounded-full border border-blue-400/30 bg-blue-400/10 px-5 py-2 text-sm font-black text-blue-100 shadow-lg shadow-blue-950/20">
          Unlock lookup
        </div>

        <h1 className="mt-8 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
          Check your PFI unlock reference.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
          Enter your Pro Football Intel unlock reference to confirm whether your
          paid checkout is valid and ready for premium prediction access.
        </p>

        <div className="mt-10 grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-blue-400/20 bg-slate-950/60 p-6 text-left shadow-2xl shadow-blue-950/20 backdrop-blur">
            <form onSubmit={handleSubmit}>
              <label
                htmlFor="unlockReference"
                className="block text-sm font-black uppercase tracking-[0.25em] text-blue-200"
              >
                Unlock reference
              </label>

              <input
                id="unlockReference"
                value={reference}
                onChange={(event) => setReference(event.target.value)}
                placeholder="PFI_..."
                className="mt-4 w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-5 font-mono text-sm font-bold text-white outline-none transition placeholder:text-zinc-500 focus:border-blue-400/70"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="mt-5 w-full rounded-full bg-blue-400 px-6 py-4 text-sm font-black text-black shadow-xl shadow-blue-950/20 transition hover:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Checking..." : "Check unlock reference"}
              </button>
            </form>

            <div className="mt-6 rounded-3xl border border-orange-400/20 bg-orange-400/10 p-5">
              <p className="font-black text-orange-200">Where do I find it?</p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                Your PFI unlock reference is shown on the success page after a
                verified payment. It starts with <strong>PFI_</strong>.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-left shadow-2xl shadow-black/20 backdrop-blur">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-emerald-200">
              Matchday access check
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
                <p className="text-3xl font-black text-emerald-300">✓</p>
                <p className="mt-2 font-bold text-white">Payment recorded</p>
                <p className="mt-1 text-sm text-zinc-400">
                  Confirms the reference belongs to a paid checkout.
                </p>
              </div>

              <div className="rounded-3xl border border-blue-400/20 bg-blue-400/10 p-5">
                <p className="text-3xl font-black text-blue-300">🔒</p>
                <p className="mt-2 font-bold text-white">Unlock verified</p>
                <p className="mt-1 text-sm text-zinc-400">
                  Checks the secure unlock record stored in checkout.
                </p>
              </div>

              <div className="rounded-3xl border border-orange-400/20 bg-orange-400/10 p-5">
                <p className="text-3xl font-black text-orange-300">⚽</p>
                <p className="mt-2 font-bold text-white">Ready for football</p>
                <p className="mt-1 text-sm text-zinc-400">
                  Built for premium prediction access this season.
                </p>
              </div>
            </div>
          </div>
        </div>

        {result ? (
          <div className="mt-8 w-full max-w-3xl rounded-[2rem] border border-white/10 bg-slate-950/65 p-6 text-left shadow-2xl shadow-black/20 backdrop-blur">
            {result.valid ? (
              <>
                <p className="text-sm font-black uppercase tracking-[0.3em] text-emerald-200">
                  Valid paid purchase
                </p>

                <p className="mt-4 break-all rounded-2xl border border-emerald-400/20 bg-black/35 px-5 py-5 font-mono text-sm font-black text-emerald-300">
                  {result.unlockReference}
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                    <p className="text-xs text-zinc-500">Status</p>
                    <p className="mt-1 font-black text-emerald-300">
                      {result.status}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-blue-400/20 bg-blue-400/10 p-4">
                    <p className="text-xs text-zinc-500">Product</p>
                    <p className="mt-1 font-black text-white">
                      {formatProductName(result.productName)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-orange-400/20 bg-orange-400/10 p-4">
                    <p className="text-xs text-zinc-500">Amount</p>
                    <p className="mt-1 font-black text-white">
                      £{((result.amount ?? 0) / 100).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="/purchase"
                    className="rounded-full border border-orange-400/30 bg-orange-400/10 px-5 py-3 text-center text-sm font-black text-orange-100 transition hover:bg-orange-400/20"
                  >
                    View purchase details
                  </a>

                  <a
                    href="/unlock-history"
                    className="rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-5 py-3 text-center text-sm font-black text-fuchsia-100 transition hover:bg-fuchsia-400/20"
                  >
                    View unlock history
                  </a>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm font-black uppercase tracking-[0.3em] text-red-200">
                  Unlock not found
                </p>

                <p className="mt-4 text-sm leading-6 text-zinc-300">
                  {result.error ??
                    "This unlock reference could not be verified as a paid purchase. Please check the code and try again."}
                </p>
              </>
            )}
          </div>
        ) : null}
      </section>
    </main>
  );
}