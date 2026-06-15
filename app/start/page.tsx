"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type CheckoutResponse = {
  url?: string;
  error?: string;
};

function cleanValue(value: string | null) {
  if (!value) return "";
  return value.trim();
}

function StartCheckoutContent() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState("");

  const fixtureId = useMemo(() => {
    return cleanValue(searchParams.get("fixtureId"));
  }, [searchParams]);

  const matchName = useMemo(() => {
    return cleanValue(searchParams.get("matchName"));
  }, [searchParams]);

  const returnUrl = useMemo(() => {
    return cleanValue(searchParams.get("returnUrl"));
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;

    async function startCheckout() {
      setErrorMessage("");

      if (!fixtureId || !matchName || !returnUrl) {
        setErrorMessage(
          "Missing match details. Please return to Pro Football Intel and try again.",
        );
        return;
      }

      try {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fixtureId,
            matchName,
            returnUrl,
          }),
        });

        const data = (await response.json()) as CheckoutResponse;

        if (!response.ok || !data.url) {
          throw new Error(data.error || "Unable to start checkout.");
        }

        window.location.href = data.url;
      } catch (error) {
        if (!isMounted) return;

        setErrorMessage(
          error instanceof Error ? error.message : "Unable to start checkout.",
        );
      }
    }

    startCheckout();

    return () => {
      isMounted = false;
    };
  }, [fixtureId, matchName, returnUrl]);

  return (
    <section className="mx-auto flex min-h-[calc(100vh-120px)] max-w-3xl flex-col items-center justify-center text-center">
      <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-5 py-2 text-sm font-black text-emerald-200 shadow-lg shadow-emerald-950/30">
        Starting secure checkout
      </div>

      <h1 className="mt-8 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">
        Preparing your match unlock.
      </h1>

      <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
        Please wait while we create your secure Pro Football Intel checkout
        session.
      </p>

      <div className="mt-10 w-full max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 p-6 text-left shadow-2xl shadow-black/20 backdrop-blur">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-blue-200">
          Match checkout
        </p>

        <div className="mt-6 grid gap-4">
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
            <p className="text-xs text-zinc-500">Match</p>
            <p className="mt-1 font-black text-white">
              {matchName || "Loading match..."}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-xs text-zinc-500">Fixture ID</p>
            <p className="mt-1 break-all font-mono text-sm font-black text-white">
              {fixtureId || "Loading fixture..."}
            </p>
          </div>
        </div>

        {errorMessage ? (
          <div className="mt-6 rounded-3xl border border-red-400/20 bg-red-400/10 p-5">
            <p className="font-black text-red-200">Checkout could not start</p>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              {errorMessage}
            </p>

            <a
              href="https://profbint.com"
              className="mt-5 block rounded-full bg-emerald-400 px-6 py-4 text-center text-sm font-black text-black transition hover:bg-emerald-300"
            >
              Return to Pro Football Intel
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

function StartCheckoutFallback() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-120px)] max-w-3xl flex-col items-center justify-center text-center">
      <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-5 py-2 text-sm font-black text-emerald-200 shadow-lg shadow-emerald-950/30">
        Starting secure checkout
      </div>

      <h1 className="mt-8 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">
        Preparing your match unlock.
      </h1>

      <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
        Loading checkout details...
      </p>
    </section>
  );
}

export default function StartCheckoutPage() {
  return (
    <main className="min-h-screen px-6 py-10 text-white">
      <Suspense fallback={<StartCheckoutFallback />}>
        <StartCheckoutContent />
      </Suspense>
    </main>
  );
}