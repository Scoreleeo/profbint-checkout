type SuccessPageProps = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

type VerificationResult = {
  ok: boolean;
  paymentStatus: string | null;
  unlockReference: string | null;
};

async function verifyPayment(sessionId: string): Promise<VerificationResult> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    return {
      ok: false,
      paymentStatus: null,
      unlockReference: null,
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
        unlockReference: null,
      };
    }

    const data = await response.json();

    return {
      ok: Boolean(data.ok),
      paymentStatus: data.paymentStatus as string | null,
      unlockReference:
        typeof data.purchase?.unlockReference === "string"
          ? data.purchase.unlockReference
          : null,
    };
  } catch {
    return {
      ok: false,
      paymentStatus: null,
      unlockReference: null,
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
        unlockReference: null,
      };

  const isPaid = verification.ok && verification.paymentStatus === "paid";
  const unlockReference = verification.unlockReference;

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
            ? "Your payment has been verified and recorded securely. Keep your unlock reference safe for future access."
            : "Thanks for your purchase. We could not fully verify the payment status on this page yet, but your Stripe session has returned successfully."}
        </p>

        {isPaid && unlockReference ? (
          <div className="mt-8 w-full max-w-xl rounded-3xl border border-emerald-400/20 bg-white/5 p-6 shadow-2xl shadow-emerald-950/20">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">
              Unlock reference
            </p>

            <p className="mt-4 break-all rounded-2xl border border-white/10 bg-black/30 px-4 py-4 font-mono text-lg font-bold text-emerald-300">
              {unlockReference}
            </p>

            <p className="mt-4 text-sm leading-6 text-zinc-400">
              This reference proves your paid checkout was recorded. Future
              prediction unlock logic will use this securely.
            </p>
          </div>
        ) : null}

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