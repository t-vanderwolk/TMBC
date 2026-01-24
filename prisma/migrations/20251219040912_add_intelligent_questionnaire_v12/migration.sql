-- DropForeignKey
ALTER TABLE "OnboardingQuestionnaire" DROP CONSTRAINT "OnboardingQuestionnaire_mentorId_fkey";

-- DropForeignKey
ALTER TABLE "OnboardingQuestionnaireRevision" DROP CONSTRAINT "OnboardingQuestionnaireRevision_questionnaireId_fkey";

-- AlterTable
ALTER TABLE "OnboardingQuestionnaire" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "OnboardingQuestionnaireRevision" ADD CONSTRAINT "OnboardingQuestionnaireRevision_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "OnboardingQuestionnaire"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
