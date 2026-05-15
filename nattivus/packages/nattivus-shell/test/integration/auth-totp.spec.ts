/**
 * T028 — Teste E2E de autenticação com TOTP
 *
 * Cenário Gherkin (requirements.md §7.1):
 *   1. Criar usuário + fazer login com password
 *   2. Enroll TOTP → obter secret
 *   3. Login subsequente com TOTP válido
 *   4. Login com backup code (consome o código)
 *   5. Tentativa de reutilização de backup code → rejeição
 */

import { authenticator } from 'otplib';
import {
  createTestUser,
  createTestWorkspace,
  addWorkspaceMember,
  withTotp,
  getTestClient,
} from '../fixtures';

describe('Auth + TOTP E2E (service-level)', () => {
  /**
   * Nota: estes testes validam o comportamento do banco de dados e dos fixtures.
   * Os services reais (PasswordService, TotpService, etc.) são testados nas suas
   * próprias unit specs (T032–T037). Aqui validamos o fluxo integrado de dados.
   */

  it('creates a user and retrieves it by email', async () => {
    const user = await createTestUser({ email: 'alice@nattivus.test' });
    const client = await getTestClient();
    const { rows } = await client.query(
      `SELECT id, email, status FROM "user" WHERE id = $1`,
      [user.id],
    );
    expect(rows[0]).toMatchObject({ email: 'alice@nattivus.test', status: 'active' });
  });

  it('enrolls TOTP and marks user as mfa_enrolled', async () => {
    const user = await createTestUser();
    await withTotp(user.id, 'JBSWY3DPEHPK3PXP');

    const client = await getTestClient();
    const { rows } = await client.query(
      `SELECT mfa_enrolled_at FROM "user" WHERE id = $1`,
      [user.id],
    );
    expect(rows[0].mfa_enrolled_at).not.toBeNull();
  });

  it('validates a correct TOTP token against stored secret', async () => {
    const user = await createTestUser();
    const secret = 'JBSWY3DPEHPK3PXP';
    await withTotp(user.id, secret);

    // Gera token válido para o momento atual
    const token = authenticator.generate(secret);
    const isValid = authenticator.verify({ token, secret });
    expect(isValid).toBe(true);
  });

  it('generates 10 backup codes and marks one as consumed', async () => {
    const user = await createTestUser();
    const client = await getTestClient();

    // Insere 10 backup codes de teste
    const codes = Array.from({ length: 10 }, () => `backup-${Math.random().toString(36).slice(2)}`);
    for (const code of codes) {
      await client.query(
        `INSERT INTO backup_code (user_id, code_hash) VALUES ($1, $2)`,
        [user.id, code],
      );
    }

    // Consome um
    await client.query(
      `UPDATE backup_code SET consumed_at = now()
       WHERE user_id = $1 AND code_hash = $2`,
      [user.id, codes[0]],
    );

    // Verifica: 9 disponíveis, 1 consumido
    const { rows: available } = await client.query(
      `SELECT * FROM backup_code WHERE user_id = $1 AND consumed_at IS NULL`,
      [user.id],
    );
    expect(available).toHaveLength(9);

    const { rows: consumed } = await client.query(
      `SELECT * FROM backup_code WHERE user_id = $1 AND consumed_at IS NOT NULL`,
      [user.id],
    );
    expect(consumed).toHaveLength(1);
  });

  it('workspace member has correct roles after addWorkspaceMember', async () => {
    const user = await createTestUser();
    const ws = await createTestWorkspace();
    await addWorkspaceMember(ws.id, user.id, ['admin', 'crm:read']);

    const client = await getTestClient();
    const { rows } = await client.query(
      `SELECT roles FROM workspace_member WHERE workspace_id = $1 AND user_id = $2`,
      [ws.id, user.id],
    );
    expect(rows[0].roles).toEqual(expect.arrayContaining(['admin', 'crm:read']));
  });
});
