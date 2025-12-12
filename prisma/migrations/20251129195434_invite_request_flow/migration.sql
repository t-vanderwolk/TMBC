/*
  Warnings:

  - The primary key for the `InviteRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `approvedBy` on the `InviteRequest` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `InviteRequest` table. All the data in the column will be lost.
  - You are about to drop the column `dueDate` on the `InviteRequest` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `InviteRequest` table. All the data in the column will be lost.
  - You are about to drop the column `referral` on the `InviteRequest` table. All the data in the column will be lost.
  - You are about to drop the column `experience` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `partner` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `inviteRequestId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[inviteRequestId]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "InviteRequest" DROP CONSTRAINT "InviteRequest_approvedBy_fkey";

-- AlterTable
ALTER TABLE "InviteRequest" DROP CONSTRAINT "InviteRequest_pkey",
DROP COLUMN "approvedBy",
DROP COLUMN "city",
DROP COLUMN "dueDate",
DROP COLUMN "name",
DROP COLUMN "referral",
ADD COLUMN     "approvedById" TEXT,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "message" TEXT,
ALTER COLUMN "id" DROP IDENTITY IF EXISTS,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "InviteRequest_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "experience",
DROP COLUMN "partner",
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "inviteRequestId" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "state" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "inviteRequestId";

-- CreateIndex
CREATE UNIQUE INDEX "Profile_inviteRequestId_key" ON "Profile"("inviteRequestId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_inviteRequestId_fkey" FOREIGN KEY ("inviteRequestId") REFERENCES "InviteRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InviteRequest" ADD CONSTRAINT "InviteRequest_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- DropSequence
DROP SEQUENCE IF EXISTS "invite_request_id_seq";
