# Production Schema Inspection Pack

_Read-only, Heroku-safe Prisma-aware inspection scripts for the blog schema._

## How to connect

Run the Heroku Postgres shell for Taylor-Made Baby Co:

```bash
heroku pg:psql --app tmbc
```

## How to run each script

From the `psql` prompt run:

```sql
\i scripts/db/inspection/01_prisma_migration_state.sql
\i scripts/db/inspection/02_blog_tables.sql
\i scripts/db/inspection/03_blog_enums.sql
\i scripts/db/inspection/04_case_sensitivity_check.sql
```

Each script only selects metadata and never writes data.

## What each result means

- `Blog enums present + tables missing` → migrations partially applied; do not auto-replay.
- `Prisma shows failed migration` (finished_at NULL) → the migration failed and must be resolved before any deploy.
- `Tables missing but Prisma client expects them` → explains the P2021 crashes and motivates the runtime guards.
