import { Client } from 'pg';
import * as crypto from 'crypto';

/**
 * Fixtures e helpers de teste para o NattivusECO Shell.
 *
 * Cria objetos de teste isolados (workspaces, users) e helpers para
 * simulação de contexto multi-tenant nos testes de integração.
 *
 * Ref: actions.md T026, requirements.md §7 (cenários Gherkin)
 */

// ──────────────────────────────────────────────
// Conexão compartilhada de teste
// ──────────────────────────────────────────────

const TEST_DB_URL =
  process.env.TEST_DATABASE_URL ??
  'postgresql://nattivus:nattivus@localhost:5432/nattivus_test';

let sharedClient: Client | null = null;

export async function getTestClient(): Promise<Client> {
  if (!sharedClient) {
    sharedClient = new Client({ connectionString: TEST_DB_URL });
    await sharedClient.connect();
  }
  return sharedClient;
}

export async function closeTestClient(): Promise<void> {
  if (sharedClient) {
    await sharedClient.end();
    sharedClient = null;
  }
}

// ──────────────────────────────────────────────
// Helpers de criação
// ──────────────────────────────────────────────

export interface TestUser {
  id: string;
  email: string;
  passwordHash: string;
}

export interface TestWorkspace {
  id: string;
  slug: string;
  displayName: string;
}

/** Cria um usuário de teste com email único e senha pré-hashada */
export async function createTestUser(
  overrides: Partial<{ email: string; passwordHash: string; status: string }> = {},
): Promise<TestUser> {
  const client = await getTestClient();
  const email = overrides.email ?? `test-${crypto.randomUUID()}@nattivus.test`;
  const passwordHash =
    overrides.passwordHash ??
    // hash Argon2id pre-computed para "Test1234!" — só em testes!
    '$argon2id$v=19$m=65536,t=3,p=4$c2FsdHNhbHRzYWx0c2Fs$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
  const status = overrides.status ?? 'active';

  const { rows } = await client.query<{ id: string }>(
    `INSERT INTO "user" (email, password_hash, status)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [email, passwordHash, status],
  );

  return { id: rows[0].id, email, passwordHash };
}

/** Cria um workspace de teste com slug único */
export async function createTestWorkspace(
  overrides: Partial<{ slug: string; displayName: string; profile: string }> = {},
): Promise<TestWorkspace> {
  const client = await getTestClient();
  const slug = overrides.slug ?? `ws-${crypto.randomUUID().slice(0, 8)}`;
  const displayName = overrides.displayName ?? `Test Workspace ${slug}`;
  const profile = overrides.profile ?? 'social';

  const { rows } = await client.query<{ id: string }>(
    `INSERT INTO workspace (slug, display_name, profile)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [slug, displayName, profile],
  );

  return { id: rows[0].id, slug, displayName };
}

/** Adiciona um usuário como membro de um workspace com roles */
export async function addWorkspaceMember(
  workspaceId: string,
  userId: string,
  roles: string[] = ['member'],
): Promise<void> {
  const client = await getTestClient();
  await client.query(
    `INSERT INTO workspace_member (workspace_id, user_id, roles, accepted_at)
     VALUES ($1, $2, $3, now())`,
    [workspaceId, userId, roles],
  );
}

// ──────────────────────────────────────────────
// Helpers de contexto multi-tenant
// ──────────────────────────────────────────────

/**
 * Executa uma função com o contexto de workspace/user ativo via SET LOCAL.
 * Simula o que o TenantContextMiddleware faz em produção.
 */
export async function withWorkspaceContext(
  workspaceId: string,
  userId: string,
  fn: (client: Client) => Promise<void>,
): Promise<void> {
  const client = await getTestClient();
  await client.query('BEGIN');
  await client.query(`SET LOCAL app.workspace_id = '${workspaceId}'`);
  await client.query(`SET LOCAL app.user_id = '${userId}'`);
  try {
    await fn(client);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  }
}

// ──────────────────────────────────────────────
// Helper TOTP
// ──────────────────────────────────────────────

/**
 * Simula enrollment TOTP para um usuário de teste.
 * Insere segredo em plaintext na mfa_secret (sem criptografia em teste).
 */
export async function withTotp(
  userId: string,
  secretBase32 = 'JBSWY3DPEHPK3PXP',
): Promise<{ secret: string }> {
  const client = await getTestClient();
  // Armazena como bytes diretos em teste (sem AES-GCM — só em produção)
  await client.query(
    `INSERT INTO mfa_secret (user_id, secret_encrypted, confirmed_at)
     VALUES ($1, $2, now())
     ON CONFLICT (user_id) DO UPDATE
     SET secret_encrypted = EXCLUDED.secret_encrypted, confirmed_at = now()`,
    [userId, Buffer.from(secretBase32, 'utf-8')],
  );
  await client.query(
    `UPDATE "user" SET mfa_enrolled_at = now() WHERE id = $1`,
    [userId],
  );
  return { secret: secretBase32 };
}

// ──────────────────────────────────────────────
// Cleanup helper
// ──────────────────────────────────────────────

/** Limpa todas as tabelas de teste em ordem (respeitando FK) */
export async function cleanDatabase(): Promise<void> {
  const client = await getTestClient();
  await client.query(`
    TRUNCATE TABLE
      module_activation,
      module_registry,
      audit_log,
      vector_index_registry,
      workspace_member,
      refresh_token,
      backup_code,
      mfa_secret,
      "user",
      workspace
    RESTART IDENTITY CASCADE
  `);
}
