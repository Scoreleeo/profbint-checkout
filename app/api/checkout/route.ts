import { NextResponse } from "next/server";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";
import Stripe from "stripe";

type CheckoutRequestBody = {
  fixtureId?: string;
  matchName?: string;
  returnUrl?: string;
};

function cleanMetadataValue(value: unknown) {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  if (!trimmed) return null;

  return trimmed.slice(0, 500);
}

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const stripePriceId = process.env.STRIPE_PRICE_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const publicAppUrl = process.env.NEXT_PUBLIC_PUBLIC_APP_URL;
  const databaseUrl = process.env.PRISMA_DATABASE_URL;

  if (
    !stripeSecretKey ||
    !stripePriceId ||
    !siteUrl ||
    !publicAppUrl ||
    !databaseUrl
  ) {
    return NextResponse.json(
      { error: "Checkout is not configured yet." },
      { status: 500 },
    );
  }

  let body: CheckoutRequestBody = {};

  try {
    body = (await request.json()) as CheckoutRequestBody;
  } catch {
    body = {};
  }

  const fixtureId = cleanMetadataValue(body.fixtureId);
  const matchName = cleanMetadataValue(body.matchName);
  const returnUrl = cleanMetadataValue(body.returnUrl);

  const stripe = new Stripe(stripeSecretKey);

  const adapter = new PrismaPg({
    connectionString: databaseUrl,
  });

  const prisma = new PrismaClient({ adapter });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cancel`,
      metadata: {
        product: "pro_football_intel_prediction",
        public_app_url: publicAppUrl,
        fixtureId: fixtureId ?? "",
        matchName: matchName ?? "",
        returnUrl: returnUrl ?? "",
      },
    });

    if (!session.url) {
      await prisma.$disconnect();

      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 500 },
      );
    }

    await prisma.purchase.create({
      data: {
        stripeSessionId: session.id,
        stripePaymentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : null,
        productName: "pro_football_intel_prediction",
        amount: session.amount_total ?? 399,
        currency: session.currency ?? "gbp",
        status: "CHECKOUT_CREATED",
        fixtureId,
        matchName,
        returnUrl,
      },
    });

    await prisma.$disconnect();

    return NextResponse.json({ url: session.url });
  } catch (error) {
    await prisma.$disconnect();

    console.error("Stripe checkout error:", error);

    return NextResponse.json(
      { error: "Unable to create checkout session." },
      { status: 500 },
    );
  }
}