type SuccessPageProps = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

async function verifyPayment(sessionId: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    return {
      ok: false,
      paymentStatus: null,
    };
  }

  try {
    const response = await fetch(
      `${siteUrl}/api/checkout/verify?session_id=${sessionId}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return {
        ok: false,
        paymentStatus: null,
      };
    }

    const data = await response.json();

    return {
      ok: Boolean(data.ok),
      paymentStatus: data.paymentStatus as string | null,
    };
  } catch {
    return {
      ok: false,
      paymentStatus: null,
    };
  }
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const sessionId = params.session_id;

  const verification = sessionId
    ? await verifyPayment(sessionId)
    : {
        ok: false,
        paymentStatus: null,
      };

  const isPaid = verification.ok && verification.paymentStatus === "paid";

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-3xl flex-col items-center justify-center text-center">
        <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-200">
          {isPaid ? "Payment verified" : "Payment received"}
        </div>

        <h1 className="mt-8 text-4xl font-black tracking-tight sm:text-5xl">
          Your checkout is complete.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
          {isPaid
            ? "Your payment has been verified and recorded securely. Prediction unlock logic will be connected in a later safe step."
            : "Thanks for your purchase. We could not fully verify the payment status on this page yet, but your Stripe session has returned successfully."}
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