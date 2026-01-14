/*
  Warnings:

  - You are about to drop the column `approvedAt` on the `BlogPost` table. All the data in the column will be lost.
  - You are about to drop the column `module` on the `WorkbookEntry` table. All the data in the column will be lost.
  - You are about to drop the `OnboardingQuestionnaire` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OnboardingQuestionnaireRevision` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WaitlistEntry` table. If the table is not empty, all the data it contains will be lost.

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
