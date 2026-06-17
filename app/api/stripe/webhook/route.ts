import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";
import Stripe from "stripe";

function createUnlockReference() {
  return `PFI_${randomBytes(16).toString("hex").toUpperCase()}`;
}

function cleanMetadataValue(value: unknown) {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  if (!trimmed) return null;

  return trimmed.slice(0, 500);
}

export async function POST(request: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const databaseUrl = process.env.PRISMA_DATABASE_URL;

  if (!stripeSecretKey || !stripeWebhookSecret || !databaseUrl) {
    return NextResponse.json(
      { error: "Webhook is not configured." },
      { status: 500 },
    );
  }

  const stripe = new Stripe(stripeSecretKey);
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature." },
      { status: 400 },
    );
  }

  const body = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      stripeWebhookSecret,
    );
  } catch (error) {
    console.error("Stripe webhook signature error:", error);

    return NextResponse.json(
      { error: "Invalid webhook signature." },
      { status: 400 },
    );
  }

  const adapter = new PrismaPg({
    connectionString: databaseUrl,
  });

  const prisma = new PrismaClient({ adapter });

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const existingPurchase = await prisma.purchase.findUnique({
        where: {
          stripeSessionId: session.id,
        },
        include: {
          items: true,
        },
      });

      if (existingPurchase) {
        const unlockReference =
          existingPurchase.unlockReference ?? createUnlockReference();

        const unlockCreatedAt =
          existingPurchase.unlockCreatedAt ?? new Date();

        await prisma.purchase.update({
          where: {
            stripeSessionId: session.id,
          },
          data: {
            stripePaymentId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : existingPurchase.stripePaymentId,
            status: session.payment_status === "paid" ? "PAID" : "COMPLETED",
            unlockReference,
            unlockCreatedAt,
            fixtureId:
              existingPurchase.fixtureId ??
              cleanMetadataValue(session.metadata?.fixtureId),
            matchName:
              existingPurchase.matchName ??
              cleanMetadataValue(session.metadata?.matchName),
            returnUrl:
              existingPurchase.returnUrl ??
              cleanMetadataValue(session.metadata?.returnUrl),
          },
        });
      }
    }

    await prisma.$disconnect();

    return NextResponse.json({ received: true });
  } catch (error) {
    await prisma.$disconnect();

    console.error("Stripe webhook handling error:", error);

    return NextResponse.json(
      { error: "Unable to process webhook." },
      { status: 500 },
    );
  }
}