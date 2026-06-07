import { NextRequest, NextResponse } from "next/server";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";
import Stripe from "stripe";

export async function GET(request: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const databaseUrl = process.env.PRISMA_DATABASE_URL;
  const sessionId = request.nextUrl.searchParams.get("session_id");

  if (!stripeSecretKey || !databaseUrl) {
    return NextResponse.json(
      { error: "Verification is not configured yet." },
      { status: 500 },
    );
  }

  if (!sessionId) {
    return NextResponse.json(
      { error: "Missing Stripe session ID." },
      { status: 400 },
    );
  }

  const stripe = new Stripe(stripeSecretKey);

  const adapter = new PrismaPg({
    connectionString: databaseUrl,
  });

  const prisma = new PrismaClient({ adapter });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const purchase = await prisma.purchase.findUnique({
      where: {
        stripeSessionId: session.id,
      },
    });

    if (!purchase) {
      await prisma.$disconnect();

      return NextResponse.json(
        { error: "Purchase record not found." },
        { status: 404 },
      );
    }

    const updatedPurchase = await prisma.purchase.update({
      where: {
        stripeSessionId: session.id,
      },
      data: {
        stripePaymentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : purchase.stripePaymentId,
        status: session.payment_status === "paid" ? "PAID" : purchase.status,
      },
    });

    await prisma.$disconnect();

    return NextResponse.json({
      ok: true,
      paymentStatus: session.payment_status,
      purchase: updatedPurchase,
    });
  } catch (error) {
    await prisma.$disconnect();

    console.error("Stripe verification error:", error);

    return NextResponse.json(
      { error: "Unable to verify payment." },
      { status: 500 },
    );
  }
}