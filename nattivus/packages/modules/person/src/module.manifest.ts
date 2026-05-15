import { createManifest } from '@nattivus/sdk';

export const manifest = createManifest({
  moduleId: 'nattivus.crm.person',
  name: 'Person',
  version: '0.1.0',
  sdkVersion: '>=0.0.1',

  entities: [
    {
      name: 'Person',
      tableName: 'person',
      standardObject: true,
      embeddingDimensions: 0,
      // Referência virtual a Company (T001 — sem FK física no banco)
      references: [{ moduleId: 'nattivus.crm.company', entityName: 'Company' }],
    },
  ],

  routes: [
    { method: 'GET',    path: '/api/people',        handler: 'PersonController.findAll',  description: 'Lista pessoas (opcionalmente filtradas por companyId)', permissions: ['nattivus.crm.person:read'] },
    { method: 'GET',    path: '/api/people/:id',    handler: 'PersonController.findOne',  description: 'Detalhe de pessoa',                                    permissions: ['nattivus.crm.person:read'] },
    { method: 'POST',   path: '/api/people',        handler: 'PersonController.create',   description: 'Cria pessoa',                                          permissions: ['nattivus.crm.person:write'] },
    { method: 'PATCH',  path: '/api/people/:id',    handler: 'PersonController.update',   description: 'Atualiza pessoa',                                      permissions: ['nattivus.crm.person:write'] },
    { method: 'DELETE', path: '/api/people/:id',    handler: 'PersonController.remove',   description: 'Remove pessoa (soft-delete)',                           permissions: ['nattivus.crm.person:write'] },
  ],

  graphqlOperations: [
    { kind: 'query',    operationName: 'people',       description: 'Lista people com filtros',   permissions: ['nattivus.crm.person:read'] },
    { kind: 'query',    operationName: 'person',       description: 'Detalhe de person por ID',   permissions: ['nattivus.crm.person:read'] },
    { kind: 'mutation', operationName: 'createPerson', description: 'Cria person',                permissions: ['nattivus.crm.person:write'] },
    { kind: 'mutation', operationName: 'updatePerson', description: 'Atualiza person',            permissions: ['nattivus.crm.person:write'] },
    { kind: 'mutation', operationName: 'deletePerson', description: 'Remove person (soft-delete)',permissions: ['nattivus.crm.person:write'] },
  ],

  permissions: [
    { flag: 'nattivus.crm.person:read',  description: 'Ler dados de pessoas' },
    { flag: 'nattivus.crm.person:write', description: 'Criar e editar pessoas' },
  ],

  // Depends on company module for cross-module reference validation (app-level only)
  dependencies: ['nattivus.crm.company'],

  async onActivate({ workspaceId }) {
    console.log(`[person] Activated for workspace: ${workspaceId}`);
  },

  async onDeactivate({ workspaceId }) {
    console.log(`[person] Deactivated for workspace: ${workspaceId}`);
  },
});
