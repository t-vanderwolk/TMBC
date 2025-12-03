/*
  Warnings:

  - Made the column `content` on table `AcademyModule` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_user_fkey";

-- AlterTable
ALTER TABLE "AcademyModule" ALTER COLUMN "content" SET NOT NULL,
ALTER COLUMN "content" SET DEFAULT '{}';

-- AlterTable
ALTER TABLE "InviteRequest" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
