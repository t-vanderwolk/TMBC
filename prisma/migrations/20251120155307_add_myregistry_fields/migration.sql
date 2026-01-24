-- DropForeignKey
ALTER TABLE "MentorFeedback" DROP CONSTRAINT "MentorFeedback_memberId_fkey";

-- DropForeignKey
ALTER TABLE "MentorFeedback" DROP CONSTRAINT "MentorFeedback_mentorId_fkey";

-- DropForeignKey
ALTER TABLE "MentorTask" DROP CONSTRAINT "MentorTask_memberId_fkey";

-- DropForeignKey
ALTER TABLE "MentorTask" DROP CONSTRAINT "MentorTask_mentorId_fkey";

-- DropForeignKey
ALTER TABLE "RegistryConflict" DROP CONSTRAINT "RegistryConflict_itemId_fkey";

-- DropForeignKey
ALTER TABLE "RegistryConflict" DROP CONSTRAINT "RegistryConflict_userId_fkey";

-- DropForeignKey
ALTER TABLE "RegistryItem" DROP CONSTRAINT "RegistryItem_userId_fkey";

-- DropIndex
DROP INDEX "RegistryItem_productId_idx";

-- DropIndex
DROP INDEX "RegistryItem_userId_idx";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "moduleCodes" DROP DEFAULT,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "RegistryItem" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "myRegistryEmail" TEXT,
ADD COLUMN     "myRegistryUserId" TEXT;

-- CreateTable
CREATE TABLE "MentorNote" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MentorNote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RegistryItem" ADD CONSTRAINT "RegistryItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorNote" ADD CONSTRAINT "MentorNote_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorNote" ADD CONSTRAINT "MentorNote_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorNote" ADD CONSTRAINT "MentorNote_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorFeedback" ADD CONSTRAINT "MentorFeedback_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorFeedback" ADD CONSTRAINT "MentorFeedback_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorTask" ADD CONSTRAINT "MentorTask_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorTask" ADD CONSTRAINT "MentorTask_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistryConflict" ADD CONSTRAINT "RegistryConflict_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistryConflict" ADD CONSTRAINT "RegistryConflict_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "RegistryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
