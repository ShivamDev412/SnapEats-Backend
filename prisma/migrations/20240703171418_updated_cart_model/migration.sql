/*
  Warnings:

  - You are about to drop the column `choice` on the `CartItemOption` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `CartItemOption` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `choiceName` to the `CartItemOption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `optionId` to the `CartItemOption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `optionName` to the `CartItemOption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `CartItemOption` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "CartItemOption" DROP COLUMN "choice",
DROP COLUMN "name",
ADD COLUMN     "choiceId" TEXT,
ADD COLUMN     "choiceName" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "optionId" TEXT NOT NULL,
ADD COLUMN     "optionName" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
