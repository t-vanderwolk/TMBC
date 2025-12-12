-- DropForeignKey
ALTER TABLE "MentorNote" DROP CONSTRAINT "MentorNote_productId_fkey";

-- AlterTable
ALTER TABLE "MentorNote" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "MentorNote" ADD CONSTRAINT "MentorNote_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
