/*
  Warnings:

  - You are about to drop the column `name` on the `InviteCode` table. All the data in the column will be lost.
  - You are about to drop the column `redeemedBy` on the `InviteCode` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[redeemedById]` on the table `InviteCode` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "InviteCode_redeemedBy_key";

-- AlterTable
ALTER TABLE "InviteCode" DROP COLUMN "name",
DROP COLUMN "redeemedBy",
ADD COLUMN     "redeemedById" TEXT,
ADD COLUMN     "usedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "InviteCode_redeemedById_key" ON "InviteCode"("redeemedById");

-- AddForeignKey
ALTER TABLE "InviteCode" ADD CONSTRAINT "InviteCode_redeemedById_fkey" FOREIGN KEY ("redeemedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
