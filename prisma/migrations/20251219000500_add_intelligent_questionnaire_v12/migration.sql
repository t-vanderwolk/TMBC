CREATE TYPE "QuestionnaireStatus" AS ENUM ('DRAFT', 'COMPLETED', 'ARCHIVED');

CREATE TYPE "QuestionnaireSource" AS ENUM ('INITIAL', 'SETTINGS', 'ADMIN_OVERRIDE');

CREATE TABLE "OnboardingQuestionnaire" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "status" "QuestionnaireStatus" NOT NULL,
    "source" "QuestionnaireSource" NOT NULL,
    "mentorId" TEXT,
    "tags" TEXT[] NOT NULL,
    "answers" JSONB NOT NULL,
    "registrySnapshot" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OnboardingQuestionnaire_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OnboardingQuestionnaireRevision" (
    "id" TEXT NOT NULL,
    "questionnaireId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "source" "QuestionnaireSource" NOT NULL,
    "answers" JSONB NOT NULL,
    "tags" TEXT[] NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OnboardingQuestionnaireRevision_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "OnboardingQuestionnaire_userId_version_key" ON "OnboardingQuestionnaire"("userId", "version");
CREATE INDEX "OnboardingQuestionnaire_userId_idx" ON "OnboardingQuestionnaire"("userId");
CREATE INDEX "OnboardingQuestionnaireRevision_questionnaireId_idx" ON "OnboardingQuestionnaireRevision"("questionnaireId");

ALTER TABLE "OnboardingQuestionnaire" ADD CONSTRAINT "OnboardingQuestionnaire_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OnboardingQuestionnaire" ADD CONSTRAINT "OnboardingQuestionnaire_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "OnboardingQuestionnaireRevision" ADD CONSTRAINT "OnboardingQuestionnaireRevision_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "OnboardingQuestionnaire"("id") ON DELETE CASCADE ON UPDATE CASCADE;
