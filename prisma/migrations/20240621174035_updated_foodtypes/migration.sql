-- DropForeignKey
ALTER TABLE "StoreFoodTypes" DROP CONSTRAINT "StoreFoodTypes_storeId_fkey";

-- DropIndex
DROP INDEX "StoreFoodTypes_storeId_foodType_key";

-- AlterTable
ALTER TABLE "StoreFoodTypes" ALTER COLUMN "storeId" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "StoreFoodTypes" ADD CONSTRAINT "StoreFoodTypes_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;
