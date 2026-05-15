import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

/**
 * global-setup.ts — Executado uma vez antes de todos os testes do nattivus-shell.
 * Garante banco de teste existente e aplica migrações.
 */
export default async function globalSetup() {
  const dbUrl =
    process.env.TEST_DATABASE_URL ??
    'postgresql://nattivus:nattivus@localhost:5432/nattivus_test';

  // Cria banco se não existir
  const u = new URL(dbUrl);
  const adminClient = new Client({
    host: u.hostname,
    port: parseInt(u.port || '5432'),
    user: u.username,
    password: u.password,
    database: 'postgres',
  });
  await adminClient.connect();
  await adminClient
    .query(`CREATE DATABASE "${u.pathname.slice(1)}"`)
    .catch((e) => { if (e.code !== '42P04') throw e; });
  await adminClient.end();

  // Aplica migrações
  const testClient = new Client({ connectionString: dbUrl });
  await testClient.connect();

  await testClient.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id serial PRIMARY KEY,
      name text NOT NULL UNIQUE,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `);

  const migrationsDir = path.resolve(__dirname, '..', 'migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
  const { rows } = await testClient.query('SELECT name FROM _migrations');
  const applied = new Set(rows.map((r: any) => r.name));

  for (const file of files) {
    if (applied.has(file)) continue;
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
    await testClient.query('BEGIN');
    await testClient.query(sql);
    await testClient.query('INSERT INTO _migrations (name) VALUES ($1)', [file]);
    await testClient.query('COMMIT');
  }

  await testClient.end();
}
