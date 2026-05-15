#!/usr/bin/env node
/**
 * unlock-user CLI — Reseta lock de usuário após tentativas de login excessivas.
 *
 * Uso:
 *   yarn ts-node src/cli/unlock-user.ts --email admin@example.com
 *   yarn ts-node src/cli/unlock-user.ts --id <uuid>
 *
 * Ref: T061, data-delta.md §2.1 (failed_login_count, locked_until)
 */

import { Client } from 'pg';

async function main() {
  const args = process.argv.slice(2);
  const emailIdx = args.indexOf('--email');
  const idIdx = args.indexOf('--id');

  const email = emailIdx !== -1 ? args[emailIdx + 1] : undefined;
  const userId = idIdx !== -1 ? args[idIdx + 1] : undefined;

  if (!email && !userId) {
    console.error('Usage: unlock-user --email <email> | --id <uuid>');
    process.exit(1);
  }

  const dbUrl = process.env['DATABASE_URL'];
  if (!dbUrl) throw new Error('DATABASE_URL is required');

  const client = new Client({ connectionString: dbUrl });
  await client.connect();

  try {
    let whereClause: string;
    let values: string[];

    if (userId) {
      whereClause = 'id = $1';
      values = [userId];
    } else {
      whereClause = 'email = $1';
      values = [email!];
    }

    // Busca o usuário antes de resetar
    const { rows: before } = await client.query(
      `SELECT id, email, failed_login_count, locked_until, status
       FROM "user" WHERE ${whereClause}`,
      values,
    );

    if (!before.length) {
      console.error(`❌ User not found: ${email ?? userId}`);
      process.exit(1);
    }

    const user = before[0];
    console.log(`Found user: ${user.email} (${user.id})`);
    console.log(`  status:             ${user.status}`);
    console.log(`  failed_login_count: ${user.failed_login_count}`);
    console.log(`  locked_until:       ${user.locked_until ?? 'not locked'}`);

    if (!user.locked_until && user.failed_login_count === 0) {
      console.log('\n✓ User is not locked — nothing to reset.');
      return;
    }

    // Reset
    await client.query(
      `UPDATE "user"
       SET failed_login_count = 0, locked_until = NULL
       WHERE ${whereClause}`,
      values,
    );

    console.log('\n✅ User unlocked successfully!');
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('❌ unlock-user failed:', err.message);
  process.exit(1);
});
