-- Blog-related enums
-- Enums sometimes remain even when tables are missing because migrations partially applied enums separately
SELECT t.typname AS enum_name
FROM pg_type t
JOIN pg_namespace n ON n.oid = t.typnamespace
WHERE n.nspname = 'public'
  AND t.typname ILIKE 'blog%'
ORDER BY t.typname;
