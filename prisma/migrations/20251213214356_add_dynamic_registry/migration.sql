/*
  Warnings:

  - A unique constraint covering the columns `[registryId,externalGiftId]` on the table `RegistryItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "AffiliateNetwork" AS ENUM ('AWIN', 'DIRECT');

-- AlterTable
ALTER TABLE "RegistryItem" ADD COLUMN     "affiliateId" TEXT,
ADD COLUMN     "affiliateLink" TEXT,
ADD COLUMN     "brand" TEXT,
ADD COLUMN     "externalGiftId" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "registryId" TEXT,
ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'MYREGISTRY';

-- CreateTable
CREATE TABLE "Registry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "myRegistryId" TEXT NOT NULL,
    "title" TEXT,
    "source" TEXT NOT NULL DEFAULT 'MYREGISTRY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSyncedAt" TIMESTAMP(3),
    "shippingAddress" JSONB,

    CONSTRAINT "Registry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffiliatePartner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "network" "AffiliateNetwork" NOT NULL,
    "awinmid" INTEGER,
    "cookieDays" INTEGER,
    "regions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "defaultLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AffiliatePartner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Registry_userId_key" ON "Registry"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Registry_myRegistryId_key" ON "Registry"("myRegistryId");

-- CreateIndex
CREATE INDEX "RegistryItem_registryId_idx" ON "RegistryItem"("registryId");

-- CreateIndex
CREATE UNIQUE INDEX "RegistryItem_registryId_externalGiftId_key" ON "RegistryItem"("registryId", "externalGiftId");

-- AddForeignKey
ALTER TABLE "Registry" ADD CONSTRAINT "Registry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistryItem" ADD CONSTRAINT "RegistryItem_registryId_fkey" FOREIGN KEY ("registryId") REFERENCES "Registry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistryItem" ADD CONSTRAINT "RegistryItem_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "AffiliatePartner"("id") ON DELETE SET NULL ON UPDATE CASCADE;
