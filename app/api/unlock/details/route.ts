import { NextRequest, NextResponse } from "next/server";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

export async function GET(request: NextRequest) {
  const databaseUrl = process.env.PRISMA_DATABASE_URL;
  const unlockReference = request.nextUrl.searchParams.get("ref");

  if (!databaseUrl) {
    return NextResponse.json(
      { ok: false, error: "Purchase details are not configured." },
      { status: 500 },
    );
  }

  if (!unlockReference) {
    return NextResponse.json(
      { ok: false, error: "Missing unlock reference." },
      { status: 400 },
    );
  }

  const cleanedReference = unlockReference.trim().toUpperCase();

  if (!cleanedReference.startsWith("PFI_")) {
    return NextResponse.json(
      { ok: false, error: "Invalid unlock reference format." },
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

    if (!purchase) {
      return NextResponse.json({
        ok: false,
        valid: false,
        error: "Purchase not found.",
      });
    }

    if (purchase.status !== "PAID") {
      return NextResponse.json({
        ok: true,
        valid: false,
        status: purchase.status,
        unlockReference: purchase.unlockReference,
      });
    }

    return NextResponse.json({
      ok: true,
      valid: true,
      purchase: {
        id: purchase.id,
        productName: purchase.productName,
        amount: purchase.amount,
        currency: purchase.currency,
        status: purchase.status,
        unlockReference: purchase.unlockReference,
        unlockCreatedAt: purchase.unlockCreatedAt,
        purchaseCreatedAt: purchase.createdAt,
      },
    });
  } catch (error) {
    await prisma.$disconnect();

    console.error("Unlock details error:", error);

    return NextResponse.json(
      { ok: false, error: "Unable to load purchase details." },
      { status: 500 },
    );
  }
}