-- CreateTable
CREATE TABLE "PurchaseItem" (
    "id" TEXT NOT NULL,
    "purchaseId" TEXT NOT NULL,
    "fixtureId" TEXT NOT NULL,
    "matchName" TEXT NOT NULL,
    "returnUrl" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PurchaseItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PurchaseItem_fixtureId_idx" ON "PurchaseItem"("fixtureId");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseItem_purchaseId_fixtureId_key" ON "PurchaseItem"("purchaseId", "fixtureId");

-- AddForeignKey
ALTER TABLE "PurchaseItem" ADD CONSTRAINT "PurchaseItem_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
