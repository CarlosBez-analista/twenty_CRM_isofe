# Roadmap: Fundação Modular NattivusECO

> Identificador: `001-fundacao-modular`
> Data: `2026-05-14`
> Requirements: `_reversa_forward/001-fundacao-modular/requirements.md`
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA

## 1. Resumo da abordagem

A fundação NattivusECO é construída como um **monorepo novo** (Nx) com um shell central (`nattivus-shell`) que faz descoberta automática de módulos, autenticação com 2FA TOTP, multi-tenancy via row-level security no Postgres, e expõe APIs uniformes (auth, módulos, busca semântica). O delta sobre o `_reversa_sdd/` é total no nível de código (produto novo, não fork), mas conceitualmente herda padrões confirmados: `BaseWorkspaceEntity` vira `BaseEntity`, `WorkspaceObject` decorator vira `IModule.entities[].standardObject`, pipeline de 3 guards (`WorkspaceAuthGuard` → `PermissionGuard` → `DomainGuard`) é replicado, e `PermissionFlagType` torna-se contrato no `@nattivus/sdk`. O ganho frente ao Twenty: SDK público versionado, embeddings nativos (pgvector + Qdrant), 2FA obrigatório desde o dia zero. A fase é tratada como **spike técnico-funcional**: o sucesso é demonstrar que um módulo `hello-world` carrega via manifesto sem editar o shell.

## 2. Princípios aplicados

`.reversa/principles.md` ainda não existe neste projeto. Princípios derivados do `_reversa_sdd/` e dos requirements são aplicados implicitamente:

| Princípio | Como a feature se relaciona | Status |
|-----------|------------------------------|--------|
| Isolamento multi-tenant inviolável | RN-04 do requirements + row-level security no Postgres | respeita |
| Núcleo não conhece domínio | RN-02 (shell desconhece módulos; comunicação via contrato) | respeita |
| Não modificar legado | Esta feature constrói produto novo num diretório próprio; não toca `_reversa_sdd/` nem código do Twenty | respeita |
| Confidência sobre fontes | Decisões marcadas 🟢/🟡 conforme `_reversa_sdd/` | respeita |

> Recomenda-se rodar `/reversa-principles` para formalizar esses princípios em `.reversa/principles.md` antes do `/reversa-coding`.

## 3. Decisões técnicas

