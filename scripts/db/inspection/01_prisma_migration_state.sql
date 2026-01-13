-- Prisma migration state overview
-- finished_at IS NULL → migration failed / stuck
-- rolled_back_at IS NOT NULL → rollout resolved via rollback
-- Missing local migrations vs prod = baseline mismatch
SELECT
  migration_name,
  started_at,
  finished_at,
  rolled_back_at,
  applied_steps_count
FROM "prisma_migrations"
ORDER BY started_at ASC;
