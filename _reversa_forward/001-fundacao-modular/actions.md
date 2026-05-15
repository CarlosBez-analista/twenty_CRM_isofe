# Actions: FundaÃ§Ã£o Modular NattivusECO

> Identificador: `001-fundacao-modular`
> Data: `2026-05-14`
> Roadmap: `_reversa_forward/001-fundacao-modular/roadmap.md`
> ADR: `_reversa_sdd/adrs/0007-nattivus-subdiretorio-isolado.md`
>
> **ConvenÃ§Ã£o de caminhos**: todos os caminhos de arquivo neste documento sÃ£o relativos Ã  raiz `nattivus/` (subdiretÃ³rio isolado dentro do repo do Twenty, conforme ADR-0007). Exemplo: `package.json` â†’ `nattivus/package.json`.

## Resumo

| MÃ©trica | Valor |
|---------|-------|
| Total de aÃ§Ãµes | 68 |
| ParalelizÃ¡veis (`[//]`) | 19 |
| Maior cadeia de dependÃªncia | 11 (T001 â†’ T005 â†’ T013 â†’ T014 â†’ T019 â†’ T021 â†’ T036 â†’ T037 â†’ T052 â†’ T058 â†’ T063) |

## Fase 1, PreparaÃ§Ã£o

| ID | DescriÃ§Ã£o | DependÃªncias | Paralelismo | Arquivo alvo | ConfidÃªncia | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T001 | Bootstrap do monorepo Nx + Yarn 4 em `nattivus/` (raiz: `package.json`, `nx.json`, `tsconfig.base.json`, `.yarnrc.yml`) â€” ADR-0007 | - | `[//]` | `nattivus/package.json` | ðŸŸ¢ | `[X]` |
| T002 | Criar `docker/compose.dev.yml` com serviÃ§os Postgres (imagem `pgvector/pgvector:pg16`), Redis 7 e Qdrant 1.x | - | `[//]` | `docker/compose.dev.yml` | ðŸŸ¢ | `[X]` |
| T003 | Criar `.env.example`, `.gitignore`, `.editorconfig`, `.prettierrc` na raiz | - | `[//]` | `.env.example` | ðŸŸ¢ | `[X]` |
| T004 | Criar pacote `nattivus-shared` como Nx library TS pura (estrutura, `project.json`, `tsconfig`) | T001 | `[//]` | `packages/nattivus-shared/project.json` | ðŸŸ¢ | `[X]` |
| T005 | Criar pacote `nattivus-shell` como Nx app NestJS (estrutura, `project.json`, `main.ts` stub, `app.module.ts`) | T001 | `[//]` | `packages/nattivus-shell/project.json` | ðŸŸ¢ | `[X]` |
| T006 | Criar pacote `nattivus-sdk` como Nx library publicÃ¡vel (estrutura, `project.json`, scripts de build dual ESM/CJS) | T001 | `[//]` | `packages/nattivus-sdk/project.json` | ðŸŸ¢ | `[X]` |
| T007 | Criar pacote `nattivus-ui` como Nx library de componentes React + Linaria (estrutura) | T001 | `[//]` | `packages/nattivus-ui/project.json` | ðŸŸ¡ | `[X]` |
| T008 | Criar `packages/modules/hello-world` como Nx library com `module.manifest.ts` mÃ­nimo | T001 | `[//]` | `packages/modules/hello-world/project.json` | ðŸŸ¢ | `[X]` |
| T009 | Implementar `BaseEntity` em `nattivus-shared/src/base-entity.ts` com colunas-base e decorators TypeORM | T004 | - | `packages/nattivus-shared/src/base-entity.ts` | ðŸŸ¢ | `[X]` |
| T010 | Implementar `IModule`, `IModuleManifest`, `EntitySpec`, `RouteSpec`, helpers `createManifest`/`defineEntity` no SDK | T006, T009 | - | `packages/nattivus-sdk/src/manifest.ts` | ðŸŸ¢ | `[X]` |
| T011 | Implementar `PermissionFlag` type, helper `definePermission` e decorators `@RequireAuth`/`@RequirePermission`/`@RequireDomain` no SDK | T006 | - | `packages/nattivus-sdk/src/permissions.ts` | ðŸŸ¢ | `[X]` |
| T012 | Implementar interface `ShellClient` no SDK (stubs para `semanticSearch`, `audit`, `getCurrentWorkspace`, `getCurrentUser`) | T006 | - | `packages/nattivus-sdk/src/shell-client.ts` | ðŸŸ¢ | `[X]` |
| T013 | Criar `migrations/001-create-extensions.sql` (`uuid-ossp`, `pgcrypto`, `citext`, `vector`) | T005 | - | `packages/nattivus-shell/migrations/001-create-extensions.sql` | ðŸŸ¢ | `[X]` |
| T014 | Criar `migrations/002-create-auth-tables.sql` (`user`, `mfa_secret`, `backup_code`, `refresh_token` conforme `data-delta.md` Â§2.1â€“2.4) | T013 | - | `packages/nattivus-shell/migrations/002-create-auth-tables.sql` | ðŸŸ¢ | `[X]` |
| T015 | Criar `migrations/003-create-workspace-tables.sql` (`workspace`, `workspace_member` conforme `data-delta.md` Â§2.5â€“2.6) | T013 | - | `packages/nattivus-shell/migrations/003-create-workspace-tables.sql` | ðŸŸ¢ | `[X]` |
| T016 | Criar `migrations/004-create-module-registry.sql` (`module_registry`, `module_activation` conforme `data-delta.md` Â§2.7â€“2.8) | T015 | - | `packages/nattivus-shell/migrations/004-create-module-registry.sql` | ðŸŸ¢ | `[X]` |
| T017 | Criar `migrations/005-create-audit-log.sql` (`audit_log` conforme `data-delta.md` Â§2.9) | T013 | - | `packages/nattivus-shell/migrations/005-create-audit-log.sql` | ðŸŸ¢ | `[X]` |
| T018 | Criar `migrations/006-create-vector-index-registry.sql` (`vector_index_registry` Â§2.10) | T013 | - | `packages/nattivus-shell/migrations/006-create-vector-index-registry.sql` | ðŸŸ¢ | `[X]` |
| T019 | Criar `migrations/007-enable-rls.sql` com policies `tenant_isolation` em todas tabelas com `workspace_id` e policy especial em `workspace_member` | T014, T015, T016 | - | `packages/nattivus-shell/migrations/007-enable-rls.sql` | ðŸŸ¢ | `[X]` |
| T020 | Criar functions `tg_set_updated_at`, `tg_update_search_vector`, `tg_audit_row` e wiring de triggers nas tabelas relevantes | T019 | - | `packages/nattivus-shell/migrations/008-triggers.sql` | ðŸŸ¢ | `[X]` |
| T021 | Configurar TypeORM `DataSource` em `nattivus-shell` com entidades correspondentes Ã s 10 tabelas + carregamento dinÃ¢mico de entidades de mÃ³dulos | T009, T020 | - | `packages/nattivus-shell/src/database/data-source.ts` | ðŸŸ¢ | `[X]` |
| T022 | Implementar comandos CLI `db:init`, `db:migrate`, `db:reset` (yarn scripts + runner Node) | T021 | - | `packages/nattivus-shell/src/cli/db.ts` | ðŸŸ¢ | `[X]` |

