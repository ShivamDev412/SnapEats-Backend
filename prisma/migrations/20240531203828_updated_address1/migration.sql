/*
  Warnings:

  - You are about to drop the column `log` on the `StoreAddress` table. All the data in the column will be lost.
  - Added the required column `lon` to the `StoreAddress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StoreAddress" DROP COLUMN "log",
ADD COLUMN     "lon" DOUBLE PRECISION NOT NULL;
