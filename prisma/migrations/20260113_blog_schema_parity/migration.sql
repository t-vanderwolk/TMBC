-- ================================
-- BLOG SCHEMA PARITY (ADDITIVE)
-- ================================

-- 1. Blog status enum
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'BlogStatus'
  ) THEN
    CREATE TYPE "BlogStatus" AS ENUM (
      'DRAFT',
      'SUBMITTED',
      'APPROVED',
      'PUBLISHED'
    );
  END IF;
END$$;

-- 2. Extend BlogPost table
ALTER TABLE "BlogPost"
  ADD COLUMN IF NOT EXISTS "status" "BlogStatus" NOT NULL DEFAULT 'DRAFT',
  ADD COLUMN IF NOT EXISTS "authorName" TEXT,
  ADD COLUMN IF NOT EXISTS "submittedAt" TIMESTAMP,
  ADD COLUMN IF NOT EXISTS "approvedAt" TIMESTAMP,
  ADD COLUMN IF NOT EXISTS "publishedAt" TIMESTAMP,
  ADD COLUMN IF NOT EXISTS "isAffiliate" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW();

-- 3. BlogAffiliateLink table
CREATE TABLE IF NOT EXISTS "BlogAffiliateLink" (
  id TEXT PRIMARY KEY,
  "blogPostId" TEXT NOT NULL,
  "partnerName" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 4. BlogHighlight table
CREATE TABLE IF NOT EXISTS "BlogHighlight" (
  id TEXT PRIMARY KEY,
  "blogPostId" TEXT NOT NULL,
  "brandName" TEXT,
  "productId" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 5. Indexes (safe)
CREATE INDEX IF NOT EXISTS "BlogPost_slug_idx" ON "BlogPost"(slug);
CREATE INDEX IF NOT EXISTS "BlogPost_status_idx" ON "BlogPost"(status);
CREATE INDEX IF NOT EXISTS "BlogAffiliateLink_blogPostId_idx"
  ON "BlogAffiliateLink"("blogPostId");
CREATE INDEX IF NOT EXISTS "BlogHighlight_blogPostId_idx"
  ON "BlogHighlight"("blogPostId");