-- Ensure CommunityPost exists before referencing it
CREATE TABLE IF NOT EXISTS "CommunityPost" (
  "id" TEXT NOT NULL,
  "roomId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "sourcePrompt" TEXT,
  "sourceType" TEXT NOT NULL DEFAULT 'COMMUNITY',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "CommunityPost_pkey" PRIMARY KEY ("id")
);