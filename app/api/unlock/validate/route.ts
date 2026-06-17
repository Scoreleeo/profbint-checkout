import { NextRequest, NextResponse } from "next/server";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

function cleanFixtureId(value: string | null) {
  if (!value) return null;

  const trimmed = value.trim();

  if (!trimmed) return null;

  return trimmed;
}

export async function GET(request: NextRequest) {
  const databaseUrl = process.env.PRISMA_DATABASE_URL;
  const unlockReference = request.nextUrl.searchParams.get("ref");
  const fixtureId = cleanFixtureId(request.nextUrl.searchParams.get("fixtureId"));

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
      include: {
        items: true,
      },
    });

    await prisma.$disconnect();

    if (!purchase || purchase.status !== "PAID") {
      return NextResponse.json({
        valid: false,
        status: purchase?.status ?? null,
      });
    }

    if (fixtureId) {
      const singleMatchUnlock = purchase.fixtureId === fixtureId;

      const basketMatchUnlock = purchase.items.some((item) => {
        return item.fixtureId === fixtureId;
      });

      if (!singleMatchUnlock && !basketMatchUnlock) {
        return NextResponse.json({
          valid: false,
          status: purchase.status,
          unlockReference: purchase.unlockReference,
          fixtureId,
        });
      }
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
      fixtureId: fixtureId ?? purchase.fixtureId,
      matchName: purchase.matchName,
      returnUrl: purchase.returnUrl,
      items: purchase.items.map((item) => ({
        fixtureId: item.fixtureId,
        matchName: item.matchName,
        returnUrl: item.returnUrl,
        price: item.price,
      })),
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