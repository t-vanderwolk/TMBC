/*
  Warnings:

  - You are about to drop the column `approvedAt` on the `BlogPost` table. All the data in the column will be lost.
  - You are about to drop the column `memberAcknowledgement` on the `PlanSection` table. All the data in the column will be lost.
  - You are about to drop the column `mentorNote` on the `PlanSection` table. All the data in the column will be lost.
  - You are about to drop the column `updatedByRole` on the `PlanSection` table. All the data in the column will be lost.
  - You are about to drop the column `module` on the `WorkbookEntry` table. All the data in the column will be lost.
  - You are about to drop the `OnboardingQuestionnaire` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OnboardingQuestionnaireRevision` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WaitlistEntry` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `decisionState` on table `PlanSection` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "OnboardingQuestionnaire" DROP CONSTRAINT "OnboardingQuestionnaire_userId_fkey";

-- DropForeignKey
ALTER TABLE "OnboardingQuestionnaireRevision" DROP CONSTRAINT "OnboardingQuestionnaireRevision_questionnaireId_fkey";

-- DropForeignKey
ALTER TABLE "WaitlistEntry" DROP CONSTRAINT "WaitlistEntry_inviteId_fkey";

-- DropIndex
DROP INDEX "BlogPost_slug_idx";

-- DropIndex
DROP INDEX "BlogPost_status_idx";

-- DropIndex
DROP INDEX "WorkbookEntry_user_module_type_unique";

-- AlterTable
ALTER TABLE "BlogPost" DROP COLUMN "approvedAt";

-- AlterTable
ALTER TABLE "PlanSection" DROP COLUMN "memberAcknowledgement",
DROP COLUMN "mentorNote",
DROP COLUMN "updatedByRole",
ADD COLUMN     "mentorSummary" TEXT,
ADD COLUMN     "readyState" TEXT NOT NULL DEFAULT 'NOT_READY',
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedById" TEXT,
ALTER COLUMN "decisionState" SET NOT NULL,
ALTER COLUMN "decisionState" SET DEFAULT 'UNDECIDED';

-- AlterTable
ALTER TABLE "WorkbookEntry" DROP COLUMN "module";

-- DropTable
DROP TABLE "OnboardingQuestionnaire";

-- DropTable
DROP TABLE "OnboardingQuestionnaireRevision";

-- DropTable
DROP TABLE "WaitlistEntry";

-- DropEnum
DROP TYPE "QuestionnaireSource";

-- DropEnum
DROP TYPE "QuestionnaireStatus";

-- CreateIndex
CREATE INDEX "PlanSection_reviewedById_idx" ON "PlanSection"("reviewedById");

-- AddForeignKey
ALTER TABLE "PlanSection" ADD CONSTRAINT "PlanSection_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
