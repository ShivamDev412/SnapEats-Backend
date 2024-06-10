-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "emailOtp" TEXT,
ADD COLUMN     "emailOtpExpiry" TIMESTAMP(3),
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phoneNumberVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phoneOtp" TEXT,
ADD COLUMN     "phoneOtpExpiry" TIMESTAMP(3);
