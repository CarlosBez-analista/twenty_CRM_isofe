# Actions: Fundação Modular NattivusECO

> Identificador: `001-fundacao-modular`
> Data: `2026-05-14`
> Roadmap: `_reversa_forward/001-fundacao-modular/roadmap.md`

## Resumo

| Métrica | Valor |
|---------|-------|
| Total de ações | 68 |
| Paralelizáveis (`[//]`) | 19 |
| Maior cadeia de dependência | 11 (T001 → T005 → T013 → T014 → T019 → T021 → T036 → T037 → T052 → T058 → T063) |

## Fase 1, Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T001 | Bootstrap do monorepo Nx + Yarn 4 (raiz: `package.json`, `nx.json`, `tsconfig.base.json`, `.yarnrc.yml`) | - | `[//]` | `package.json` | 🟢 | `[ ]` |
| T002 | Criar `docker/compose.dev.yml` com serviços Postgres (imagem `pgvector/pgvector:pg16`), Redis 7 e Qdrant 1.x | - | `[//]` | `docker/compose.dev.yml` | 🟢 | `[ ]` |
| T003 | Criar `.env.example`, `.gitignore`, `.editorconfig`, `.prettierrc` na raiz | - | `[//]` | `.env.example` | 🟢 | `[ ]` |
| T004 | Criar pacote `nattivus-shared` como Nx library TS pura (estrutura, `project.json`, `tsconfig`) | T001 | `[//]` | `packages/nattivus-shared/project.json` | 🟢 | `[ ]` |
| T005 | Criar pacote `nattivus-shell` como Nx app NestJS (estrutura, `project.json`, `main.ts` stub, `app.module.ts`) | T001 | `[//]` | `packages/nattivus-shell/project.json` | 🟢 | `[ ]` |
| T006 | Criar pacote `nattivus-sdk` como Nx library publicável (estrutura, `project.json`, scripts de build dual ESM/CJS) | T001 | `[//]` | `packages/nattivus-sdk/project.json` | 🟢 | `[ ]` |
| T007 | Criar pacote `nattivus-ui` como Nx library de componentes React + Linaria (estrutura) | T001 | `[//]` | `packages/nattivus-ui/project.json` | 🟡 | `[ ]` |
| T008 | Criar `packages/modules/hello-world` como Nx library com `module.manifest.ts` mínimo | T001 | `[//]` | `packages/modules/hello-world/project.json` | 🟢 | `[ ]` |
| T009 | Implementar `BaseEntity` em `nattivus-shared/src/base-entity.ts` com colunas-base e decorators TypeORM | T004 | - | `packages/nattivus-shared/src/base-entity.ts` | 🟢 | `[ ]` |
| T010 | Implementar `IModule`, `IModuleManifest`, `EntitySpec`, `RouteSpec`, helpers `createManifest`/`defineEntity` no SDK | T006, T009 | - | `packages/nattivus-sdk/src/manifest.ts` | 🟢 | `[ ]` |
| T011 | Implementar `PermissionFlag` type, helper `definePermission` e decorators `@RequireAuth`/`@RequirePermission`/`@RequireDomain` no SDK | T006 | - | `packages/nattivus-sdk/src/permissions.ts` | 🟢 | `[ ]` |
| T012 | Implementar interface `ShellClient` no SDK (stubs para `semanticSearch`, `audit`, `getCurrentWorkspace`, `getCurrentUser`) | T006 | - | `packages/nattivus-sdk/src/shell-client.ts` | 🟢 | `[ ]` |
| T013 | Criar `migrations/001-create-extensions.sql` (`uuid-ossp`, `pgcrypto`, `citext`, `vector`) | T005 | - | `packages/nattivus-shell/migrations/001-create-extensions.sql` | 🟢 | `[ ]` |
| T014 | Criar `migrations/002-create-auth-tables.sql` (`user`, `mfa_secret`, `backup_code`, `refresh_token` conforme `data-delta.md` §2.1–2.4) | T013 | - | `packages/nattivus-shell/migrations/002-create-auth-tables.sql` | 🟢 | `[ ]` |
| T015 | Criar `migrations/003-create-workspace-tables.sql` (`workspace`, `workspace_member` conforme `data-delta.md` §2.5–2.6) | T013 | - | `packages/nattivus-shell/migrations/003-create-workspace-tables.sql` | 🟢 | `[ ]` |
| T016 | Criar `migrations/004-create-module-registry.sql` (`module_registry`, `module_activation` conforme `data-delta.md` §2.7–2.8) | T015 | - | `packages/nattivus-shell/migrations/004-create-module-registry.sql` | 🟢 | `[ ]` |
| T017 | Criar `migrations/005-create-audit-log.sql` (`audit_log` conforme `data-delta.md` §2.9) | T013 | - | `packages/nattivus-shell/migrations/005-create-audit-log.sql` | 🟢 | `[ ]` |
| T018 | Criar `migrations/006-create-vector-index-registry.sql` (`vector_index_registry` §2.10) | T013 | - | `packages/nattivus-shell/migrations/006-create-vector-index-registry.sql` | 🟢 | `[ ]` |
| T019 | Criar `migrations/007-enable-rls.sql` com policies `tenant_isolation` em todas tabelas com `workspace_id` e policy especial em `workspace_member` | T014, T015, T016 | - | `packages/nattivus-shell/migrations/007-enable-rls.sql` | 🟢 | `[ ]` |
| T020 | Criar functions `tg_set_updated_at`, `tg_update_search_vector`, `tg_audit_row` e wiring de triggers nas tabelas relevantes | T019 | - | `packages/nattivus-shell/migrations/008-triggers.sql` | 🟢 | `[ ]` |
| T021 | Configurar TypeORM `DataSource` em `nattivus-shell` com entidades correspondentes às 10 tabelas + carregamento dinâmico de entidades de módulos | T009, T020 | - | `packages/nattivus-shell/src/database/data-source.ts` | 🟢 | `[ ]` |
| T022 | Implementar comandos CLI `db:init`, `db:migrate`, `db:reset` (yarn scripts + runner Node) | T021 | - | `packages/nattivus-shell/src/cli/db.ts` | 🟢 | `[ ]` |

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T023 | Setup Jest config para `nattivus-shell` (`jest.config.ts`, testes de integração com Postgres efêmero via testcontainers ou banco dedicado) | T005 | `[//]` | `packages/nattivus-shell/jest.config.ts` | 🟢 | `[ ]` |
| T024 | Setup Jest config para `nattivus-shared` | T004 | `[//]` | `packages/nattivus-shared/jest.config.ts` | 🟢 | `[ ]` |
| T025 | Setup Jest config para `nattivus-sdk` | T006 | `[//]` | `packages/nattivus-sdk/jest.config.ts` | 🟢 | `[ ]` |
| T026 | Criar fixtures e helpers de teste (`createTestWorkspace`, `createTestUser`, `withTotp`, `withWorkspaceContext`) | T021, T022 | - | `packages/nattivus-shell/test/fixtures.ts` | 🟢 | `[ ]` |
| T027 | Teste E2E de isolamento multi-tenant: workspace A não acessa dados de B via ORM, GraphQL nem REST (cenário Gherkin §7 do requirements) | T026 | - | `packages/nattivus-shell/test/integration/tenant-isolation.spec.ts` | 🟢 | `[ ]` |
| T028 | Teste E2E de login + enrollment TOTP + login subsequente + backup code (cenário Gherkin §7) | T026 | - | `packages/nattivus-shell/test/integration/auth-totp.spec.ts` | 🟢 | `[ ]` |
| T029 | Teste E2E de descoberta automática de módulo: adicionar manifesto novo → rota aparece sem editar shell (cenário Gherkin §7) | T026 | - | `packages/nattivus-shell/test/integration/module-discovery.spec.ts` | 🟢 | `[ ]` |
| T030 | Teste de contrato do `IModule`: módulo placeholder satisfaz o tipo, manifesto inválido é rejeitado | T010 | `[//]` | `packages/nattivus-sdk/test/manifest-contract.spec.ts` | 🟢 | `[ ]` |
| T031 | Teste E2E de busca semântica: registrar coleção pgvector + Qdrant, upsert, search retorna ranqueado | T026 | - | `packages/nattivus-shell/test/integration/semantic-search.spec.ts` | 🟢 | `[ ]` |

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T032 | Implementar `PasswordService` com Argon2id (`hash`, `verify`, parâmetros `memoryCost=64MB`, `timeCost=3`, `parallelism=4`) | T021 | - | `packages/nattivus-shell/src/auth/password.service.ts` | 🟢 | `[ ]` |
| T033 | Implementar `UserService` (criar, buscar por email, marcar lock, reset `failed_login_count`, marcar `mfa_enrolled_at`) | T032 | - | `packages/nattivus-shell/src/auth/user.service.ts` | 🟢 | `[ ]` |
| T034 | Implementar `TotpService` com `otplib` (gerar segredo, gerar QR `otpauth://`, verificar token, criptografar segredo em `mfa_secret.secret_encrypted` com AES-256-GCM) | T021 | - | `packages/nattivus-shell/src/auth/totp.service.ts` | 🟢 | `[ ]` |
| T035 | Implementar `BackupCodeService` (gerar conjunto de 10 códigos, hash bcrypt cost 12, consumir, revogar conjunto inteiro) | T021 | - | `packages/nattivus-shell/src/auth/backup-code.service.ts` | 🟢 | `[ ]` |
| T036 | Implementar `JwtService` (EdDSA, header com `kid`, store de chaves rotacionável, verificação com lookup de kid) | T021 | - | `packages/nattivus-shell/src/auth/jwt.service.ts` | 🟢 | `[ ]` |
| T037 | Implementar `RefreshTokenService` com rotação obrigatória, detecção de reuso (revoga toda família do user), hash SHA-256 de token opaco | T036 | - | `packages/nattivus-shell/src/auth/refresh-token.service.ts` | 🟢 | `[ ]` |
| T038 | Implementar `TenantContextMiddleware` que extrai `workspaceId` do header `X-Workspace-Id`, valida membership e roda `SET LOCAL app.workspace_id` + `app.user_id` na conexão do request | T021, T036 | - | `packages/nattivus-shell/src/multi-tenant/tenant-context.middleware.ts` | 🟢 | `[ ]` |
| T039 | Implementar `AuthGuard` (NestJS) que valida `Authorization: Bearer <jwt>`, popula request com user/workspaces | T036 | - | `packages/nattivus-shell/src/auth/auth.guard.ts` | 🟢 | `[ ]` |
| T040 | Implementar `PermissionGuard` que lê metadado de `@RequirePermission(flag)` e verifica contra roles do workspace member | T039 | - | `packages/nattivus-shell/src/auth/permission.guard.ts` | 🟢 | `[ ]` |
| T041 | Implementar `DomainGuard` extensível (recebe `DomainRuleSpec` via decorator e delega ao handler do módulo) | T040 | - | `packages/nattivus-shell/src/auth/domain.guard.ts` | 🟢 | `[ ]` |
| T042 | Implementar `ModuleRegistryService` (CRUD em `module_registry`, comparação de versão, marcação `incompatible`) | T021 | - | `packages/nattivus-shell/src/modules/module-registry.service.ts` | 🟢 | `[ ]` |
| T043 | Implementar `ModuleDiscoveryService`: glob `packages/modules/*/dist/module.manifest.js`, valida shape, compara `sdkVersion` com range suportado, upsert no registry | T010, T042 | - | `packages/nattivus-shell/src/modules/module-discovery.service.ts` | 🟢 | `[ ]` |
| T044 | Implementar `ModuleActivationService`: dependências, transação, aplicar migrações do módulo, `onActivate`/`onDeactivate`, registro dinâmico de rotas | T042 | - | `packages/nattivus-shell/src/modules/module-activation.service.ts` | 🟡 | `[ ]` |
| T045 | Implementar `VectorIndexRegistryService` (CRUD em `vector_index_registry`) | T021 | - | `packages/nattivus-shell/src/semantic/vector-index-registry.service.ts` | 🟢 | `[ ]` |
| T046 | Implementar `PgvectorStrategy` (criar coluna `embedding vector(N)` em tabela alvo, índice HNSW, upsert, search por `<->`/`<#>`) | T045 | - | `packages/nattivus-shell/src/semantic/pgvector.strategy.ts` | 🟢 | `[ ]` |
| T047 | Implementar `QdrantStrategy` (cliente HTTP/gRPC do Qdrant: create collection, upsert, search, delete) | T045 | - | `packages/nattivus-shell/src/semantic/qdrant.strategy.ts` | 🟢 | `[ ]` |
| T048 | Implementar `SemanticSearchService` que despacha para `PgvectorStrategy` ou `QdrantStrategy` conforme `vector_index_registry.backend` | T046, T047 | - | `packages/nattivus-shell/src/semantic/semantic-search.service.ts` | 🟢 | `[ ]` |
| T049 | Implementar `AuditLogService` (insert append-only, suporte a `requestId` correlation, action enum-like com strings literais) | T021 | - | `packages/nattivus-shell/src/audit/audit-log.service.ts` | 🟢 | `[ ]` |
| T050 | Implementar `WorkspaceService` + `WorkspaceMemberService` (criar workspace, convite por email com token, aceite, roles, soft-delete) | T021 | - | `packages/nattivus-shell/src/workspace/workspace.service.ts` | 🟢 | `[ ]` |

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T051 | Implementar `AuthController` com endpoints `POST /auth/login`, `POST /auth/totp/verify`, `POST /auth/totp/backup-code` conforme `interfaces/auth-api.md` | T033, T034, T035, T036 | - | `packages/nattivus-shell/src/auth/auth.controller.ts` | 🟢 | `[ ]` |
| T052 | Endpoints `POST /auth/refresh`, `POST /auth/logout` no `AuthController` (rotação + detecção de reuso) | T037, T051 | - | `packages/nattivus-shell/src/auth/auth.controller.ts` | 🟢 | `[ ]` |
| T053 | Endpoint `POST /auth/backup-codes/regenerate` (requer access_token + header `X-Mfa-Totp`) | T035, T051 | - | `packages/nattivus-shell/src/auth/auth.controller.ts` | 🟢 | `[ ]` |
| T054 | Implementar `ModuleAdminController` com endpoints `GET /api/admin/modules`, `GET /:id/activation`, `POST /:id/activate`, `POST /:id/deactivate`, `POST /:id/disable-globally` conforme `interfaces/module-system.md` | T044, T040 | - | `packages/nattivus-shell/src/modules/module-admin.controller.ts` | 🟢 | `[ ]` |
| T055 | Implementar `MeController` (`GET /api/me`) e `HealthController` (`GET /health` checa db + redis + qdrant) | T039, T050 | - | `packages/nattivus-shell/src/system/me.controller.ts` | 🟢 | `[ ]` |
| T056 | Implementar `SemanticController` com `POST /api/semantic/register`, `POST /api/semantic/upsert`, `POST /api/semantic/search` | T048, T040 | - | `packages/nattivus-shell/src/semantic/semantic.controller.ts` | 🟢 | `[ ]` |
| T057 | Implementar GraphQL admin schema (`Module` type, `modules` query, `activateModule`/`deactivateModule` mutations) | T044 | - | `packages/nattivus-shell/src/modules/module-admin.resolver.ts` | 🟢 | `[ ]` |
| T058 | Implementar `main.ts` do shell: boot ORM, executar discovery, registrar rotas dinâmicas de módulos ativos por workspace, subir HTTP server | T043, T044, T021 | - | `packages/nattivus-shell/src/main.ts` | 🟢 | `[ ]` |
| T059 | Implementar módulo `hello-world` completo: `module.manifest.ts`, 1 entidade `HelloMessage` extends `BaseEntity`, 1 controller `GET /api/hello`, 1 migração própria | T010, T009 | - | `packages/modules/hello-world/src/module.manifest.ts` | 🟢 | `[ ]` |
| T060 | CLI `seed-admin`: cria user + workspace + workspace_member admin (yargs ou commander) | T050, T033 | - | `packages/nattivus-shell/src/cli/seed-admin.ts` | 🟢 | `[ ]` |
| T061 | CLI `unlock-user` (reseta `failed_login_count` e `locked_until`) | T033 | - | `packages/nattivus-shell/src/cli/unlock-user.ts` | 🟢 | `[ ]` |
| T062 | Configurar publicação do `@nattivus/sdk` (package.json com `name`, `version`, `main`, `module`, `exports`, `types`, `publishConfig.access=public`, scripts `build` e `publish`) | T010, T011, T012 | - | `packages/nattivus-sdk/package.json` | 🟢 | `[ ]` |

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T063 | Logger estruturado com `pino` + middleware de `X-Request-Id` (gera se ausente, propaga em logs e audit_log) | T058 | `[//]` | `packages/nattivus-shell/src/observability/logger.ts` | 🟢 | `[ ]` |
| T064 | Aplicar rate limit nos endpoints de auth (10/min por IP, 5/min por email no login; 3 tentativas TOTP → cooldown 60s) | T051 | `[//]` | `packages/nattivus-shell/src/auth/rate-limit.guard.ts` | 🟢 | `[ ]` |
| T065 | README do `nattivus-shell` (visão, comandos `dev`, `db:init`, `db:migrate`, `seed-admin`, troubleshooting) | T058 | `[//]` | `packages/nattivus-shell/README.md` | 🟢 | `[ ]` |
| T066 | README público do `@nattivus/sdk` (instalação, exemplo do §10 do `sdk-contract.md`, política SemVer) | T062 | `[//]` | `packages/nattivus-sdk/README.md` | 🟢 | `[ ]` |
| T067 | README do módulo `hello-world` como template para terceiros ("Como criar um módulo NattivusECO") | T059 | `[//]` | `packages/modules/hello-world/README.md` | 🟢 | `[ ]` |
| T068 | Aplicar tokens de design Nattivus default no `nattivus-ui` (paleta, tipografia, espaçamentos) e expor CSS variables para override por workspace | T007 | `[//]` | `packages/nattivus-ui/src/tokens/index.ts` | 🟡 | `[ ]` |

## Notas de execução

<!-- Reservado para /reversa-coding registrar observações que surgiram durante a execução. -->

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-05-14 | Versão inicial gerada por `/reversa-to-do` — 68 ações em 5 fases, 19 paralelizáveis | reversa |