## Fase 2, Testes

| ID | DescriÃ§Ã£o | DependÃªncias | Paralelismo | Arquivo alvo | ConfidÃªncia | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T023 | Setup Jest config para `nattivus-shell` (`jest.config.ts`, testes de integraÃ§Ã£o com Postgres efÃªmero via testcontainers ou banco dedicado) | T005 | `[//]` | `packages/nattivus-shell/jest.config.ts` | ðŸŸ¢ | `[ ]` |
| T024 | Setup Jest config para `nattivus-shared` | T004 | `[//]` | `packages/nattivus-shared/jest.config.ts` | ðŸŸ¢ | `[ ]` |
| T025 | Setup Jest config para `nattivus-sdk` | T006 | `[//]` | `packages/nattivus-sdk/jest.config.ts` | ðŸŸ¢ | `[ ]` |
| T026 | Criar fixtures e helpers de teste (`createTestWorkspace`, `createTestUser`, `withTotp`, `withWorkspaceContext`) | T021, T022 | - | `packages/nattivus-shell/test/fixtures.ts` | ðŸŸ¢ | `[ ]` |
| T027 | Teste E2E de isolamento multi-tenant: workspace A nÃ£o acessa dados de B via ORM, GraphQL nem REST (cenÃ¡rio Gherkin Â§7 do requirements) | T026 | - | `packages/nattivus-shell/test/integration/tenant-isolation.spec.ts` | ðŸŸ¢ | `[ ]` |
| T028 | Teste E2E de login + enrollment TOTP + login subsequente + backup code (cenÃ¡rio Gherkin Â§7) | T026 | - | `packages/nattivus-shell/test/integration/auth-totp.spec.ts` | ðŸŸ¢ | `[ ]` |
| T029 | Teste E2E de descoberta automÃ¡tica de mÃ³dulo: adicionar manifesto novo â†’ rota aparece sem editar shell (cenÃ¡rio Gherkin Â§7) | T026 | - | `packages/nattivus-shell/test/integration/module-discovery.spec.ts` | ðŸŸ¢ | `[ ]` |
| T030 | Teste de contrato do `IModule`: mÃ³dulo placeholder satisfaz o tipo, manifesto invÃ¡lido Ã© rejeitado | T010 | `[//]` | `packages/nattivus-sdk/test/manifest-contract.spec.ts` | ðŸŸ¢ | `[ ]` |
| T031 | Teste E2E de busca semÃ¢ntica: registrar coleÃ§Ã£o pgvector + Qdrant, upsert, search retorna ranqueado | T026 | - | `packages/nattivus-shell/test/integration/semantic-search.spec.ts` | ðŸŸ¢ | `[ ]` |