| ID | Decisão | Justificativa | Alternativas descartadas | Confidência |
|----|---------|---------------|---------------------------|-------------|
| D-01 | Monorepo Nx com Yarn 4 workspaces | Aproveita conhecimento já consolidado no `_reversa_sdd/inventory.md` (Twenty usa Nx); ferramental maduro para grafo de dependências | Turborepo, pnpm workspaces puros, polyrepo | 🟢 |
| D-02 | Backend NestJS + GraphQL Yoga + REST mínimo | Stack confirmada na sessão clarify (opção A); permite reaproveitar padrões de decorator (entity, field, relation) inspirados em `_reversa_sdd/architecture.md#padroes` | Fastify puro, Hono, Bun+Elysia | 🟢 |
| D-03 | Frontend React + Vite + Jotai + Apollo Client | Mesma stack do legado (`_reversa_sdd/architecture.md`); minimiza re-aprendizado | Remix, SolidJS, Svelte | 🟢 |
| D-04 | Postgres 16+ com `pgvector` para embeddings ligados a entidades | Stack confirmada; pgvector colado à transação evita coordenação de dois stores para vetor curto | Pinecone, Weaviate, somente Qdrant | 🟢 |
| D-05 | Qdrant standalone para coleções vetoriais grandes (documentos, conhecimento) | Stack confirmada; performance superior em recall@k para coleções >10⁵ vetores | Apenas pgvector, Milvus, Vespa | 🟢 |
| D-06 | Isolamento multi-tenant em **duas camadas**: row-level security (RLS) no Postgres + middleware ORM que injeta `workspaceId` automaticamente | Defesa em profundidade; herda padrão implícito do Twenty (`_reversa_sdd/domain.md#regras-implicitas`) com camada extra | Apenas filtro de ORM, schema-per-tenant | 🟢 |
| D-07 | TOTP via `otplib` (RFC 6238) + backup codes hash-bcrypt + tabela `mfa_secret` por usuário | Padrão de mercado; sem dependência de serviço externo (autoridade fica no shell) | Authy, Auth0, custom HMAC | 🟢 |
| D-08 | JWT assinado com chave rotacionável (kid em header) + refresh token opaco em tabela com hash | Permite rotação de chave sem invalidar sessões ativas; refresh opaco permite revogação | JWT-only sem refresh, sessão server-side | 🟢 |
| D-09 | Manifesto de módulo declarado em TS (`module.manifest.ts`) exportando objeto que satisfaz `IModule` | Type safety em compile-time; lint pode validar shape | JSON, YAML, anotação por decorator | 🟢 |
| D-10 | Descoberta de módulos via glob em `packages/modules/*/dist/module.manifest.js` no startup | Determinístico, sem reflexão runtime; falha cedo | Class-path scanning, plugin registry runtime | 🟢 |
| D-11 | `BaseEntity` em `nattivus-shared` com `id` UUID, `workspaceId`, `createdAt`, `updatedAt`, `deletedAt`, `searchVector`, `position` | Replica `BaseWorkspaceEntity` do Twenty (`_reversa_sdd/architecture.md`); contrato único para módulos | Herança via mixin, decorator-only | 🟢 |
| D-12 | Migrações por módulo isoladas usando TypeORM com flag `module` no metadata | Permite ativar/desativar módulo sem migrar tabelas órfãs | Migrações globais, ferramentas externas (Atlas) | 🟡 |
| D-13 | API de busca semântica unificada (`semanticSearch({collection, query, topK})`) abstrai pgvector vs Qdrant via estratégia configurável por coleção | RN-10 do requirements; módulos não acoplam ao backend | API por backend, query DSL explícita | 🟢 |
| D-14 | Pipeline de guards via interceptors NestJS (`@RequireAuth()`, `@RequirePermission()`, `@RequireDomain()`) | Replica padrão de 3 camadas confirmado em `_reversa_sdd/domain.md#regra-12` | Policies em código, RBAC libs externas | 🟢 |
| D-15 | `@nattivus/sdk` publicado em registry público (npm) sob escopo da organização Nattivus | Modelo de licenciamento "privado com SDK público" da sessão clarify | GitHub Packages, registry privado | 🟢 |
| D-16 | Identidade visual default NattivusECO em `nattivus-ui`; overrides via tokens CSS variables + Linaria | Componentização CSS-in-JS já validada em `_reversa_sdd/architecture.md`; troca runtime sem rebuild | styled-components, Tailwind puro, CSS Modules | 🟡 |

## 4. Premissas

Nenhuma `[DÚVIDA]` pendente no `requirements.md` — todas as decisões foram cristalizadas na sessão clarify de 2026-05-14. Premissas implícitas listadas abaixo para rastreabilidade:

| Premissa | Origem (`requirements.md` seção) | Risco se errada |
|----------|----------------------------------|-----------------|
| O parceiro fiscal (D1 do handoff legado) não impacta a fundação — fica para feature ERP-Empresarial | seção 2, contexto a partir do legado | baixo |
| Postgres 16+ disponível com permissão para criar extensão `pgvector` | D-04 | médio (downgrade para extensão externa ou container customizado se cliente não permitir) |

## 5. Delta arquitetural

| Componente | Arquivo de origem no legado | Tipo de mudança | Resumo |
|------------|------------------------------|-----------------|--------|
| `nattivus-shell` (backend NestJS) | `_reversa_sdd/architecture.md#padroes-arquiteturais` (referência) | componente-novo | API gateway, auth, multi-tenancy, descoberta de módulos, busca semântica unificada |
| `nattivus-shared` (tipos/helpers) | `_reversa_sdd/architecture.md#padroes-arquiteturais` (referência) | componente-novo | `IModule`, `BaseEntity`, `PermissionFlag`, contratos de manifesto |
| `nattivus-ui` (design system) | `_reversa_sdd/design-system/design-system.md` (referência) | componente-novo | Tokens NattivusECO default; reaproveita 17 tokens delta ERP já extraídos |
| `nattivus-sdk` (SDK público) | inexistente no legado | componente-novo | Pacote npm público com contratos `IModule`, helpers, cliente do shell para extensões externas |
| `packages/modules/` (diretório) | `_reversa_sdd/inventory.md#estrutura-de-pastas` (referência conceitual) | componente-novo | Convenção: cada subdiretório é um módulo carregável; sem módulos funcionais nesta feature, apenas `hello-world` para validar shell |
| Pipeline de guards | `_reversa_sdd/domain.md#regra-12` (3-camadas) | contrato-novo | Decorators `@RequireAuth`, `@RequirePermission`, `@RequireDomain` em `@nattivus/sdk` |
| Modelo de permissões | `_reversa_sdd/permissions.md` (PermissionFlagType com 30 flags confirmadas) | contrato-novo | Estrutura `PermissionFlag` em `@nattivus/sdk`; módulos declaram suas flags no manifesto e o shell agrega |
| Busca semântica | inexistente no legado | contrato-novo | API uniforme em `nattivus-shell` com backend pgvector ou Qdrant por coleção |
| Soft-delete / TSVECTOR / ownership universal | `_reversa_sdd/domain.md#regras-implicitas` (RN-2,4,5) | contrato-novo | Embutidos em `BaseEntity` de `nattivus-shared` |

