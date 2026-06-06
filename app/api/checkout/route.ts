import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma/client";
import Stripe from "stripe";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function POST() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const stripePriceId = process.env.STRIPE_PRICE_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const publicAppUrl = process.env.NEXT_PUBLIC_PUBLIC_APP_URL;

  if (!stripeSecretKey || !stripePriceId || !siteUrl || !publicAppUrl) {
    return NextResponse.json(
      { error: "Checkout is not configured yet." },
      { status: 500 },
    );
  }

  const stripe = new Stripe(stripeSecretKey);

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
      },
    });

    if (!session.url) {
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
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    return NextResponse.json(
      { error: "Unable to create checkout session." },
      { status: 500 },
    );
  }
}