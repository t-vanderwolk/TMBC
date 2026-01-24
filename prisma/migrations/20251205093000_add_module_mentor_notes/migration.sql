-- AlterTable
ALTER TABLE "MentorNote" ADD COLUMN "moduleId" TEXT;

-- AlterTable
ALTER TABLE "MentorNote" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "MentorNote" ALTER COLUMN "productId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "MentorNote" ADD CONSTRAINT "MentorNote_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "AcademyModule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
