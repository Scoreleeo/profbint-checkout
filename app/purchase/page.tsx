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

function formatProductName(productName?: string) {
  if (!productName) return "Pro Football Intel Premium Prediction";
  if (productName === "pro_football_intel_prediction") {
    return "Pro Football Intel Premium Prediction";
  }
  return productName;
}

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
    <main className="min-h-screen px-6 py-10 text-white">
      <section className="mx-auto flex min-h-[calc(100vh-120px)] max-w-5xl flex-col items-center justify-center text-center">
        <div className="rounded-full border border-orange-400/30 bg-orange-400/10 px-5 py-2 text-sm font-black text-orange-100 shadow-lg shadow-orange-950/20">
          Purchase details
        </div>

        <h1 className="mt-8 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
          View your football prediction purchase.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
          Enter your PFI unlock reference to view your secure purchase receipt,
          payment status, and unlock information.
        </p>

        <div className="mt-10 grid w-full gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-orange-400/20 bg-slate-950/60 p-6 text-left shadow-2xl shadow-orange-950/20 backdrop-blur">
            <form onSubmit={handleSubmit}>
              <label
                htmlFor="unlockReference"
                className="block text-sm font-black uppercase tracking-[0.25em] text-orange-200"
              >
                Unlock reference
              </label>

              <input
                id="unlockReference"
                value={reference}
                onChange={(event) => setReference(event.target.value)}
                placeholder="PFI_..."
                className="mt-4 w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-5 font-mono text-sm font-bold text-white outline-none transition placeholder:text-zinc-500 focus:border-orange-400/70"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="mt-5 w-full rounded-full bg-orange-400 px-6 py-4 text-sm font-black text-black shadow-xl shadow-orange-950/20 transition hover:bg-orange-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Loading..." : "View purchase details"}
              </button>
            </form>

            <div className="mt-6 rounded-3xl border border-blue-400/20 bg-blue-400/10 p-5">
              <p className="font-black text-blue-200">What this shows</p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                This page confirms your paid checkout record, purchase amount,
                unlock status, and receipt timestamps.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-left shadow-2xl shadow-black/20 backdrop-blur">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-blue-200">
              Receipt check
            </p>

            {purchase && result?.ok && result.valid ? (
              <>
                <p className="mt-5 break-all rounded-2xl border border-emerald-400/20 bg-black/35 px-5 py-5 font-mono text-sm font-black text-emerald-300">
                  {purchase.unlockReference}
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                    <p className="text-xs text-zinc-500">Status</p>
                    <p className="mt-1 font-black text-emerald-300">
                      {purchase.status}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-orange-400/20 bg-orange-400/10 p-4">
                    <p className="text-xs text-zinc-500">Amount</p>
                    <p className="mt-1 font-black text-white">
                      {formatAmount(purchase.amount, purchase.currency)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-blue-400/20 bg-blue-400/10 p-4 sm:col-span-2">
                    <p className="text-xs text-zinc-500">Product</p>
                    <p className="mt-1 font-black text-white">
                      {formatProductName(purchase.productName)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-fuchsia-400/20 bg-fuchsia-400/10 p-4">
                    <p className="text-xs text-zinc-500">Purchase created</p>
                    <p className="mt-1 font-black text-white">
                      {formatDate(purchase.purchaseCreatedAt)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                    <p className="text-xs text-zinc-500">Unlock created</p>
                    <p className="mt-1 font-black text-white">
                      {formatDate(purchase.unlockCreatedAt)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
                  <p className="font-black text-emerald-200">
                    Verified purchase
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    This reference belongs to a paid Pro Football Intel
                    prediction purchase and is recorded securely.
                  </p>
                </div>
              </>
            ) : result ? (
              <div className="mt-6 rounded-3xl border border-red-400/20 bg-red-400/10 p-5">
                <p className="text-sm font-black uppercase tracking-[0.3em] text-red-200">
                  Purchase not found
                </p>

                <p className="mt-4 text-sm leading-6 text-zinc-300">
                  {result.error ??
                    "This unlock reference could not be verified as a paid purchase. Please check the code and try again."}
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-4">
                <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
                  <p className="text-3xl font-black text-emerald-300">✓</p>
                  <p className="mt-2 font-bold text-white">Payment status</p>
                  <p className="mt-1 text-sm text-zinc-400">
                    Confirms whether your checkout was paid.
                  </p>
                </div>

                <div className="rounded-3xl border border-orange-400/20 bg-orange-400/10 p-5">
                  <p className="text-3xl font-black text-orange-300">£</p>
                  <p className="mt-2 font-bold text-white">Receipt value</p>
                  <p className="mt-1 text-sm text-zinc-400">
                    Shows the amount linked to the purchase.
                  </p>
                </div>

                <div className="rounded-3xl border border-blue-400/20 bg-blue-400/10 p-5">
                  <p className="text-3xl font-black text-blue-300">⚽</p>
                  <p className="mt-2 font-bold text-white">Premium access</p>
                  <p className="mt-1 text-sm text-zinc-400">
                    Links the purchase to Pro Football Intel prediction access.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="/unlock"
            className="rounded-full border border-blue-400/30 bg-blue-400/10 px-6 py-4 text-sm font-black text-blue-100 transition hover:bg-blue-400/20"
          >
            Unlock lookup
          </a>

          <a
            href="/unlock-history"
            className="rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-6 py-4 text-sm font-black text-fuchsia-100 transition hover:bg-fuchsia-400/20"
          >
            Unlock history
          </a>
        </div>
      </section>
    </main>
  );
}