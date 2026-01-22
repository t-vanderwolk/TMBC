CREATE TABLE IF NOT EXISTS "AffiliateAdminMeta" (
  "affiliateKey" TEXT PRIMARY KEY,
  "network" TEXT,
  "programId" TEXT,
  "tier" TEXT,
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "overrideBaseUrl" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
