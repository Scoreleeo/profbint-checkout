/*
  Warnings:

  - A unique constraint covering the columns `[unlockReference]` on the table `Purchase` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Purchase" ADD COLUMN     "unlockCreatedAt" TIMESTAMP(3),
ADD COLUMN     "unlockReference" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_unlockReference_key" ON "Purchase"("unlockReference");
