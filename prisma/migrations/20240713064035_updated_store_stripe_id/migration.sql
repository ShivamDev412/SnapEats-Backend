/*
  Warnings:

  - A unique constraint covering the columns `[stripeAccountId]` on the table `Store` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "stripeAccountId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Store_stripeAccountId_key" ON "Store"("stripeAccountId");