## 6. Delta no modelo de dados

- Resumo das mudanças: criação do schema base do shell (`workspace`, `workspace_member`, `user`, `mfa_secret`, `backup_code`, `refresh_token`, `module_activation`, `audit_log`, `vector_index_registry`). Sem migração de dados — produto novo.
- Detalhe completo em: `_reversa_forward/001-fundacao-modular/data-delta.md`

## 7. Delta de contratos externos

| Contrato | Tipo | Arquivo de detalhe |
|----------|------|--------------------|
| Auth API (login, TOTP, refresh, enrollment, backup codes) | HTTP/REST | `_reversa_forward/001-fundacao-modular/interfaces/auth-api.md` |
| SDK público (`@nattivus/sdk`) | npm package (TS types + runtime helpers) | `_reversa_forward/001-fundacao-modular/interfaces/sdk-contract.md` |
| Module Discovery + Activation | HTTP/GraphQL interno | `_reversa_forward/001-fundacao-modular/interfaces/module-system.md` |

## 8. Plano de migração

n/a — produto novo, sem dados legados a migrar. Operação inicial sobe schema vazio via `db:init` e roda migrações do shell. Sem rollback necessário no v1.

## 9. Riscos e mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| RLS no Postgres mal configurado vaza dados cross-tenant | alto | médio | Teste de regressão obrigatório em CI; tooling que injeta `workspaceId` no ORM como segunda camada |
| `pgvector` indisponível em provedor cloud do cliente | médio | médio | Documentar fallback para Qdrant-only; container Postgres custom no self-hosted |
| Descoberta automática de módulos quebra silenciosamente em produção | alto | baixo | Manifesto validado em build (não só runtime); falha cedo com log estruturado |
| 2FA TOTP obrigatório atrita primeiro uso | médio | alto | UX clara no enrollment (QR + backup codes em uma tela), opção de SMS fallback no roadmap futuro |
| SDK público acopla evolução do shell (breaking changes custam caro) | alto | médio | SemVer estrito, suíte de testes de contrato, política de deprecação ≥ 1 minor antes de remover |
| Embeddings (pgvector/Qdrant) viram dead code se nenhum módulo do v1 usar | baixo | alto | Aceito: plumbing-only no v1, ativado por módulo de busca em feature futura |
| Branding fixo "NattivusECO" complica white-label futuro | baixo | médio | RF-10 já prevê override por workspace; reservar pontos de extensão na UI desde o início |

## 10. Critério de pronto

- [ ] Todas as ações do `actions.md` marcadas `[X]`
- [ ] Módulo `hello-world` carregável via manifesto sem editar shell — cenário Gherkin do requirements passando
- [ ] Teste E2E de isolamento multi-tenant passando (workspace A não vê dados de B nem via SQL direto via API)
- [ ] Login com 2FA TOTP fluindo end-to-end (enrollment + login + backup code)
- [ ] `@nattivus/sdk` versionado e instalável via `npm install`
- [ ] `cross-check.md` (se executado) sem CRITICAL nem HIGH
- [ ] `regression-watch.md` gerado
- [ ] Re-extração reversa executada e sem regressão vermelha (recomendado, não obrigatório)

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-05-14 | Versão inicial gerada por `/reversa-plan` | reversa |
