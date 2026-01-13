/* 
  Restore Blog schema (additive, production-safe)

  This migration restores missing Blog tables and columns that exist
  in the Prisma schema but are absent in production due to schema drift.

  - No destructive operations
  - All changes are IF NOT EXISTS
*/

/* -------------------------------------------------
   BlogPost missing columns
-------------------------------------------------- */

ALTER TABLE "BlogPost"
  ADD COLUMN IF NOT EXISTS "submittedAt" TIMESTAMP,
  ADD COLUMN IF NOT EXISTS "approvedAt" TIMESTAMP,
  ADD COLUMN IF NOT EXISTS "publishedAt" TIMESTAMP,
  ADD COLUMN IF NOT EXISTS "authorName" TEXT;

/* -------------------------------------------------
   BlogAffiliateLink table
-------------------------------------------------- */

CREATE TABLE IF NOT EXISTS "BlogAffiliateLink" (
  "id" TEXT PRIMARY KEY,
  "blogPostId" TEXT NOT NULL,
  "affiliatePartnerId" TEXT,
  "url" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);

/* -------------------------------------------------
   BlogHighlight table
-------------------------------------------------- */

CREATE TABLE IF NOT EXISTS "BlogHighlight" (
  "id" TEXT PRIMARY KEY,
  "blogPostId" TEXT NOT NULL,
  "content" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);

/* -------------------------------------------------
   Optional indexes (safe, non-blocking)
-------------------------------------------------- */

CREATE INDEX IF NOT EXISTS "BlogAffiliateLink_blogPostId_idx"
  ON "BlogAffiliateLink" ("blogPostId");

CREATE INDEX IF NOT EXISTS "BlogHighlight_blogPostId_idx"
  ON "BlogHighlight" ("blogPostId");