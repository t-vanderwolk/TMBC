-- Add member-initiated mentor collaboration tracking for MyRegistry
ALTER TABLE "User"
  ADD COLUMN "mentorCollabRequestedAt" TIMESTAMP(3),
  ADD COLUMN "mentorCollabConfirmedAt" TIMESTAMP(3),
  ADD COLUMN "mentorCollabEmail" TEXT;
