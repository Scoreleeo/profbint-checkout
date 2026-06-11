type SuccessPageProps = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

type VerificationResult = {
  ok: boolean;
  paymentStatus: string | null;
  unlockReference: string | null;
  productName: string | null;
  amount: number | null;
  currency: string | null;
  purchaseCreatedAt: string | null;
  unlockCreatedAt: string | null;
};

function formatAmount(amount: number | null, currency: string | null) {
  if (typeof amount !== "number") return "Not available";

  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency?.toUpperCase() || "GBP",
  }).format(amount / 100);
}

function formatDate(value: string | null) {
  if (!value) return "Not available";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

async function verifyPayment(sessionId: string): Promise<VerificationResult> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    return {
      ok: false,
      paymentStatus: null,
      unlockReference: null,
      productName: null,
      amount: null,
      currency: null,
      purchaseCreatedAt: null,
      unlockCreatedAt: null,
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
        productName: null,
        amount: null,
        currency: null,
        purchaseCreatedAt: null,
        unlockCreatedAt: null,
      };
    }

    const data = await response.json();
    const purchase = data.purchase;

    return {
      ok: Boolean(data.ok),
      paymentStatus: data.paymentStatus as string | null,
      unlockReference:
        typeof purchase?.unlockReference === "string"
          ? purchase.unlockReference
          : null,
      productName:
        typeof purchase?.productName === "string" ? purchase.productName : null,
      amount: typeof purchase?.amount === "number" ? purchase.amount : null,
      currency: typeof purchase?.currency === "string" ? purchase.currency : null,
      purchaseCreatedAt:
        typeof purchase?.createdAt === "string" ? purchase.createdAt : null,
      unlockCreatedAt:
        typeof purchase?.unlockCreatedAt === "string"
          ? purchase.unlockCreatedAt
          : null,
    };
  } catch {
    return {
      ok: false,
      paymentStatus: null,
      unlockReference: null,
      productName: null,
      amount: null,
      currency: null,
      purchaseCreatedAt: null,
      unlockCreatedAt: null,
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
        productName: null,
        amount: null,
        currency: null,
        purchaseCreatedAt: null,
        unlockCreatedAt: null,
      };

  const isPaid = verification.ok && verification.paymentStatus === "paid";

  return (
    <main className="min-h-screen px-6 py-10 text-white">
      <section className="mx-auto flex min-h-[calc(100vh-120px)] max-w-5xl flex-col items-center justify-center text-center">
        <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-5 py-2 text-sm font-black text-emerald-200 shadow-lg shadow-emerald-950/30">
          {isPaid ? "✓ Payment verified" : "Payment received"}
        </div>

        <h1 className="mt-8 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
          Your purchase is complete.
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
          {isPaid
            ? "Your payment has been verified, recorded, and your unlock reference has been generated."
            : "Thanks for your purchase. Your Stripe session returned successfully, but the payment status could not be fully verified on this page."}
        </p>

        {isPaid && verification.unlockReference ? (
          <div className="mt-10 grid w-full gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[2rem] border border-emerald-400/20 bg-slate-950/60 p-6 text-left shadow-2xl shadow-emerald-950/20 backdrop-blur">
              <p className="text-sm font-black uppercase tracking-[0.35em] text-emerald-200">
                Unlock reference
              </p>

              <p className="mt-5 break-all rounded-2xl border border-emerald-400/20 bg-black/40 px-5 py-5 font-mono text-lg font-black text-emerald-300">
                {verification.unlockReference}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-zinc-500">Payment</p>
                  <p className="mt-1 font-black text-emerald-300">Verified</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-zinc-500">Unlock</p>
                  <p className="mt-1 font-black text-emerald-300">Generated</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-zinc-500">Record</p>
                  <p className="mt-1 font-black text-emerald-300">Saved</p>
                </div>
              </div>

              <p className="mt-6 text-sm leading-6 text-zinc-400">
                Keep this reference safe. You can use it on the checkout portal
                to validate your purchase, view purchase details, and review
                unlock history.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-left shadow-2xl shadow-black/20 backdrop-blur">
              <p className="text-sm font-black uppercase tracking-[0.3em] text-blue-200">
                Receipt
              </p>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <span className="text-zinc-500">Product</span>
                  <span className="text-right font-bold text-white">
                    {verification.productName ?? "Pro Football Intel Prediction"}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <span className="text-zinc-500">Amount</span>
                  <span className="font-bold text-white">
                    {formatAmount(verification.amount, verification.currency)}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <span className="text-zinc-500">Status</span>
                  <span className="font-bold text-emerald-300">PAID</span>
                </div>

                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <span className="text-zinc-500">Purchase date</span>
                  <span className="text-right font-bold text-white">
                    {formatDate(verification.purchaseCreatedAt)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-zinc-500">Unlock date</span>
                  <span className="text-right font-bold text-white">
                    {formatDate(verification.unlockCreatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-10 w-full max-w-2xl rounded-[2rem] border border-amber-400/20 bg-amber-400/10 p-6 text-left">
            <p className="font-bold text-amber-200">
              We could not show your unlock reference yet.
            </p>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              If your payment completed, please wait a few seconds and refresh
              this page. If you still need help, contact support@profbint.com.
            </p>
          </div>
        )}

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="/unlock"
            className="rounded-full border border-white/10 bg-white/5 px-6 py-4 text-sm font-bold text-white transition hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-200"
          >
            Validate unlock
          </a>

          <a
            href="/purchase"
            className="rounded-full border border-white/10 bg-white/5 px-6 py-4 text-sm font-bold text-white transition hover:border-blue-400/40 hover:bg-blue-400/10 hover:text-blue-200"
          >
            View purchase details
          </a>

          <a
            href="https://profbint.com"
            className="rounded-full bg-emerald-400 px-6 py-4 text-sm font-black text-black transition hover:bg-emerald-300"
          >
            Return to Pro Football Intel
          </a>
        </div>

        <p className="mt-8 text-sm text-zinc-500">
          Need help?{" "}
          <a
            href="mailto:support@profbint.com"
            className="font-bold text-emerald-300 hover:text-emerald-200"
          >
            support@profbint.com
          </a>
        </p>
      </section>
    </main>
  );
}