## Fase 3, NÃºcleo

| ID | DescriÃ§Ã£o | DependÃªncias | Paralelismo | Arquivo alvo | ConfidÃªncia | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T032 | Implementar `PasswordService` com Argon2id (`hash`, `verify`, parÃ¢metros `memoryCost=64MB`, `timeCost=3`, `parallelism=4`) | T021 | - | `packages/nattivus-shell/src/auth/password.service.ts` | ðŸŸ¢ | `[X]` |
| T033 | Implementar `UserService` (criar, buscar por email, marcar lock, reset `failed_login_count`, marcar `mfa_enrolled_at`) | T032 | - | `packages/nattivus-shell/src/auth/user.service.ts` | ðŸŸ¢ | `[X]` |
| T034 | Implementar `TotpService` com `otplib` (gerar segredo, gerar QR `otpauth://`, verificar token, criptografar segredo em `mfa_secret.secret_encrypted` com AES-256-GCM) | T021 | - | `packages/nattivus-shell/src/auth/totp.service.ts` | ðŸŸ¢ | `[X]` |
| T035 | Implementar `BackupCodeService` (gerar conjunto de 10 cÃ³digos, hash bcrypt cost 12, consumir, revogar conjunto inteiro) | T021 | - | `packages/nattivus-shell/src/auth/backup-code.service.ts` | ðŸŸ¢ | `[X]` |
| T036 | Implementar `JwtService` (EdDSA, header com `kid`, store de chaves rotacionÃ¡vel, verificaÃ§Ã£o com lookup de kid) | T021 | - | `packages/nattivus-shell/src/auth/jwt.service.ts` | ðŸŸ¢ | `[X]` |
| T037 | Implementar `RefreshTokenService` com rotaÃ§Ã£o obrigatÃ³ria, detecÃ§Ã£o de reuso (revoga toda famÃ­lia do user), hash SHA-256 de token opaco | T036 | - | `packages/nattivus-shell/src/auth/refresh-token.service.ts` | ðŸŸ¢ | `[X]` |
| T038 | Implementar `TenantContextMiddleware` que extrai `workspaceId` do header `X-Workspace-Id`, valida membership e roda `SET LOCAL app.workspace_id` + `app.user_id` na conexÃ£o do request | T021, T036 | - | `packages/nattivus-shell/src/multi-tenant/tenant-context.middleware.ts` | ðŸŸ¢ | `[X]` |
| T039 | Implementar `AuthGuard` (NestJS) que valida `Authorization: Bearer <jwt>`, popula request com user/workspaces | T036 | - | `packages/nattivus-shell/src/auth/auth.guard.ts` | ðŸŸ¢ | `[X]` |
| T040 | Implementar `PermissionGuard` que lÃª metadado de `@RequirePermission(flag)` e verifica contra roles do workspace member | T039 | - | `packages/nattivus-shell/src/auth/permission.guard.ts` | ðŸŸ¢ | `[X]` |
| T041 | Implementar `DomainGuard` extensÃ­vel (recebe `DomainRuleSpec` via decorator e delega ao handler do mÃ³dulo) | T040 | - | `packages/nattivus-shell/src/auth/domain.guard.ts` | ðŸŸ¢ | `[X]` |
| T042 | Implementar `ModuleRegistryService` (CRUD em `module_registry`, comparaÃ§Ã£o de versÃ£o, marcaÃ§Ã£o `incompatible`) | T021 | - | `packages/nattivus-shell/src/modules/module-registry.service.ts` | ðŸŸ¢ | `[X]` |
| T043 | Implementar `ModuleDiscoveryService`: glob `packages/modules/*/dist/module.manifest.js`, valida shape, compara `sdkVersion` com range suportado, upsert no registry | T010, T042 | - | `packages/nattivus-shell/src/modules/module-discovery.service.ts` | ðŸŸ¢ | `[X]` |
| T044 | Implementar `ModuleActivationService`: dependÃªncias, transaÃ§Ã£o, aplicar migraÃ§Ãµes do mÃ³dulo, `onActivate`/`onDeactivate`, registro dinÃ¢mico de rotas | T042 | - | `packages/nattivus-shell/src/modules/module-activation.service.ts` | ðŸŸ¡ | `[X]` |
| T045 | Implementar `VectorIndexRegistryService` (CRUD em `vector_index_registry`) | T021 | - | `packages/nattivus-shell/src/semantic/vector-index-registry.service.ts` | ðŸŸ¢ | `[X]` |
| T046 | Implementar `PgvectorStrategy` (criar coluna `embedding vector(N)` em tabela alvo, Ã­ndice HNSW, upsert, search por `<->`/`<#>`) | T045 | - | `packages/nattivus-shell/src/semantic/pgvector.strategy.ts` | ðŸŸ¢ | `[X]` |
| T047 | Implementar `QdrantStrategy` (cliente HTTP/gRPC do Qdrant: create collection, upsert, search, delete) | T045 | - | `packages/nattivus-shell/src/semantic/qdrant.strategy.ts` | ðŸŸ¢ | `[X]` |
| T048 | Implementar `SemanticSearchService` que despacha para `PgvectorStrategy` ou `QdrantStrategy` conforme `vector_index_registry.backend` | T046, T047 | - | `packages/nattivus-shell/src/semantic/semantic-search.service.ts` | ðŸŸ¢ | `[X]` |
| T049 | Implementar `AuditLogService` (insert append-only, suporte a `requestId` correlation, action enum-like com strings literais) | T021 | - | `packages/nattivus-shell/src/audit/audit-log.service.ts` | ðŸŸ¢ | `[X]` |
| T050 | Implementar `WorkspaceService` + `WorkspaceMemberService` (criar workspace, convite por email com token, aceite, roles, soft-delete) | T021 | - | `packages/nattivus-shell/src/workspace/workspace.service.ts` | ðŸŸ¢ | `[X]` |

