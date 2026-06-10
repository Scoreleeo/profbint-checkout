import { NextRequest, NextResponse } from "next/server";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

export async function GET(request: NextRequest) {
  const databaseUrl = process.env.PRISMA_DATABASE_URL;
  const unlockReference = request.nextUrl.searchParams.get("ref");

  if (!databaseUrl) {
    return NextResponse.json(
      { valid: false, error: "Validation is not configured." },
      { status: 500 },
    );
  }

  if (!unlockReference) {
    return NextResponse.json(
      { valid: false, error: "Missing unlock reference." },
      { status: 400 },
    );
  }

  const cleanedReference = unlockReference.trim().toUpperCase();

  if (!cleanedReference.startsWith("PFI_")) {
    return NextResponse.json(
      { valid: false, error: "Invalid unlock reference format." },
      { status: 400 },
    );
  }

  const adapter = new PrismaPg({
    connectionString: databaseUrl,
  });

  const prisma = new PrismaClient({ adapter });

  try {
    const purchase = await prisma.purchase.findUnique({
      where: {
        unlockReference: cleanedReference,
      },
    });

    await prisma.$disconnect();

    if (!purchase || purchase.status !== "PAID") {
      return NextResponse.json({
        valid: false,
        status: purchase?.status ?? null,
      });
    }

    return NextResponse.json({
      valid: true,
      status: purchase.status,
      productName: purchase.productName,
      amount: purchase.amount,
      currency: purchase.currency,
      unlockReference: purchase.unlockReference,
      unlockCreatedAt: purchase.unlockCreatedAt,
      purchaseCreatedAt: purchase.createdAt,
    });
  } catch (error) {
    await prisma.$disconnect();

    console.error("Unlock validation error:", error);

    return NextResponse.json(
      { valid: false, error: "Unable to validate unlock reference." },
      { status: 500 },
    );
  }
}