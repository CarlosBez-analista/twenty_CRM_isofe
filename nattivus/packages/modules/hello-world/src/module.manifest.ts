import { createManifest } from '@nattivus/sdk';

/**
 * manifest — Manifesto do módulo hello-world.
 *
 * Módulo de demonstração e template para criação de novos módulos.
 * Demonstra o ciclo completo: entidade, rota, permissão, lifecycle hooks.
 *
 * Ref: T059, interfaces/sdk-contract.md §4
 */

export const manifest = createManifest({
  moduleId: 'nattivus.hello-world',
  version: '0.1.0',
  sdkVersion: '>=0.0.1',
  displayName: 'Hello World',
  description: 'Template de módulo NattivusECO — demonstra entidade, rota e permissão',

  entities: [
    {
      name: 'HelloMessage',
      tableName: 'hello_message',
      // Migração aplicada via onActivate
    },
  ],

  routes: [
    {
      method: 'GET',
      path: '/api/hello',
      handler: 'HelloController.list',
      description: 'Lista mensagens do workspace',
    },
    {
      method: 'POST',
      path: '/api/hello',
      handler: 'HelloController.create',
      description: 'Cria nova mensagem',
    },
  ],

  permissions: [
    {
      flag: 'nattivus.hello-world:read',
      description: 'Ler mensagens do módulo hello-world',
    },
    {
      flag: 'nattivus.hello-world:write',
      description: 'Criar e editar mensagens do módulo hello-world',
    },
  ],

  dependencies: [], // Sem dependências de outros módulos

  async onActivate({ workspaceId }) {
    console.log(`[hello-world] Activated for workspace: ${workspaceId}`);
    // Migrações executadas pelo ModuleActivationService via runner SQL
  },

  async onDeactivate({ workspaceId }) {
    console.log(`[hello-world] Deactivated for workspace: ${workspaceId}`);
  },
});
