import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { AppDataSource } from '../database/data-source';

type Command = 'init' | 'migrate' | 'reset';

const migrationsDir = resolve(
  process.cwd(),
  'packages/nattivus-shell/migrations',
);

const runSqlFile = async (file: string) => {
  const sql = await readFile(resolve(migrationsDir, file), 'utf8');

  if (sql.trim().length === 0) {
    return;
  }

  await AppDataSource.query(sql);
};

const runMigrations = async () => {
  const files = (await readdir(migrationsDir))
    .filter((file) => file.endsWith('.sql'))
    .sort();

  for (const file of files) {
    await runSqlFile(file);
    process.stdout.write(`applied ${file}\n`);
  }
};

const resetDatabase = async () => {
  await AppDataSource.query('DROP SCHEMA public CASCADE');
  await AppDataSource.query('CREATE SCHEMA public');
  await AppDataSource.query('GRANT ALL ON SCHEMA public TO public');
};

const main = async () => {
  const command = process.argv[2] as Command | undefined;

  if (!command || !['init', 'migrate', 'reset'].includes(command)) {
    throw new Error('Usage: db.ts <init|migrate|reset>');
  }

  await AppDataSource.initialize();

  try {
    if (command === 'reset') {
      await resetDatabase();
    }

    await runMigrations();
  } finally {
    await AppDataSource.destroy();
  }
};

void main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : error}\n`);
  process.exitCode = 1;
});
