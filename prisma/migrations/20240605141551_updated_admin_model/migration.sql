/*
  Warnings:

  - You are about to drop the column `refreshToken` on the `AdminUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AdminUser" DROP COLUMN "refreshToken",
ADD COLUMN     "refreshTokens" TEXT[] DEFAULT ARRAY[]::TEXT[];
