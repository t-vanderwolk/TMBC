-- Add price intelligence snapshots + watches (advocacy only)
CREATE TABLE "PriceSnapshot" (
  "id" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "affiliatePartnerId" TEXT,
  "price" DOUBLE PRECISION NOT NULL,
  "currency" TEXT NOT NULL,
  "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "PriceSnapshot_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PriceSnapshot_productId_idx" ON "PriceSnapshot"("productId");
CREATE INDEX "PriceSnapshot_affiliatePartnerId_idx" ON "PriceSnapshot"("affiliatePartnerId");
CREATE INDEX "PriceSnapshot_capturedAt_idx" ON "PriceSnapshot"("capturedAt");

ALTER TABLE "PriceSnapshot"
  ADD CONSTRAINT "PriceSnapshot_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PriceSnapshot"
  ADD CONSTRAINT "PriceSnapshot_affiliatePartnerId_fkey"
  FOREIGN KEY ("affiliatePartnerId") REFERENCES "AffiliatePartner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "RegistryPriceWatch" (
  "id" TEXT NOT NULL,
  "registryItemId" TEXT NOT NULL,
  "watchStartedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "purchaseRecordedAt" TIMESTAMP(3),
  "lastNotifiedAt" TIMESTAMP(3),

  CONSTRAINT "RegistryPriceWatch_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "RegistryPriceWatch_registryItemId_key" ON "RegistryPriceWatch"("registryItemId");

ALTER TABLE "RegistryPriceWatch"
  ADD CONSTRAINT "RegistryPriceWatch_registryItemId_fkey"
  FOREIGN KEY ("registryItemId") REFERENCES "RegistryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
