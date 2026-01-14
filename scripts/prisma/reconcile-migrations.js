/**
 * Prisma Migration Reconciliation Script (SAFE MODE)
 *
 * What this does:
 * - Reads which migrations Prisma believes are APPLIED (via prisma migrate status)
 * - Compares their migration.sql files to git (HEAD → origin/main)
 * - Restores migration.sql when drift is detected
 * - NEVER touches the database
 * - NEVER installs dependencies
 *
 * What this does NOT do:
 * - No checksum writes
 * - No DB connections
 * - No schema mutations
 *
 * Usage:
 *   npm run db:reconcile
 */

const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const { execSync, execFileSync } = require('child_process');

const migrationsRoot = path.resolve(process.cwd(), 'prisma', 'migrations');

function sha256(content) {
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

/**
 * Ask Prisma which migrations are applied
 */
function getAppliedMigrations() {
  const output = execSync(
    'npx prisma migrate status --schema=prisma/schema.prisma',
    { encoding: 'utf8' }
  );

  const applied = [];
  for (const line of output.split('\n')) {
    const match = line.match(/^\s+([0-9]{14}_.+)\s+\(applied\)$/);
    if (match) applied.push(match[1]);
  }

  return applied;
}

/**
 * Try to restore migration.sql from git
 */
function restoreFromGit(migrationName) {
  const relPath = path.posix.join(
    'prisma',
    'migrations',
    migrationName,
    'migration.sql'
  );

  for (const ref of ['HEAD', 'origin/main']) {
    try {
      const content = execFileSync(
        'git',
        ['show', `${ref}:${relPath}`],
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
      );
      if (content) {
        return { restored: true, ref, content };
      }
    } catch {
      // try next ref
    }
  }

  return { restored: false };
}

(async function main() {
  const applied = getAppliedMigrations();

  const report = {
    restored: [],
    unchanged: [],
    unresolved: [],
  };

  for (const migrationName of applied) {
    const migrationPath = path.join(
      migrationsRoot,
      migrationName,
      'migration.sql'
    );

    let localContent;
    try {
      localContent = await fs.readFile(migrationPath, 'utf8');
    } catch {
      report.unresolved.push({
        migration: migrationName,
        reason: 'migration.sql missing locally',
      });
      continue;
    }

    const localHash = sha256(localContent);
    const gitResult = restoreFromGit(migrationName);

    if (!gitResult.restored) {
      report.unresolved.push({
        migration: migrationName,
        reason: 'not found in git (HEAD or origin/main)',
      });
      continue;
    }

    const gitHash = sha256(gitResult.content);

    if (gitHash === localHash) {
      report.unchanged.push(migrationName);
      continue;
    }

    await fs.writeFile(migrationPath, gitResult.content, 'utf8');
    report.restored.push({
      migration: migrationName,
      source: gitResult.ref,
    });
  }

  console.log('\n🧩 Prisma Migration Reconciliation Report\n');

  if (report.restored.length) {
    console.log('✅ Restored from git:');
    report.restored.forEach(r =>
      console.log(`  - ${r.migration} (from ${r.source})`)
    );
  }

  if (report.unchanged.length) {
    console.log('\n✔️ Already consistent:');
    report.unchanged.forEach(m =>
      console.log(`  - ${m}`)
    );
  }

  if (report.unresolved.length) {
    console.log('\n⚠️ Unresolved migrations:');
    report.unresolved.forEach(r =>
      console.log(`  - ${r.migration}: ${r.reason}`)
    );
    console.log(
      '\nFix unresolved items manually, then rerun this script.'
    );
    process.exitCode = 1;
    return;
  }

  console.log('\n🎉 All applied migrations are now reconciled.');
  console.log('You may now safely run:');
  console.log('  npx prisma migrate dev\n');

  process.exitCode = 0;
})();