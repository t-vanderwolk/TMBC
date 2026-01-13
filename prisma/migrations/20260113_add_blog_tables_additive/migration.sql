/* ================================
   BLOG ENUMS (additive)
   ================================ */

DO $$ BEGIN
  CREATE TYPE "BlogStatus" AS ENUM (
    'DRAFT',
    'SUBMITTED',
    'APPROVED',
    'PUBLISHED',
    'ARCHIVED'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "BlogAuthorRole" AS ENUM (
    'ADMIN',
    'MENTOR'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "BlogHighlightEventType" AS ENUM (
    'VIEW',
    'CLICK'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


/* ================================
   BLOG AFFILIATE LINKS
   ================================ */

CREATE TABLE IF NOT EXISTS "BlogAffiliateLink" (
  "id" TEXT PRIMARY KEY,
  "blogPostId" TEXT NOT NULL,
  "partnerName" TEXT NOT NULL,
  "affiliateUrl" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),

  CONSTRAINT "BlogAffiliateLink_blogPostId_fkey"
    FOREIGN KEY ("blogPostId")
    REFERENCES "BlogPost"("id")
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "BlogAffiliateLink_blogPostId_idx"
  ON "BlogAffiliateLink"("blogPostId");

CREATE INDEX IF NOT EXISTS "BlogAffiliateLink_partnerName_idx"
  ON "BlogAffiliateLink"("partnerName");


/* ================================
   BLOG HIGHLIGHTS
   ================================ */

CREATE TABLE IF NOT EXISTS "BlogHighlight" (
  "id" TEXT PRIMARY KEY,
  "blogPostId" TEXT NOT NULL,
  "brandName" TEXT,
  "productId" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),

  CONSTRAINT "BlogHighlight_blogPostId_fkey"
    FOREIGN KEY ("blogPostId")
    REFERENCES "BlogPost"("id")
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "BlogHighlight_blogPostId_idx"
  ON "BlogHighlight"("blogPostId");

CREATE INDEX IF NOT EXISTS "BlogHighlight_brandName_idx"
  ON "BlogHighlight"("brandName");