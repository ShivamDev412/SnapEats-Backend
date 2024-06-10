-- CreateEnum
CREATE TYPE "StoreStatus" AS ENUM ('PENDING', 'APPROVED');

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "status" "StoreStatus" NOT NULL DEFAULT 'PENDING';
