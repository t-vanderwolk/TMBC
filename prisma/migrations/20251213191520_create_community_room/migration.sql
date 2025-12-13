/*
  Warnings:

  - The `sourceType` column on the `CommunityPost` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "CommunityPostSourceType" AS ENUM ('COMMUNITY', 'WORKBOOK', 'MENTOR_PROMPT');

-- CreateEnum
CREATE TYPE "WorkbookSection" AS ENUM ('REFLECT', 'APPLY', 'INTEGRATE');

-- DropForeignKey
ALTER TABLE "MentorNote" DROP CONSTRAINT "MentorNote_memberId_fkey";

-- DropForeignKey
ALTER TABLE "MentorNote" DROP CONSTRAINT "MentorNote_mentorId_fkey";

-- DropForeignKey
ALTER TABLE "RegistryItem" DROP CONSTRAINT "RegistryItem_userId_fkey";

-- AlterTable
ALTER TABLE "CommunityPost" ADD COLUMN     "isAnnouncement" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isMentorPrompt" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPinned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pinnedAt" TIMESTAMP(3),
ADD COLUMN     "sourceSection" "WorkbookSection",
ADD COLUMN     "workbookEntryId" TEXT,
DROP COLUMN "sourceType",
ADD COLUMN     "sourceType" "CommunityPostSourceType" NOT NULL DEFAULT 'COMMUNITY';

-- CreateTable
CREATE TABLE "OnboardingProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "recommendations" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnboardingProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademyProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcademyProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityRoom" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "moduleId" TEXT,
    "minRole" "Role" NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityReply" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityReply_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingProfile_userId_key" ON "OnboardingProfile"("userId");

-- CreateIndex
CREATE INDEX "AcademyProgress_userId_idx" ON "AcademyProgress"("userId");

-- CreateIndex
CREATE INDEX "AcademyProgress_moduleId_idx" ON "AcademyProgress"("moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "AcademyProgress_userId_moduleId_key" ON "AcademyProgress"("userId", "moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityRoom_name_key" ON "CommunityRoom"("name");

-- CreateIndex
CREATE INDEX "CommunityRoom_moduleId_idx" ON "CommunityRoom"("moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityRoom_moduleId_key" ON "CommunityRoom"("moduleId");

-- CreateIndex
CREATE INDEX "CommunityReply_postId_idx" ON "CommunityReply"("postId");

-- CreateIndex
CREATE INDEX "CommunityReply_userId_idx" ON "CommunityReply"("userId");

-- CreateIndex
CREATE INDEX "CommunityPost_roomId_idx" ON "CommunityPost"("roomId");

-- CreateIndex
CREATE INDEX "CommunityPost_userId_idx" ON "CommunityPost"("userId");

-- CreateIndex
CREATE INDEX "CommunityPost_isAnnouncement_idx" ON "CommunityPost"("isAnnouncement");

-- CreateIndex
CREATE INDEX "MentorNote_memberId_idx" ON "MentorNote"("memberId");

-- CreateIndex
CREATE INDEX "MentorNote_mentorId_idx" ON "MentorNote"("mentorId");

-- CreateIndex
CREATE INDEX "RegistryItem_userId_idx" ON "RegistryItem"("userId");

-- AddForeignKey
ALTER TABLE "OnboardingProfile" ADD CONSTRAINT "OnboardingProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistryItem" ADD CONSTRAINT "RegistryItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorNote" ADD CONSTRAINT "MentorNote_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorNote" ADD CONSTRAINT "MentorNote_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademyProgress" ADD CONSTRAINT "AcademyProgress_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "AcademyModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademyProgress" ADD CONSTRAINT "AcademyProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityRoom" ADD CONSTRAINT "CommunityRoom_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "AcademyModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityPost" ADD CONSTRAINT "CommunityPost_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "CommunityRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityPost" ADD CONSTRAINT "CommunityPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityReply" ADD CONSTRAINT "CommunityReply_postId_fkey" FOREIGN KEY ("postId") REFERENCES "CommunityPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityReply" ADD CONSTRAINT "CommunityReply_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
