-- AlterTable
ALTER TABLE "User"
  ADD COLUMN "pinterestAccessToken" TEXT,
  ADD COLUMN "pinterestRefreshToken" TEXT,
  ADD COLUMN "pinterestTokenExpires" TIMESTAMP(3);

-- CreateType
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'WorkbookEntryType'
  ) THEN
    CREATE TYPE "WorkbookEntryType" AS ENUM ('JOURNAL','MOODBOARD','CHECKLIST','REFLECTION');
  END IF;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "WorkbookEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "type" "WorkbookEntryType" NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WorkbookEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkbookEntry"
  ADD CONSTRAINT "WorkbookEntry_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WorkbookEntry"
  ADD CONSTRAINT "WorkbookEntry_moduleId_fkey"
  FOREIGN KEY ("moduleId") REFERENCES "AcademyModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateUnique
ALTER TABLE "WorkbookEntry"
  ADD CONSTRAINT "WorkbookEntry_user_module_type_unique"
  UNIQUE ("userId", "moduleId", "type");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "WorkbookEntry_userId_idx" ON "WorkbookEntry"("userId");
CREATE INDEX IF NOT EXISTS "WorkbookEntry_moduleId_idx" ON "WorkbookEntry"("moduleId");
