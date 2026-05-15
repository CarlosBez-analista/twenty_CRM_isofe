import { createManifest } from '@nattivus/sdk';

export const manifest = createManifest({
  moduleId: 'nattivus.crm.opportunity',
  name: 'Opportunity',
  version: '0.1.0',
  sdkVersion: '>=0.0.1',

  entities: [
    {
      name: 'Opportunity',
      tableName: 'opportunity',
      standardObject: true,
      embeddingDimensions: 0,
      // Referências virtuais (T001)
      references: [
        { moduleId: 'nattivus.crm.company', entityName: 'Company' },
        { moduleId: 'nattivus.crm.person',  entityName: 'Person'  },
      ],
    },
  ],

  routes: [
    { method: 'GET',    path: '/api/opportunities',     handler: 'OpportunityController.findAll',  description: 'Lista oportunidades (filtrável por stage/companyId)', permissions: ['nattivus.crm.opportunity:read'] },
    { method: 'GET',    path: '/api/opportunities/:id', handler: 'OpportunityController.findOne',  description: 'Detalhe de oportunidade',                            permissions: ['nattivus.crm.opportunity:read'] },
    { method: 'POST',   path: '/api/opportunities',     handler: 'OpportunityController.create',   description: 'Cria oportunidade',                                  permissions: ['nattivus.crm.opportunity:write'] },
    { method: 'PATCH',  path: '/api/opportunities/:id', handler: 'OpportunityController.update',   description: 'Atualiza oportunidade (inclui mudança de stage)',     permissions: ['nattivus.crm.opportunity:write'] },
    { method: 'DELETE', path: '/api/opportunities/:id', handler: 'OpportunityController.remove',   description: 'Remove oportunidade (soft-delete)',                   permissions: ['nattivus.crm.opportunity:write'] },
  ],

  graphqlOperations: [
    { kind: 'query',    operationName: 'opportunities',      description: 'Lista oportunidades com filtros', permissions: ['nattivus.crm.opportunity:read'] },
    { kind: 'query',    operationName: 'opportunity',        description: 'Detalhe por ID',                  permissions: ['nattivus.crm.opportunity:read'] },
    { kind: 'mutation', operationName: 'createOpportunity',  description: 'Cria oportunidade',               permissions: ['nattivus.crm.opportunity:write'] },
    { kind: 'mutation', operationName: 'updateOpportunity',  description: 'Atualiza oportunidade',           permissions: ['nattivus.crm.opportunity:write'] },
    { kind: 'mutation', operationName: 'deleteOpportunity',  description: 'Remove (soft-delete)',            permissions: ['nattivus.crm.opportunity:write'] },
  ],

  permissions: [
    { flag: 'nattivus.crm.opportunity:read',  description: 'Ler dados de oportunidades' },
    { flag: 'nattivus.crm.opportunity:write', description: 'Criar e editar oportunidades' },
  ],

  dependencies: ['nattivus.crm.company', 'nattivus.crm.person'],

  async onActivate({ workspaceId }) {
    console.log(`[opportunity] Activated for workspace: ${workspaceId}`);
  },

  async onDeactivate({ workspaceId }) {
    console.log(`[opportunity] Deactivated for workspace: ${workspaceId}`);
  },
});
