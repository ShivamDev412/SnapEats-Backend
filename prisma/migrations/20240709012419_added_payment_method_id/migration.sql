/*
  Warnings:

  - A unique constraint covering the columns `[paymentMethodId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "paymentMethodId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_paymentMethodId_key" ON "User"("paymentMethodId");
