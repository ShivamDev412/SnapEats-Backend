/*
  Warnings:

  - You are about to drop the column `city` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `StoreAddress` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `StoreAddress` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `StoreAddress` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `StoreAddress` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `StoreAddress` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `StoreAddress` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `StoreAddress` table. All the data in the column will be lost.
  - Added the required column `address` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lat` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `log` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `StoreAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lat` to the `StoreAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `log` to the `StoreAddress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "state",
DROP COLUMN "street",
DROP COLUMN "type",
DROP COLUMN "zipCode",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "apt" TEXT,
ADD COLUMN     "block" TEXT,
ADD COLUMN     "lat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "log" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "StoreAddress" DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "state",
DROP COLUMN "street",
DROP COLUMN "zipCode",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "lat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "log" DOUBLE PRECISION NOT NULL;
