-- Add mentor product suggestions for decision-support compare
CREATE TABLE "MentorProductSuggestion" (
  "id" TEXT NOT NULL,
  "mentorId" TEXT NOT NULL,
  "memberId" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "note" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "acceptedAt" TIMESTAMP(3),

  CONSTRAINT "MentorProductSuggestion_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "MentorProductSuggestion_mentorId_idx" ON "MentorProductSuggestion"("mentorId");
CREATE INDEX "MentorProductSuggestion_memberId_idx" ON "MentorProductSuggestion"("memberId");
CREATE INDEX "MentorProductSuggestion_category_idx" ON "MentorProductSuggestion"("category");

ALTER TABLE "MentorProductSuggestion"
  ADD CONSTRAINT "MentorProductSuggestion_mentorId_fkey"
  FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MentorProductSuggestion"
  ADD CONSTRAINT "MentorProductSuggestion_memberId_fkey"
  FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MentorProductSuggestion"
  ADD CONSTRAINT "MentorProductSuggestion_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
