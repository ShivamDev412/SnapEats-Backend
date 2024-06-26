-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "closeTime" TIMESTAMP(3),
ADD COLUMN     "deliveryFee" DOUBLE PRECISION,
ADD COLUMN     "openTime" TIMESTAMP(3),
ADD COLUMN     "specialEventCloseTime" TIMESTAMP(3),
ADD COLUMN     "specialEventOpenTime" TIMESTAMP(3);