## Fase 4, IntegraÃ§Ã£o

| ID | DescriÃ§Ã£o | DependÃªncias | Paralelismo | Arquivo alvo | ConfidÃªncia | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T051 | Implementar `AuthController` com endpoints `POST /auth/login`, `POST /auth/totp/verify`, `POST /auth/totp/backup-code` conforme `interfaces/auth-api.md` | T033, T034, T035, T036 | - | `packages/nattivus-shell/src/auth/auth.controller.ts` | ðŸŸ¢ | ``[X]`` |
| T052 | Endpoints `POST /auth/refresh`, `POST /auth/logout` no `AuthController` (rotaÃ§Ã£o + detecÃ§Ã£o de reuso) | T037, T051 | - | `packages/nattivus-shell/src/auth/auth.controller.ts` | ðŸŸ¢ | ``[X]`` |
| T053 | Endpoint `POST /auth/backup-codes/regenerate` (requer access_token + header `X-Mfa-Totp`) | T035, T051 | - | `packages/nattivus-shell/src/auth/auth.controller.ts` | ðŸŸ¢ | ``[X]`` |
| T054 | Implementar `ModuleAdminController` com endpoints `GET /api/admin/modules`, `GET /:id/activation`, `POST /:id/activate`, `POST /:id/deactivate`, `POST /:id/disable-globally` conforme `interfaces/module-system.md` | T044, T040 | - | `packages/nattivus-shell/src/modules/module-admin.controller.ts` | ðŸŸ¢ | ``[X]`` |
| T055 | Implementar `MeController` (`GET /api/me`) e `HealthController` (`GET /health` checa db + redis + qdrant) | T039, T050 | - | `packages/nattivus-shell/src/system/me.controller.ts` | ðŸŸ¢ | ``[X]`` |
| T056 | Implementar `SemanticController` com `POST /api/semantic/register`, `POST /api/semantic/upsert`, `POST /api/semantic/search` | T048, T040 | - | `packages/nattivus-shell/src/semantic/semantic.controller.ts` | ðŸŸ¢ | ``[X]`` |
| T057 | Implementar GraphQL admin schema (`Module` type, `modules` query, `activateModule`/`deactivateModule` mutations) | T044 | - | `packages/nattivus-shell/src/modules/module-admin.resolver.ts` | ðŸŸ¢ | ``[X]`` |
| T058 | Implementar `main.ts` do shell: boot ORM, executar discovery, registrar rotas dinÃ¢micas de mÃ³dulos ativos por workspace, subir HTTP server | T043, T044, T021 | - | `packages/nattivus-shell/src/main.ts` | ðŸŸ¢ | ``[X]`` |
| T059 | Implementar mÃ³dulo `hello-world` completo: `module.manifest.ts`, 1 entidade `HelloMessage` extends `BaseEntity`, 1 controller `GET /api/hello`, 1 migraÃ§Ã£o prÃ³pria | T010, T009 | - | `packages/modules/hello-world/src/module.manifest.ts` | ðŸŸ¢ | ``[X]`` |
| T060 | CLI `seed-admin`: cria user + workspace + workspace_member admin (yargs ou commander) | T050, T033 | - | `packages/nattivus-shell/src/cli/seed-admin.ts` | ðŸŸ¢ | ``[X]`` |
| T061 | CLI `unlock-user` (reseta `failed_login_count` e `locked_until`) | T033 | - | `packages/nattivus-shell/src/cli/unlock-user.ts` | ðŸŸ¢ | ``[X]`` |
| T062 | Configurar publicaÃ§Ã£o do `@nattivus/sdk` (package.json com `name`, `version`, `main`, `module`, `exports`, `types`, `publishConfig.access=public`, scripts `build` e `publish`) | T010, T011, T012 | - | `packages/nattivus-sdk/package.json` | ðŸŸ¢ | ``[X]`` |

