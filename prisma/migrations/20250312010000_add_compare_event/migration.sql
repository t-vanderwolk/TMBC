-- Add decision support compare tracking
CREATE TYPE "RegistryDecisionStatus" AS ENUM ('ACCEPTED');
CREATE TYPE "CompareDecision" AS ENUM ('accept', 'modify', 'defer');
CREATE TYPE "CompareSource" AS ENUM ('onboarding', 'academy', 'mentor', 'member');

ALTER TABLE "RegistryItem"
  ADD COLUMN "decisionStatus" "RegistryDecisionStatus";

CREATE TABLE "CompareEvent" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "registryId" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "itemIds" TEXT[] NOT NULL,
  "decision" "CompareDecision" NOT NULL,
  "source" "CompareSource" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "CompareEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CompareEvent_userId_idx" ON "CompareEvent"("userId");
CREATE INDEX "CompareEvent_registryId_idx" ON "CompareEvent"("registryId");
CREATE INDEX "CompareEvent_category_idx" ON "CompareEvent"("category");

ALTER TABLE "CompareEvent"
  ADD CONSTRAINT "CompareEvent_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CompareEvent"
  ADD CONSTRAINT "CompareEvent_registryId_fkey"
  FOREIGN KEY ("registryId") REFERENCES "Registry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
