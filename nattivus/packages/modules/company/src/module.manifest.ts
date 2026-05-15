import { createManifest } from '@nattivus/sdk';

export const manifest = createManifest({
  moduleId: 'nattivus.crm.company',
  name: 'Company',
  version: '0.1.0',
  sdkVersion: '>=0.0.1',

  entities: [
    {
      name: 'Company',
      tableName: 'company',
      standardObject: true,
      embeddingDimensions: 0,
    },
  ],

  routes: [
    { method: 'GET',    path: '/api/companies',     handler: 'CompanyController.findAll',  description: 'Lista empresas do workspace',   permissions: ['nattivus.crm.company:read'] },
    { method: 'GET',    path: '/api/companies/:id', handler: 'CompanyController.findOne',  description: 'Detalhe de empresa',            permissions: ['nattivus.crm.company:read'] },
    { method: 'POST',   path: '/api/companies',     handler: 'CompanyController.create',   description: 'Cria empresa',                  permissions: ['nattivus.crm.company:write'] },
    { method: 'PATCH',  path: '/api/companies/:id', handler: 'CompanyController.update',   description: 'Atualiza empresa',              permissions: ['nattivus.crm.company:write'] },
    { method: 'DELETE', path: '/api/companies/:id', handler: 'CompanyController.remove',   description: 'Remove empresa (soft-delete)',  permissions: ['nattivus.crm.company:write'] },
  ],

  graphqlOperations: [
    { kind: 'query',    operationName: 'companies',       description: 'Lista companies com filtros',    permissions: ['nattivus.crm.company:read'] },
    { kind: 'query',    operationName: 'company',         description: 'Detalhe de company por ID',      permissions: ['nattivus.crm.company:read'] },
    { kind: 'mutation', operationName: 'createCompany',   description: 'Cria company',                   permissions: ['nattivus.crm.company:write'] },
    { kind: 'mutation', operationName: 'updateCompany',   description: 'Atualiza company',               permissions: ['nattivus.crm.company:write'] },
    { kind: 'mutation', operationName: 'deleteCompany',   description: 'Remove company (soft-delete)',   permissions: ['nattivus.crm.company:write'] },
  ],

  permissions: [
    { flag: 'nattivus.crm.company:read',  description: 'Ler dados de empresas' },
    { flag: 'nattivus.crm.company:write', description: 'Criar e editar empresas' },
  ],

  dependencies: [],

  async onActivate({ workspaceId }) {
    console.log(`[company] Activated for workspace: ${workspaceId}`);
  },

  async onDeactivate({ workspaceId }) {
    console.log(`[company] Deactivated for workspace: ${workspaceId}`);
  },
});
