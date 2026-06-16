"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type BasketCheckoutItem = {
  fixtureId: string;
  matchName: string;
  returnUrl: string;
  price: number;
};

type BasketCheckoutResponse = {
  url?: string;
  error?: string;
};

function cleanText(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function cleanPrice(value: unknown) {
  if (typeof value !== "number") return 0;
  if (!Number.isFinite(value)) return 0;
  return value;
}

function parseBasketItems(value: string | null): BasketCheckoutItem[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => {
        const fixtureId = cleanText(item?.fixtureId);
        const matchName = cleanText(item?.matchName);
        const returnUrl = cleanText(item?.returnUrl);
        const price = cleanPrice(item?.price);

        return {
          fixtureId,
          matchName,
          returnUrl,
          price,
        };
      })
      .filter((item) => {
        return (
          item.fixtureId.length > 0 &&
          item.matchName.length > 0 &&
          item.returnUrl.length > 0 &&
          item.price > 0
        );
      })
      .slice(0, 20);
  } catch {
    return [];
  }
}

function formatAmount(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);
}

function BasketStartContent() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState("");

  const items = useMemo(() => {
    return parseBasketItems(searchParams.get("items"));
  }, [searchParams]);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price, 0);
  }, [items]);

  useEffect(() => {
    let isMounted = true;

    async function startBasketCheckout() {
      setErrorMessage("");

      if (items.length === 0) {
        setErrorMessage(
          "Your basket details are missing. Please return to Pro Football Intel and try again.",
        );
        return;
      }

      try {
        const response = await fetch("/api/basket/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items,
          }),
        });

        const data = (await response.json()) as BasketCheckoutResponse;

        if (!response.ok || !data.url) {
          throw new Error(data.error || "Unable to start basket checkout.");
        }

        window.location.href = data.url;
      } catch (error) {
        if (!isMounted) return;

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to start basket checkout.",
        );
      }
    }

    startBasketCheckout();

    return () => {
      isMounted = false;
    };
  }, [items]);

  return (
    <section className="mx-auto flex min-h-[calc(100vh-120px)] max-w-4xl flex-col items-center justify-center text-center">
      <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-5 py-2 text-sm font-black text-emerald-200 shadow-lg shadow-emerald-950/30">
        Starting basket checkout
      </div>

      <h1 className="mt-8 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">
        Preparing your prediction basket.
      </h1>

      <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
        Please wait while we create one secure checkout session for all selected
        Pro Football Intel match predictions.
      </p>

      <div className="mt-10 w-full rounded-[2rem] border border-white/10 bg-white/5 p-6 text-left shadow-2xl shadow-black/20 backdrop-blur">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-blue-200">
          Basket checkout
        </p>

        {items.length > 0 ? (
          <>
            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <div
                  key={item.fixtureId}
                  className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs text-zinc-500">Match</p>
                      <p className="mt-1 font-black text-white">
                        {item.matchName}
                      </p>
                      <p className="mt-2 break-all font-mono text-xs font-bold text-zinc-400">
                        Fixture ID: {item.fixtureId}
                      </p>
                    </div>

                    <p className="text-lg font-black text-emerald-300">
                      {formatAmount(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
              <div className="flex items-center justify-between gap-4">
                <p className="font-black text-emerald-200">Basket total</p>
                <p className="text-2xl font-black text-white">
                  {formatAmount(total)}
                </p>
              </div>

              <p className="mt-2 text-sm leading-6 text-zinc-300">
                Creating one Stripe payment for {items.length} prediction
                {items.length === 1 ? "" : "s"}.
              </p>
            </div>
          </>
        ) : null}

        {errorMessage ? (
          <div className="mt-6 rounded-3xl border border-red-400/20 bg-red-400/10 p-5">
            <p className="font-black text-red-200">
              Basket checkout could not start
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              {errorMessage}
            </p>

            <a
              href="https://profbint.com/basket"
              className="mt-5 block rounded-full bg-emerald-400 px-6 py-4 text-center text-sm font-black text-black transition hover:bg-emerald-300"
            >
              Return to Basket
            </a>
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
            <p className="font-black text-emerald-200">
              Creating Stripe session...
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              You will be redirected automatically.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function BasketStartFallback() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-120px)] max-w-3xl flex-col items-center justify-center text-center">
      <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-5 py-2 text-sm font-black text-emerald-200 shadow-lg shadow-emerald-950/30">
        Starting basket checkout
      </div>

      <h1 className="mt-8 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">
        Preparing your prediction basket.
      </h1>

      <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
        Loading basket checkout details...
      </p>
    </section>
  );
}

export default function BasketStartPage() {
  return (
    <main className="min-h-screen px-6 py-10 text-white">
      <Suspense fallback={<BasketStartFallback />}>
        <BasketStartContent />
      </Suspense>
    </main>
  );
}