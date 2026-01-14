-- Defensive migration: add authorRoleSnapshot to BlogPost if possible
-- This migration is intentionally idempotent and safe for production

DO $$
BEGIN
  -- Only run if BlogPost table exists
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_name = 'BlogPost'
      AND table_schema = 'public'
  ) THEN

    -- Add column only if it does not already exist
    IF NOT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_name = 'BlogPost'
        AND column_name = 'authorRoleSnapshot'
        AND table_schema = 'public'
    ) THEN
      ALTER TABLE "BlogPost"
      ADD COLUMN "authorRoleSnapshot" TEXT;
    END IF;

  END IF;
END $$;