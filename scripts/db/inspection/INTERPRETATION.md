## Inspection interpretation guide

### If Blog tables are missing
- Prisma throws `P2021` because the client expects tables such as `BlogAffiliateLink` in the public schema.
- Guards were added so the admin/mentor UI can detect this state and disable blog flows without crashing.
- The dashboard could still render after auth succeeded because we now return safe snapshots instead of re-querying missing tables.

### If migrations exist in the DB but not locally
- The production baseline differs from local schema, so Prisma reports `last common migration = null` when it cannot match `prisma_migrations`.
- A new baseline effort is required before running any migrations locally; do not attempt to replay migrations on an unknown schema.

### If enums exist but tables do not
- Enums are created early by certain migrations, so a partially applied migration can leave enums even when later tables never materialized.
- This tells us the migration was interrupted; additively restoring the missing tables (not replaying the entire migration) is the safe repair path.

❗ No schema repair should occur until this inspection is complete and reviewed.
