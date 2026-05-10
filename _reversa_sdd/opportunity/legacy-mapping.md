# Mapeamento do Legado: Opportunity

Lista de arquivos que compõem o módulo `opportunity` no sistema legado.

| Caminho | Responsabilidade |
|---------|------------------|
| `packages/twenty-server/src/modules/opportunity/standard-objects/opportunity.workspace-entity.ts` | Definição da entidade ORM e campos de busca. |
| `packages/twenty-server/src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-opportunity-views.util.ts` | Definição das visualizações (All, Kanban). |
| `packages/twenty-server/src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-opportunity-standard-flat-field-metadata.util.ts` | Metadados dos campos (tipos, labels, estágios). |
| `packages/twenty-server/src/engine/workspace-manager/twenty-standard-application/utils/view-group/compute-standard-opportunity-view-groups.util.ts` | Configuração dos grupos do Kanban. |
| `packages/twenty-server/src/engine/workspace-manager/dev-seeder/data/constants/opportunity-data-seeds.constant.ts` | Sementes de dados para desenvolvimento. |
| `packages/twenty-front/src/modules/page-layout/constants/DefaultOpportunityRecordPageLayout.ts` | Layout padrão da página de registro no frontend. |
