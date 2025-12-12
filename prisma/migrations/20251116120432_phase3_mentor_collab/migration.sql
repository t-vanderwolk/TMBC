-- CreateTable
CREATE TABLE "AcademyModule" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "trackId" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AcademyModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorFeedback" (
    "id" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "moduleId" TEXT,
    "registryItemId" TEXT,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MentorFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorTask" (
    "id" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "referenceId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MentorTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalShare" (
    "id" TEXT NOT NULL,
    "journalId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "allowed" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "JournalShare_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MentorFeedback" ADD CONSTRAINT "MentorFeedback_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MentorFeedback" ADD CONSTRAINT "MentorFeedback_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MentorFeedback" ADD CONSTRAINT "MentorFeedback_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "AcademyModule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MentorFeedback" ADD CONSTRAINT "MentorFeedback_registryItemId_fkey" FOREIGN KEY ("registryItemId") REFERENCES "RegistryItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "MentorTask" ADD CONSTRAINT "MentorTask_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MentorTask" ADD CONSTRAINT "MentorTask_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