## Fase 5, Polimento

| ID | DescriÃ§Ã£o | DependÃªncias | Paralelismo | Arquivo alvo | ConfidÃªncia | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T063 | Logger estruturado com `pino` + middleware de `X-Request-Id` (gera se ausente, propaga em logs e audit_log) | T058 | `[//]` | `packages/nattivus-shell/src/observability/logger.ts` | ðŸŸ¢ | ``[X]`` |
| T064 | Aplicar rate limit nos endpoints de auth (10/min por IP, 5/min por email no login; 3 tentativas TOTP â†’ cooldown 60s) | T051 | `[//]` | `packages/nattivus-shell/src/auth/rate-limit.guard.ts` | ðŸŸ¢ | ``[X]`` |
| T065 | README do `nattivus-shell` (visÃ£o, comandos `dev`, `db:init`, `db:migrate`, `seed-admin`, troubleshooting) | T058 | `[//]` | `packages/nattivus-shell/README.md` | ðŸŸ¢ | ``[X]`` |
| T066 | README pÃºblico do `@nattivus/sdk` (instalaÃ§Ã£o, exemplo do Â§10 do `sdk-contract.md`, polÃ­tica SemVer) | T062 | `[//]` | `packages/nattivus-sdk/README.md` | ðŸŸ¢ | ``[X]`` |
| T067 | README do mÃ³dulo `hello-world` como template para terceiros ("Como criar um mÃ³dulo NattivusECO") | T059 | `[//]` | `packages/modules/hello-world/README.md` | ðŸŸ¢ | ``[X]`` |
| T068 | Aplicar tokens de design Nattivus default no `nattivus-ui` (paleta, tipografia, espaÃ§amentos) e expor CSS variables para override por workspace | T007 | `[//]` | `packages/nattivus-ui/src/tokens/index.ts` | ðŸŸ¡ | `[ ]` |

## Notas de execuÃ§Ã£o

<!-- Reservado para /reversa-coding registrar observaÃ§Ãµes que surgiram durante a execuÃ§Ã£o. -->

## HistÃ³rico de alteraÃ§Ãµes

| Data | AlteraÃ§Ã£o | Autor |
|------|-----------|-------|
| 2026-05-14 | VersÃ£o inicial gerada por `/reversa-to-do` â€” 68 aÃ§Ãµes em 5 fases, 19 paralelizÃ¡veis | reversa |
| 2026-05-14 | Fases 1â€“3 concluÃ­das (T001â€“T050): monorepo, migraÃ§Ãµes, SDK, guards, services, semantic search | reversa-coding |
| 2026-05-14 | Push: `b602db23df` â†’ `origin/main` (135 arquivos, deps: argon2 otplib jose bcrypt semver) | reversa-coding |
