/*
  Warnings:

  - You are about to drop the column `choiceId` on the `MenuItemChoice` table. All the data in the column will be lost.
  - You are about to drop the `Choice` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `additionalPrice` to the `MenuItemChoice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Choice" DROP CONSTRAINT "Choice_optionId_fkey";

-- DropForeignKey
ALTER TABLE "MenuItemChoice" DROP CONSTRAINT "MenuItemChoice_choiceId_fkey";

-- AlterTable
ALTER TABLE "MenuItemChoice" DROP COLUMN "choiceId",
ADD COLUMN     "additionalPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "customChoice" TEXT,
ADD COLUMN     "predefinedChoiceId" TEXT;

-- DropTable
DROP TABLE "Choice";

-- CreateTable
CREATE TABLE "PredefinedChoice" (
    "id" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PredefinedChoice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PredefinedChoice" ADD CONSTRAINT "PredefinedChoice_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItemChoice" ADD CONSTRAINT "MenuItemChoice_predefinedChoiceId_fkey" FOREIGN KEY ("predefinedChoiceId") REFERENCES "PredefinedChoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
