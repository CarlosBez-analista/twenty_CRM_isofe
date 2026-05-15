# Regression Watch — 002-modulos-crm

> **Feature:** 002-modulos-crm
> **Gerado em:** 2026-05-15
> **Baseado em:** `legacy-impact.md` seção "Regras Modificadas" + lacunas abertas

Nenhuma regra do `_reversa_sdd/domain.md` foi modificada ou removida nesta feature.
Os watch items abaixo monitoram **invariantes novas** introduzidas pelo 002 que devem se manter verdadeiras nas próximas iterações.

---

## Watch Items

| ID | Origem (arquivo, seção) | Regra esperada após mudança | Tipo de verificação | Sinal de violação |
|---|---|---|---|---|
| W001 | `nattivus-shell/src/app.module.ts` + `data-source.ts` | O DataSource do shell DEVE incluir as entidades Company, Person e Opportunity para que migrações e TypeORM funcionem | `presença` | Erro `EntityMetadataNotFoundError` no startup ou migration falhando com "relation does not exist" |
| W002 | `nattivus-sdk/src/manifest.ts` — `isValidManifest()` em `module-discovery.service.ts` | Manifestos antigos (hello-world) continuam sendo carregados com sucesso após a extensão do SDK (novos campos são opcionais) | `presença` | hello-world retornando `invalid_manifest` na discovery |
| W003 | `modules/company/migrations/001-create-company.sql` | RLS policy `tenant_isolation` presente na tabela `company` — workspace A não pode ver dados de workspace B | `presença` | Query sem `SET app.workspace_id` retornando dados de outro workspace |
| W004 | `modules/person/migrations/001-create-person.sql` | RLS policy `tenant_isolation` presente na tabela `person` | `presença` | Idem W003 para person |
| W005 | `modules/opportunity/migrations/001-create-opportunity.sql` | RLS policy `tenant_isolation` presente na tabela `opportunity` + constraint CHECK nos stages | `presença` | INSERT com stage inválido não rejeitado pelo banco |
| W006 | `modules/person/src/person.entity.ts` — `parseName()` | `parseName('Maria Clara Souza')` → `{ firstName: 'Maria Clara', lastName: 'Souza' }` | `presença` | Parsing invertendo ou truncando nomes compostos |
| W007 | `modules/company/src/company.entity.ts` — `extractDomainFromUrl()` | URL `'https://www.acme.com/path'` → `'acme.com'` (sem www, sem path) | `presença` | Domain com `www.` ou path residual sendo armazenado |
| W008 | `modules/opportunity/src/opportunity.entity.ts` — `OPPORTUNITY_STAGES` | Toda string válida de stage está em `OPPORTUNITY_STAGES`; nenhum stage novo foi adicionado sem atualizar o CHECK constraint SQL | `presença` | Stage válido em TypeScript sendo rejeitado pelo banco (ou vice-versa) |
| W009 | `nattivus-ui/src/tokens/index.ts` — `crm.stage.*` | Paleta de stage tem exatamente 8 entradas correspondendo 1-para-1 com `OPPORTUNITY_STAGES` | `presença` | Stage sem cor ou cor sem stage correspondente |

---

## Histórico de Re-extrações

*(Vazio — será preenchido quando `/reversa` for executado novamente sobre o codebase NattivusECO)*

---

## Arquivadas

*(Vazio — watch items arquivados quando a regra deixar de ser relevante)*

---

## Observações (regras 🟡/🔴 — sem peso de regressão)

- **LAC-001** — DataSource dinâmico não implementado: os módulos CRM não estão no DataSource principal do shell. Isso é dívida técnica conhecida, não regressão.
- **LAC-002** — Resolvers GraphQL declarados nos manifestos mas não implementados como código. REST é a superfície funcional desta feature.
