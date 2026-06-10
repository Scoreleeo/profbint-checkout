"use client";

import { FormEvent, useState } from "react";

type PurchaseDetails = {
  id: string;
  productName: string;
  amount: number;
  currency: string;
  status: string;
  unlockReference: string;
  unlockCreatedAt: string;
  purchaseCreatedAt: string;
};

type DetailsResult = {
  ok: boolean;
  valid?: boolean;
  purchase?: PurchaseDetails;
  status?: string | null;
  unlockReference?: string | null;
  error?: string;
};

function formatDate(value?: string) {
  if (!value) return "Not available";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatAmount(amount?: number, currency?: string) {
  if (typeof amount !== "number") return "Not available";

  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency?.toUpperCase() || "GBP",
  }).format(amount / 100);
}

export default function PurchaseDetailsPage() {
  const [reference, setReference] = useState("");
  const [result, setResult] = useState<DetailsResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanedReference = reference.trim().toUpperCase();

    if (!cleanedReference) {
      setResult({
        ok: false,
        error: "Please enter an unlock reference.",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        `/api/unlock/details?ref=${encodeURIComponent(cleanedReference)}`,
      );

      const data = (await response.json()) as DetailsResult;
      setResult(data);
    } catch {
      setResult({
        ok: false,
        error: "Unable to load purchase details.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const purchase = result?.purchase;

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-3xl flex-col items-center justify-center text-center">
        <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-200">
          Purchase details
        </div>

        <h1 className="mt-8 text-4xl font-black tracking-tight sm:text-5xl">
          View your purchase.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
          Enter your Pro Football Intel unlock reference to view your recorded
          purchase details.
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
            {isLoading ? "Loading..." : "View purchase details"}
          </button>
        </form>

        {result ? (
          <div className="mt-8 w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-6 text-left shadow-2xl shadow-emerald-950/20">
            {result.ok && result.valid && purchase ? (
              <>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">
                  Valid paid purchase
                </p>

                <p className="mt-4 break-all rounded-2xl border border-emerald-400/20 bg-black/30 px-4 py-4 font-mono text-sm font-bold text-emerald-300">
                  {purchase.unlockReference}
                </p>

                <div className="mt-6 grid gap-4 text-sm text-zinc-300 sm:grid-cols-2">
                  <div>
                    <p className="text-zinc-500">Status</p>
                    <p className="mt-1 font-bold text-white">
                      {purchase.status}
                    </p>
                  </div>

                  <div>
                    <p className="text-zinc-500">Product</p>
                    <p className="mt-1 font-bold text-white">
                      {purchase.productName}
                    </p>
                  </div>

                  <div>
                    <p className="text-zinc-500">Amount</p>
                    <p className="mt-1 font-bold text-white">
                      {formatAmount(purchase.amount, purchase.currency)}
                    </p>
                  </div>

                  <div>
                    <p className="text-zinc-500">Currency</p>
                    <p className="mt-1 font-bold text-white">
                      {purchase.currency.toUpperCase()}
                    </p>
                  </div>

                  <div>
                    <p className="text-zinc-500">Purchase created</p>
                    <p className="mt-1 font-bold text-white">
                      {formatDate(purchase.purchaseCreatedAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-zinc-500">Unlock created</p>
                    <p className="mt-1 font-bold text-white">
                      {formatDate(purchase.unlockCreatedAt)}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-200">
                  Purchase not found
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
          href="/unlock"
          className="mt-10 text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
        >
          Back to unlock lookup
        </a>
      </section>
    </main>
  );
}