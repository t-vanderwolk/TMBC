import { execSync } from 'child_process';
import path from 'path';

import { prisma } from '../prisma/client';

const backendDir = path.resolve(__dirname, '..');

const run = (command: string) => {
  execSync(command, {
    cwd: backendDir,
    stdio: 'inherit',
    env: process.env,
  });
};

async function main() {
  try {
    console.log('Dropping all tables via raw schema reset...');
    await prisma.$executeRawUnsafe('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
    console.log('Re-running migrations (prisma migrate reset)...');
    run('npx prisma migrate reset --force');
    console.log('Seeding database...');
    run('npx ts-node --transpile-only prisma/seed.ts');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Database rebuild failed:', error);
  process.exit(1);
});
