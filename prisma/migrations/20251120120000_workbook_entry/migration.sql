-- 20251120120000_workbook_entry
-- Column-parity restorative migration
-- DO NOT NOOP — downstream migrations depend on this structure

-- Ensure table exists
CREATE TABLE IF NOT EXISTS "WorkbookEntry" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "content" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "WorkbookEntry_pkey" PRIMARY KEY ("id")
);

-- Add missing columns safely
ALTER TABLE "WorkbookEntry"
  ADD COLUMN IF NOT EXISTS "module" TEXT;

ALTER TABLE "WorkbookEntry"
  ADD COLUMN IF NOT EXISTS "type" "WorkbookEntryType";

-- Backfill using VALID enum value
UPDATE "WorkbookEntry"
SET "module" = 'unknown'
WHERE "module" IS NULL;

UPDATE "WorkbookEntry"
SET "type" = 'REFLECTION'
WHERE "type" IS NULL;

-- Enforce NOT NULL after backfill
ALTER TABLE "WorkbookEntry"
  ALTER COLUMN "module" SET NOT NULL,
  ALTER COLUMN "type" SET NOT NULL;

-- Required unique constraint
CREATE UNIQUE INDEX IF NOT EXISTS
  "WorkbookEntry_user_module_type_unique"
ON "WorkbookEntry" ("userId", "module", "type");

-- Helpful lookup index
CREATE INDEX IF NOT EXISTS
  "WorkbookEntry_userId_idx"
ON "WorkbookEntry" ("userId");
