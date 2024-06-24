-- CreateTable
CREATE TABLE "StoreFoodTypes" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "foodType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StoreFoodTypes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StoreFoodTypes_storeId_foodType_key" ON "StoreFoodTypes"("storeId", "foodType");

-- AddForeignKey
ALTER TABLE "StoreFoodTypes" ADD CONSTRAINT "StoreFoodTypes_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
