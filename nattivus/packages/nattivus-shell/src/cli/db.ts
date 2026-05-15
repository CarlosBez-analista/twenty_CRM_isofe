import * as fs from 'fs';
import * as path from 'path';
import { Client } from 'pg';

/**
 * CLI para gerenciamento de banco de dados do NattivusECO Shell.
 *
 * Comandos:
 *   init    — Cria o banco se não existir
 *   migrate — Executa migrações SQL em ordem
 *   reset   — Dropa e recria o banco, re-executa migrações
 *
 * Ref: T022, roadmap.md §5.2
 */

const DATABASE_URL = process.env.DATABASE_URL ?? 'postgresql://nattivus:nattivus@localhost:5432/nattivus_dev';

function parseDatabaseUrl(url: string) {
  const u = new URL(url);
  return {
    host: u.hostname,
    port: parseInt(u.port || '5432', 10),
    user: u.username,
    password: u.password,
    database: u.pathname.slice(1),
  };
}

async function runQuery(client: Client, sql: string) {
  try {
    await client.query(sql);
  } catch (err: any) {
    if (err.code !== '42P04') throw err; // 42P04 = database already exists
  }
}

async function init() {
  const config = parseDatabaseUrl(DATABASE_URL);
  const client = new Client({ ...config, database: 'postgres' });
  await client.connect();
  console.log(`📦 Creating database "${config.database}" if not exists...`);
  await runQuery(client, `CREATE DATABASE "${config.database}"`);
  await client.end();
  console.log('✅ Database ready.');
}

async function migrate() {
  const config = parseDatabaseUrl(DATABASE_URL);
  const client = new Client(config);
  await client.connect();

  // Ensure migrations tracking table
  await client.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id serial PRIMARY KEY,
      name text NOT NULL UNIQUE,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `);

  const migrationsDir = path.resolve(__dirname, '..', '..', 'migrations');
  if (!fs.existsSync(migrationsDir)) {
    console.log('⚠️  No migrations directory found.');
    await client.end();
    return;
  }

  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  const { rows: applied } = await client.query('SELECT name FROM _migrations');
  const appliedSet = new Set(applied.map((r: any) => r.name));

  let count = 0;
  for (const file of files) {
    if (appliedSet.has(file)) continue;
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
    console.log(`⏳ Applying ${file}...`);
    await client.query('BEGIN');
    try {
      await client.query(sql);
      await client.query('INSERT INTO _migrations (name) VALUES ($1)', [file]);
      await client.query('COMMIT');
      count++;
      console.log(`  ✅ ${file}`);
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(`  ❌ ${file} failed:`, err);
      throw err;
    }
  }

  await client.end();
  console.log(`\n🎉 ${count} migration(s) applied.`);
}

async function reset() {
  const config = parseDatabaseUrl(DATABASE_URL);
  const client = new Client({ ...config, database: 'postgres' });
  await client.connect();
  console.log(`🗑️  Dropping database "${config.database}"...`);
  await client.query(`DROP DATABASE IF EXISTS "${config.database}"`);
  await client.end();
  await init();
  await migrate();
}

const command = process.argv[2];
const commands: Record<string, () => Promise<void>> = { init, migrate, reset };

if (!commands[command]) {
  console.error(`Usage: ts-node db.ts <init|migrate|reset>`);
  process.exit(1);
}

commands[command]().catch((err) => {
  console.error('💥 Fatal error:', err);
  process.exit(1);
});
