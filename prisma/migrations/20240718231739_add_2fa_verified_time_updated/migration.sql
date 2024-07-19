/*
  Warnings:

  - You are about to drop the column `two_factor_verified_at` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "two_factor_verified_at",
ADD COLUMN     "twoFactorVerifiedAt" TIMESTAMP(3);
