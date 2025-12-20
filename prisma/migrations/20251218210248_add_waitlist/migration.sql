/*
  Warnings:

  - You are about to drop the column `affiliateUrl` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `inStock` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `merchant` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `moduleCodes` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `isCustom` on the `RegistryItem` table. All the data in the column will be lost.
  - You are about to drop the column `moduleCode` on the `RegistryItem` table. All the data in the column will be lost.
  - The `status` column on the `RegistryItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `section` to the `RegistryItem` table without a default value. This is not possible if the table is not empty.
  - Made the column `productId` on table `RegistryItem` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "RegistrySection" AS ENUM ('NURSERY', 'GEAR', 'FEEDING', 'POSTPARTUM', 'LATER');

-- CreateEnum
CREATE TYPE "RegistryItemStatus" AS ENUM ('CONSIDERING', 'ADDED', 'PURCHASED', 'REMOVED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AffiliateNetwork" ADD VALUE 'CJ';
ALTER TYPE "AffiliateNetwork" ADD VALUE 'IMPACT';
ALTER TYPE "AffiliateNetwork" ADD VALUE 'SHAREASALE';
ALTER TYPE "AffiliateNetwork" ADD VALUE 'MYREGISTRY';

-- DropForeignKey
ALTER TABLE "RegistryItem" DROP CONSTRAINT "RegistryItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "RegistryItem" DROP CONSTRAINT "RegistryItem_registryId_fkey";

-- DropForeignKey
ALTER TABLE "RegistryItem" DROP CONSTRAINT "RegistryItem_userId_fkey";

-- DropIndex
DROP INDEX "RegistryItem_registryId_externalGiftId_key";

-- DropIndex
DROP INDEX "RegistryItem_registryId_idx";

-- DropIndex
DROP INDEX "RegistryItem_userId_idx";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "affiliateUrl",
DROP COLUMN "inStock",
DROP COLUMN "merchant",
DROP COLUMN "moduleCodes",
DROP COLUMN "price",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "subcategory" TEXT,
ALTER COLUMN "brand" DROP NOT NULL,
ALTER COLUMN "imageUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "RegistryItem" DROP COLUMN "isCustom",
DROP COLUMN "moduleCode",
ADD COLUMN     "addedByMentor" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mentorNote" TEXT,
ADD COLUMN     "purchasedAt" TIMESTAMP(3),
ADD COLUMN     "section" "RegistrySection" NOT NULL,
ADD COLUMN     "userNote" TEXT,
ALTER COLUMN "productId" SET NOT NULL,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "url" DROP NOT NULL,
ALTER COLUMN "quantity" DROP NOT NULL,
ALTER COLUMN "quantity" DROP DEFAULT,
DROP COLUMN "status",
ADD COLUMN     "status" "RegistryItemStatus" NOT NULL DEFAULT 'CONSIDERING',
ALTER COLUMN "source" DROP NOT NULL,
ALTER COLUMN "source" DROP DEFAULT;

-- CreateTable
CREATE TABLE "AffiliateLink" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "retailerName" TEXT NOT NULL,
    "network" "AffiliateNetwork" NOT NULL,
    "outboundUrl" TEXT NOT NULL,
    "affiliateId" TEXT,
    "region" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AffiliateLink_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RegistryItem" ADD CONSTRAINT "RegistryItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistryItem" ADD CONSTRAINT "RegistryItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistryItem" ADD CONSTRAINT "RegistryItem_registryId_fkey" FOREIGN KEY ("registryId") REFERENCES "Registry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateLink" ADD CONSTRAINT "AffiliateLink_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
