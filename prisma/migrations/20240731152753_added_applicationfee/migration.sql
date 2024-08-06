/*
  Warnings:

  - You are about to drop the `Biometric` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Biometric" DROP CONSTRAINT "Biometric_user_id_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "applicationFee" DOUBLE PRECISION;

-- DropTable
DROP TABLE "Biometric";
