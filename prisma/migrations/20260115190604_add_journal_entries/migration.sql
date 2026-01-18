-- AlterTable
ALTER TABLE "PlanSection" ADD COLUMN     "memberAcknowledgement" TEXT,
ADD COLUMN     "mentorNote" TEXT,
ADD COLUMN     "updatedByRole" TEXT DEFAULT 'MEMBER';
