-- AlterTable
ALTER TABLE "User"
  ADD COLUMN     "myRegistryAccessToken" TEXT,
  ADD COLUMN     "myRegistryRefreshToken" TEXT,
  ADD COLUMN     "myRegistryTokenExpires" TIMESTAMP(3),
  ADD COLUMN     "myRegistryLastSyncedAt" TIMESTAMP(3);

-- AlterEnum
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'RegistryStatus'
  ) THEN
    CREATE TYPE "RegistryStatus" AS ENUM ('ACTIVE','NEEDED','RESERVED','PURCHASED','PURCHASED_ELSEWHERE','REMOVED_REMOTE');
  ELSE
    IF NOT EXISTS (
      SELECT 1 FROM pg_enum e
      JOIN pg_type t ON e.enumtypid = t.oid
      WHERE t.typname = 'RegistryStatus' AND e.enumlabel = 'REMOVED_REMOTE'
    ) THEN
      ALTER TYPE "RegistryStatus" ADD VALUE 'REMOVED_REMOTE';
    END IF;
  END IF;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "RegistryConflict" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "localValue" TEXT,
    "remoteValue" TEXT,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RegistryConflict_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RegistryConflict"
  ADD CONSTRAINT IF NOT EXISTS "RegistryConflict_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "RegistryConflict"
  ADD CONSTRAINT IF NOT EXISTS "RegistryConflict_itemId_fkey"
  FOREIGN KEY ("itemId") REFERENCES "RegistryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "RegistryConflict_userId_idx" ON "RegistryConflict"("userId");
CREATE INDEX IF NOT EXISTS "RegistryConflict_itemId_idx" ON "RegistryConflict"("itemId");
CREATE INDEX IF NOT EXISTS "RegistryConflict_userId_resolved_idx" ON "RegistryConflict"("userId", "resolved");
