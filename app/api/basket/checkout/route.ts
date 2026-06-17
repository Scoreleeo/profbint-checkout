import { NextResponse } from "next/server";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";
import Stripe from "stripe";

type BasketCheckoutItemInput = {
  fixtureId?: unknown;
  matchName?: unknown;
  returnUrl?: unknown;
  price?: unknown;
};

type BasketCheckoutRequestBody = {
  items?: BasketCheckoutItemInput[];
};

type CleanBasketItem = {
  fixtureId: string;
  matchName: string;
  returnUrl: string;
};

function cleanText(value: unknown) {
  if (typeof value !== "string" && typeof value !== "number") return null;

  const trimmed = String(value).trim();

  if (!trimmed) return null;

  return trimmed.slice(0, 500);
}

function cleanBasketItems(items: unknown): CleanBasketItem[] {
  if (!Array.isArray(items)) return [];

  const uniqueItems = new Map<string, CleanBasketItem>();

  for (const item of items) {
    const fixtureId = cleanText((item as BasketCheckoutItemInput)?.fixtureId);
    const matchName = cleanText((item as BasketCheckoutItemInput)?.matchName);
    const returnUrl = cleanText((item as BasketCheckoutItemInput)?.returnUrl);

    if (!fixtureId || !matchName || !returnUrl) continue;

    if (!uniqueItems.has(fixtureId)) {
      uniqueItems.set(fixtureId, {
        fixtureId,
        matchName,
        returnUrl,
      });
    }
  }

  return Array.from(uniqueItems.values()).slice(0, 20);
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
      { error: "Basket checkout is not configured yet." },
      { status: 500 },
    );
  }

  let body: BasketCheckoutRequestBody = {};

  try {
    body = (await request.json()) as BasketCheckoutRequestBody;
  } catch {
    body = {};
  }

  const items = cleanBasketItems(body.items);

  if (items.length === 0) {
    return NextResponse.json(
      { error: "Your basket is empty or invalid." },
      { status: 400 },
    );
  }

  const stripe = new Stripe(stripeSecretKey);

  const adapter = new PrismaPg({
    connectionString: databaseUrl,
  });

  const prisma = new PrismaClient({ adapter });

  try {
    const stripePrice = await stripe.prices.retrieve(stripePriceId);

    const unitAmount = stripePrice.unit_amount;

    if (typeof unitAmount !== "number" || unitAmount <= 0) {
      await prisma.$disconnect();

      return NextResponse.json(
        { error: "Basket price is not configured correctly." },
        { status: 500 },
      );
    }

    const expectedAmount = unitAmount * items.length;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: stripePriceId,
          quantity: items.length,
        },
      ],
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cancel`,
      metadata: {
        product: "pro_football_intel_basket",
        purchaseType: "basket",
        itemCount: String(items.length),
        public_app_url: publicAppUrl,
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
        productName: "pro_football_intel_basket",
        amount: session.amount_total ?? expectedAmount,
        currency: session.currency ?? "gbp",
        status: "CHECKOUT_CREATED",
        items: {
          create: items.map((item) => ({
            fixtureId: item.fixtureId,
            matchName: item.matchName,
            returnUrl: item.returnUrl,
            price: unitAmount,
          })),
        },
      },
    });

    await prisma.$disconnect();

    return NextResponse.json({ url: session.url });
  } catch (error) {
    await prisma.$disconnect();

    console.error("Basket checkout error:", error);

    return NextResponse.json(
      { error: "Unable to create basket checkout session." },
      { status: 500 },
    );
  }
}