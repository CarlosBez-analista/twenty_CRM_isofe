# Legacy Impact — 002-modulos-crm

> **Data:** 2026-05-15
> **Feature:** 002-modulos-crm
> **Executor:** reversa-coding

---

## Tabela de Impactos

| Arquivo afetado | Componente legado (\_reversa\_sdd) | Tipo | Severidade | Justificativa |
|---|---|---|---|---|
| `nattivus/packages/nattivus-sdk/src/manifest.ts` | SDK Contract (`interfaces/sdk-contract.md`) | `regra-nova` | LOW | Adicionados `ModuleRef`, `GraphQLOperationSpec`, `references` em EntitySpec e `graphqlOperations` em IModule. Extensão backward-compatible — manifestos antigos (hello-world) continuam válidos. |
| `nattivus/packages/nattivus-sdk/src/index.ts` | SDK exports | `regra-nova` | LOW | Novos tipos exportados: `GraphQLOperationSpec`, `ModuleRef`. |
| `nattivus/packages/nattivus-shell/src/app.module.ts` | Shell bootstrap | `regra-nova` | MEDIUM | AppModule agora importa CompanyModule, PersonModule, OpportunityModule. Antes estava vazio. Qualquer falha de inicialização desses módulos derruba o shell inteiro. |
| `nattivus/packages/nattivus-ui/src/tokens/index.ts` | Design System (`_reversa_sdd/design-system/tokens.md`) | `regra-nova` | LOW | Adicionados tokens `crm.stage.*` e `crm.icp.*`. Correção de tipo em `generateCssVariables`. Nova função `generateRootBlock`. |
| `nattivus/packages/nattivus-ui/src/index.ts` | Design System exports | `regra-nova` | LOW | Exportado `generateRootBlock`. |
| `.github/workflows/nattivus-ci.yml` | — (novo arquivo, fora do escopo do legado) | `componente-novo` | LOW | CI isolado para `nattivus/**`. Não interfere com workflows do Twenty (inexistentes no repo atual). |

### Novos componentes (sem correspondente no legado)

| Arquivo | Tipo | Descrição |
|---|---|---|
| `nattivus/packages/modules/company/` | `componente-novo` | Módulo CRM Company — entity, service, controller, manifest, migration |
| `nattivus/packages/modules/person/` | `componente-novo` | Módulo CRM Person — entity, service, controller, manifest, migration |
| `nattivus/packages/modules/opportunity/` | `componente-novo` | Módulo CRM Opportunity — entity, service, controller, manifest, migration |

---

## Diff Conceitual por Componente

### SDK (`manifest.ts`)
O SDK ganhou suporte a referências virtuais entre módulos (`ModuleRef`) e a declaração de operações GraphQL (`GraphQLOperationSpec`). O `isValidManifest()` do `ModuleDiscoveryService` continua passando para manifestos antigos porque os novos campos são opcionais (`graphqlOperations?`, `references?`).

### Shell AppModule
O AppModule deixou de ser um stub vazio e passou a importar os três módulos CRM. Cada módulo traz seus próprios `TypeOrmModule.forFeature([Entity])`, portanto as entidades só são visíveis ao TypeORM quando o módulo está carregado. O `DataSource` principal do shell precisa incluir as entidades desses módulos para que as migrações funcionem corretamente — isso é a próxima lacuna técnica (ver regression-watch W001).

### Design System (tokens)
Os tokens CRM adicionados refletem os valores extraídos em `_reversa_sdd/design-system/tokens.md` (delta ERP: 17 tokens identificados). A paleta de pipeline stages (`crm.stage.*`) espelha diretamente o `OpportunityStage` type do módulo opportunity.

---

## Regras Preservadas (do `_reversa_sdd/domain.md`)

- **RN-2** — soft-delete (`deleted_at`) aplicado em todas as entidades ✅
- **RN-3** — valores monetários em micros (`bigint`) para evitar ponto flutuante ✅
- **RN-4** — `workspace_id` presente e indexado em todas as tabelas transacionais ✅
- **RN-5** — `search_vector` + trigger `tg_update_search_vector` em company, person e opportunity ✅
- Isolamento por workspace (RLS `tenant_isolation`) em todas as 3 novas tabelas ✅
- `position` (numeric) para ordenação drag-and-drop herdado via `BaseEntity` ✅
- String literals sobre enums (`OpportunityStage`, `PermissionFlag`) ✅

## Regras Modificadas

Nenhuma regra existente foi alterada ou removida nesta feature. Todas as mudanças são adições.

---

## Lacunas Abertas (não eram regras, mas valem observação)

- **LAC-001** — `DataSource` do shell (`data-source.ts`) não inclui as entidades Company, Person e Opportunity. O carregamento dinâmico estava planejado para o ciclo forward (ver `T021` da fundação: "carregamento dinâmico de entidades de módulos"). Até isso ser implementado, as migrations precisam ser rodadas manualmente ou via CLI dedicada.
- **LAC-002** — Os resolvers GraphQL (T002) foram declarados nos manifestos mas não implementados. Rotas REST estão funcionais. Resolvers GraphQL ficam como próxima fase.
