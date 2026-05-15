/**
 * T027 — Teste de isolamento multi-tenant
 *
 * Cenário Gherkin (requirements.md §7.3):
 *   Dado workspace A e workspace B com dados distintos
 *   Quando workspace A acessa dados com contexto RLS ativo
 *   Então workspace A NÃO vê dados de workspace B
 *
 * Verifica que o SET LOCAL + RLS impede vazamento de dados entre tenants.
 */

import { Client } from 'pg';
import {
  createTestUser,
  createTestWorkspace,
  addWorkspaceMember,
  withWorkspaceContext,
  getTestClient,
} from '../fixtures';

describe('Tenant Isolation (RLS)', () => {
  let clientA: { id: string; email: string };
  let clientB: { id: string; email: string };
  let wsA: { id: string; slug: string };
  let wsB: { id: string; slug: string };

  beforeEach(async () => {
    clientA = await createTestUser();
    clientB = await createTestUser();
    wsA = await createTestWorkspace();
    wsB = await createTestWorkspace();
    await addWorkspaceMember(wsA.id, clientA.id, ['admin']);
    await addWorkspaceMember(wsB.id, clientB.id, ['admin']);
  });

  it('user A only sees their own workspace_member rows', async () => {
    await withWorkspaceContext(wsA.id, clientA.id, async (client: Client) => {
      const { rows } = await client.query('SELECT * FROM workspace_member');
      // RLS: user A vê apenas suas próprias linhas
      expect(rows.every((r: any) => r.user_id === clientA.id)).toBe(true);
    });
  });

  it('user B only sees their own workspace_member rows', async () => {
    await withWorkspaceContext(wsB.id, clientB.id, async (client: Client) => {
      const { rows } = await client.query('SELECT * FROM workspace_member');
      expect(rows.every((r: any) => r.user_id === clientB.id)).toBe(true);
    });
  });

  it('module_activation of workspace A is invisible to workspace B context', async () => {
    // Ativa um módulo em workspace A
    const adminClient: Client = await getTestClient();
    await adminClient.query(
      `INSERT INTO module_registry (module_id, version, manifest)
       VALUES ('nattivus.hello-world', '0.0.1', '{}')
       ON CONFLICT (module_id) DO NOTHING`,
    );
    await adminClient.query(
      `INSERT INTO module_activation (workspace_id, module_id, activated_by_user_id)
       VALUES ($1, 'nattivus.hello-world', $2)`,
      [wsA.id, clientA.id],
    );

    // Workspace B NÃO deve ver a ativação de A
    await withWorkspaceContext(wsB.id, clientB.id, async (client: Client) => {
      const { rows } = await client.query('SELECT * FROM module_activation');
      expect(rows.find((r: any) => r.workspace_id === wsA.id)).toBeUndefined();
    });
  });

  it('user in no workspace context sees empty workspace_member', async () => {
    const client: Client = await getTestClient();
    // Sem SET LOCAL — current_setting retorna '' → RLS bloqueia tudo
    await client.query('BEGIN');
    await client.query(`SET LOCAL app.workspace_id = ''`);
    await client.query(`SET LOCAL app.user_id = ''`);
    const { rows } = await client.query('SELECT * FROM workspace_member');
    await client.query('ROLLBACK');
    expect(rows).toHaveLength(0);
  });
});
