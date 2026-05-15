/**
 * T029 — Teste E2E de descoberta automática de módulo
 *
 * Cenário Gherkin (requirements.md §7.4):
 *   Dado um manifesto de módulo válido
 *   Quando registrado no module_registry
 *   Então pode ser ativado em um workspace sem alterar o shell
 *
 * Estes testes validam o contrato de dados do module_registry/module_activation.
 * O ModuleDiscoveryService real (T043) é testado nas suas unit specs.
 */

import {
  createTestUser,
  createTestWorkspace,
  addWorkspaceMember,
  getTestClient,
} from '../fixtures';
import { createManifest } from '@nattivus/sdk';

const HELLO_WORLD_MANIFEST = createManifest({
  moduleId: 'nattivus.hello-world',
  name: 'Hello World',
  version: '0.0.1',
  sdkVersion: '>=0.0.1',
  entities: [],
  routes: [{ method: 'GET', path: '/hello', description: 'Ping route' }],
  permissions: [],
});

describe('Module Discovery & Activation (data layer)', () => {
  let adminUser: { id: string };
  let ws: { id: string; slug: string };

  beforeEach(async () => {
    adminUser = await createTestUser();
    ws = await createTestWorkspace();
    await addWorkspaceMember(ws.id, adminUser.id, ['admin']);
  });

  it('registers a module manifest in module_registry', async () => {
    const client = await getTestClient();
    await client.query(
      `INSERT INTO module_registry (module_id, version, manifest)
       VALUES ($1, $2, $3)
       ON CONFLICT (module_id) DO UPDATE
         SET version = EXCLUDED.version, manifest = EXCLUDED.manifest`,
      [
        HELLO_WORLD_MANIFEST.moduleId,
        HELLO_WORLD_MANIFEST.version,
        JSON.stringify(HELLO_WORLD_MANIFEST),
      ],
    );

    const { rows } = await client.query(
      `SELECT module_id, version FROM module_registry WHERE module_id = $1`,
      [HELLO_WORLD_MANIFEST.moduleId],
    );
    expect(rows[0]).toMatchObject({
      module_id: 'nattivus.hello-world',
      version: '0.0.1',
    });
  });

  it('activates a registered module for a workspace', async () => {
    const client = await getTestClient();

    // Garante que o módulo está registrado
    await client.query(
      `INSERT INTO module_registry (module_id, version, manifest)
       VALUES ($1, $2, $3)
       ON CONFLICT (module_id) DO NOTHING`,
      ['nattivus.hello-world', '0.0.1', JSON.stringify(HELLO_WORLD_MANIFEST)],
    );

    // Ativa para o workspace
    await client.query(
      `INSERT INTO module_activation (workspace_id, module_id, activated_by_user_id)
       VALUES ($1, $2, $3)`,
      [ws.id, 'nattivus.hello-world', adminUser.id],
    );

    const { rows } = await client.query(
      `SELECT ma.module_id, mr.version
       FROM module_activation ma
       JOIN module_registry mr USING (module_id)
       WHERE ma.workspace_id = $1`,
      [ws.id],
    );
    expect(rows[0]).toMatchObject({ module_id: 'nattivus.hello-world', version: '0.0.1' });
  });

  it('prevents duplicate activation of the same module in a workspace', async () => {
    const client = await getTestClient();
    await client.query(
      `INSERT INTO module_registry (module_id, version, manifest)
       VALUES ('nattivus.hello-world', '0.0.1', '{}')
       ON CONFLICT (module_id) DO NOTHING`,
    );
    await client.query(
      `INSERT INTO module_activation (workspace_id, module_id, activated_by_user_id)
       VALUES ($1, 'nattivus.hello-world', $2)`,
      [ws.id, adminUser.id],
    );

    await expect(
      client.query(
        `INSERT INTO module_activation (workspace_id, module_id, activated_by_user_id)
         VALUES ($1, 'nattivus.hello-world', $2)`,
        [ws.id, adminUser.id],
      ),
    ).rejects.toThrow(); // UNIQUE violation
  });

  it('manifest satisfies IModule shape (compile-time + runtime check)', () => {
    // Se este teste compilar, o shape está correto
    expect(HELLO_WORLD_MANIFEST.moduleId).toBe('nattivus.hello-world');
    expect(HELLO_WORLD_MANIFEST.routes).toHaveLength(1);
    expect(HELLO_WORLD_MANIFEST.routes[0].method).toBe('GET');
  });
});
