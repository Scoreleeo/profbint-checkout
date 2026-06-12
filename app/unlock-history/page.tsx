"use client";

import { FormEvent, useMemo, useState } from "react";

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

function getReferenceAge(value?: string) {
  if (!value) return "Not available";

  const createdAt = new Date(value).getTime();
  const now = Date.now();
  const diffMs = now - createdAt;

  if (Number.isNaN(createdAt) || diffMs < 0) {
    return "Not available";
  }

  const minutes = Math.floor(diffMs / 1000 / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days === 1 ? "" : "s"} old`;
  }

  if (hours > 0) {
    return `${hours} hour${hours === 1 ? "" : "s"} old`;
  }

  if (minutes > 0) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} old`;
  }

  return "Just created";
}

export default function UnlockHistoryPage() {
  const [reference, setReference] = useState("");
  const [result, setResult] = useState<DetailsResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const purchase = result?.purchase;

  const referenceAge = useMemo(() => {
    return getReferenceAge(purchase?.unlockCreatedAt);
  }, [purchase?.unlockCreatedAt]);

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
        error: "Unable to load unlock history.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-6 py-10 text-white">
      <section className="mx-auto flex min-h-[calc(100vh-120px)] max-w-6xl flex-col items-center justify-center text-center">
        <div className="rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-5 py-2 text-sm font-black text-fuchsia-100 shadow-lg shadow-fuchsia-950/20">
          Unlock history
        </div>

        <h1 className="mt-8 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
          Review your unlock timeline.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
          Enter your PFI unlock reference to review the full customer journey:
          purchase recorded, payment verified, and unlock generated.
        </p>

        <div className="mt-10 grid w-full gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-fuchsia-400/20 bg-slate-950/60 p-6 text-left shadow-2xl shadow-fuchsia-950/20 backdrop-blur">
            <form onSubmit={handleSubmit}>
              <label
                htmlFor="unlockReference"
                className="block text-sm font-black uppercase tracking-[0.25em] text-fuchsia-200"
              >
                Unlock reference
              </label>

              <input
                id="unlockReference"
                value={reference}
                onChange={(event) => setReference(event.target.value)}
                placeholder="PFI_..."
                className="mt-4 w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-5 font-mono text-sm font-bold text-white outline-none transition placeholder:text-zinc-500 focus:border-fuchsia-400/70"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="mt-5 w-full rounded-full bg-fuchsia-400 px-6 py-4 text-sm font-black text-black shadow-xl shadow-fuchsia-950/20 transition hover:bg-fuchsia-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Loading..." : "View unlock history"}
              </button>
            </form>

            <div className="mt-6 rounded-3xl border border-orange-400/20 bg-orange-400/10 p-5">
              <p className="font-black text-orange-200">Football checkout timeline</p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                This view helps confirm when your premium prediction purchase
                was created, paid, and unlocked.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-left shadow-2xl shadow-black/20 backdrop-blur">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-fuchsia-200">
              Timeline check
            </p>

            {result?.ok && result.valid && purchase ? (
              <>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-2xl font-black text-white">
                      Verified unlock
                    </p>
                    <p className="mt-2 text-sm text-zinc-400">
                      This reference belongs to a paid Pro Football Intel
                      prediction purchase.
                    </p>
                  </div>

                  <div className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-5 py-2 text-sm font-black text-emerald-200">
                    {purchase.status}
                  </div>
                </div>

                <p className="mt-6 break-all rounded-2xl border border-emerald-400/20 bg-black/35 px-5 py-5 font-mono text-sm font-black text-emerald-300">
                  {purchase.unlockReference}
                </p>

                <div className="mt-6 grid gap-4 lg:grid-cols-3">
                  <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
                    <p className="text-3xl font-black text-emerald-300">01</p>
                    <p className="mt-3 font-black text-white">
                      Purchase recorded
                    </p>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      {formatDate(purchase.purchaseCreatedAt)}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-blue-400/20 bg-blue-400/10 p-5">
                    <p className="text-3xl font-black text-blue-300">02</p>
                    <p className="mt-3 font-black text-white">
                      Payment verified
                    </p>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      Status: {purchase.status}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-orange-400/20 bg-orange-400/10 p-5">
                    <p className="text-3xl font-black text-orange-300">03</p>
                    <p className="mt-3 font-black text-white">
                      Unlock generated
                    </p>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      {formatDate(purchase.unlockCreatedAt)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <p className="text-xs text-zinc-500">Product</p>
                    <p className="mt-1 font-black text-white">
                      {formatProductName(purchase.productName)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <p className="text-xs text-zinc-500">Amount</p>
                    <p className="mt-1 font-black text-white">
                      {formatAmount(purchase.amount, purchase.currency)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <p className="text-xs text-zinc-500">Currency</p>
                    <p className="mt-1 font-black text-white">
                      {purchase.currency.toUpperCase()}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <p className="text-xs text-zinc-500">Reference age</p>
                    <p className="mt-1 font-black text-white">
                      {referenceAge}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
                  <p className="font-black text-emerald-200">
                    Verification complete
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    This purchase has been paid, verified, and recorded in the
                    Pro Football Intel checkout system.
                  </p>
                </div>
              </>
            ) : result ? (
              <div className="mt-6 rounded-3xl border border-red-400/20 bg-red-400/10 p-5">
                <p className="text-sm font-black uppercase tracking-[0.3em] text-red-200">
                  Unlock not found
                </p>

                <p className="mt-4 text-sm leading-6 text-zinc-300">
                  {result.error ??
                    "This unlock reference could not be verified as a paid purchase. Please check the code and try again."}
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-4">
                <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
                  <p className="text-3xl font-black text-emerald-300">01</p>
                  <p className="mt-2 font-bold text-white">Purchase created</p>
                  <p className="mt-1 text-sm text-zinc-400">
                    A checkout record is created when payment starts.
                  </p>
                </div>

                <div className="rounded-3xl border border-blue-400/20 bg-blue-400/10 p-5">
                  <p className="text-3xl font-black text-blue-300">02</p>
                  <p className="mt-2 font-bold text-white">Payment confirmed</p>
                  <p className="mt-1 text-sm text-zinc-400">
                    Stripe confirms the payment through the checkout system.
                  </p>
                </div>

                <div className="rounded-3xl border border-orange-400/20 bg-orange-400/10 p-5">
                  <p className="text-3xl font-black text-orange-300">03</p>
                  <p className="mt-2 font-bold text-white">Unlock issued</p>
                  <p className="mt-1 text-sm text-zinc-400">
                    A secure PFI reference is generated for customer access.
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
            href="/purchase"
            className="rounded-full border border-orange-400/30 bg-orange-400/10 px-6 py-4 text-sm font-black text-orange-100 transition hover:bg-orange-400/20"
          >
            Purchase details
          </a>

          <a
            href="https://profbint.com"
            className="rounded-full bg-emerald-400 px-6 py-4 text-sm font-black text-black transition hover:bg-emerald-300"
          >
            Return to Pro Football Intel
          </a>
        </div>
      </section>
    </main>
  );
}