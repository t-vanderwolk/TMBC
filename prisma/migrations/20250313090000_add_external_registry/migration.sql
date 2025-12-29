-- Create ExternalRegistry and ExternalRegistryNote tables for reference-only external registries.
CREATE TABLE "ExternalRegistry" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "title" TEXT,
    "url" TEXT,
    "documentUrl" TEXT,
    "documentLabel" TEXT,
    "referenceOnly" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExternalRegistry_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ExternalRegistryNote" (
    "id" TEXT NOT NULL,
    "registryId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExternalRegistryNote_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ExternalRegistry_memberId_idx" ON "ExternalRegistry"("memberId");
CREATE INDEX "ExternalRegistryNote_registryId_idx" ON "ExternalRegistryNote"("registryId");
CREATE INDEX "ExternalRegistryNote_authorId_idx" ON "ExternalRegistryNote"("authorId");

ALTER TABLE "ExternalRegistry" ADD CONSTRAINT "ExternalRegistry_memberId_fkey"
    FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ExternalRegistryNote" ADD CONSTRAINT "ExternalRegistryNote_registryId_fkey"
    FOREIGN KEY ("registryId") REFERENCES "ExternalRegistry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ExternalRegistryNote" ADD CONSTRAINT "ExternalRegistryNote_authorId_fkey"
    FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
