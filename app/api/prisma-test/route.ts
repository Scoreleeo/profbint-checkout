import { NextResponse } from "next/server";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

export async function GET() {
  const databaseUrl = process.env.PRISMA_DATABASE_URL;

  if (!databaseUrl) {
    return NextResponse.json(
      { error: "PRISMA_DATABASE_URL is not configured." },
      { status: 500 },
    );
  }

  const adapter = new PrismaPg({
    connectionString: databaseUrl,
  });

  const prisma = new PrismaClient({ adapter });

  try {
    const purchase = await prisma.purchase.create({
      data: {
        stripeSessionId: `test_${Date.now()}`,
        stripePaymentId: null,
        productName: "prisma_test_insert",
        amount: 399,
        currency: "gbp",
        status: "PRISMA_TEST",
      },
    });

    await prisma.$disconnect();

    return NextResponse.json({
      ok: true,
      purchase,
    });
  } catch (error) {
    await prisma.$disconnect();

    console.error("Prisma test insert error:", error);

    return NextResponse.json(
      { error: "Unable to create test purchase." },
      { status: 500 },
    );
  }
}