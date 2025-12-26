-- Add sent timestamp tracking for admin invite emails.
ALTER TABLE "Invite" ADD COLUMN "sentAt" TIMESTAMP(3);
