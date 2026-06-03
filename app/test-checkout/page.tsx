"use client";

import { useState } from "react";

export default function TestCheckoutPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleCheckout() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
      });

      const data: { url?: string; error?: string } = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Unable to start checkout.");
      }

      window.location.href = data.url;
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to start checkout.",
      );
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-3xl flex-col items-center justify-center text-center">
        <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-200">
          Stripe test checkout
        </div>

        <h1 className="mt-8 text-4xl font-black tracking-tight sm:text-5xl">
          Test Pro Football Intel payment flow.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
          This temporary page tests the isolated checkout app only. It is not
          connected to the public prediction site yet.
        </p>

        <button
          type="button"
          onClick={handleCheckout}
          disabled={isLoading}
          className="mt-10 rounded-full bg-emerald-400 px-6 py-4 text-sm font-bold text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-300"
        >
          {isLoading ? "Starting checkout..." : "Start test checkout"}
        </button>

        {errorMessage ? (
          <p className="mt-6 max-w-xl rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-100">
            {errorMessage}
          </p>
        ) : null}
      </section>
    </main>
  );
}