/*
  Warnings:

  - Added the required column `type` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "type" TEXT NOT NULL;
