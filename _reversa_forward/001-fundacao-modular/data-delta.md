# Data Delta: Fundação Modular NattivusECO

> Schema inicial do shell. Produto novo: não há migração de dados, apenas criação de schema vazio.
> Referência conceitual: `_reversa_sdd/erd-complete.md` (padrão de entidades do Twenty — herdamos conceitos, não tabelas).

## 1. Princípios do esquema

1. Toda tabela transacional herda colunas-base de `BaseEntity`: `id` (uuid pk), `workspace_id` (uuid fk → workspace, exceto tabelas globais), `created_at`, `updated_at`, `deleted_at` (soft-delete), `search_vector` (tsvector, atualizado por trigger), `position` (numeric, ordenação manual).
2. **Row-Level Security obrigatória** em toda tabela com `workspace_id`. Policy: `current_setting('app.workspace_id')::uuid = workspace_id`.
3. **Tabelas globais** (sem `workspace_id`): `user`, `mfa_secret`, `backup_code`, `refresh_token`, `module_registry`, `vector_index_registry`, `audit_log`.
4. Toda FK usa `ON DELETE` explícito; soft-delete é o padrão, hard-delete só para tabelas técnicas (refresh_token expirado, audit log com retention).
5. Embeddings: coluna `embedding vector(N)` com índice HNSW quando a tabela usa pgvector; coleções Qdrant registradas em `vector_index_registry`.

## 2. Tabelas novas — Shell core

### 2.1 `user` (global)

| Coluna | Tipo | Constraints | Nota |
|--------|------|-------------|------|
| id | uuid | pk | |
| email | citext | unique not null | case-insensitive |
| password_hash | text | not null | Argon2id |
| status | text | not null default 'pending' | `pending` \| `active` \| `disabled` |
| mfa_enrolled_at | timestamptz | nullable | NULL até primeiro enrollment TOTP |
| last_login_at | timestamptz | nullable | |
| failed_login_count | int | not null default 0 | reset no login bem-sucedido |
| locked_until | timestamptz | nullable | cooldown após N falhas |
| created_at, updated_at, deleted_at | timestamptz | | base |

### 2.2 `mfa_secret` (global, 1:1 com user)

| Coluna | Tipo | Constraints | Nota |
|--------|------|-------------|------|
| id | uuid | pk | |
| user_id | uuid | unique not null, fk → user(id) on delete cascade | |
| secret_encrypted | bytea | not null | AES-256-GCM com KEK do shell |
| algorithm | text | not null default 'SHA1' | RFC 6238 |
| digits | int | not null default 6 | |
| period_seconds | int | not null default 30 | |
| confirmed_at | timestamptz | nullable | NULL até primeiro TOTP válido |
| created_at, updated_at | timestamptz | | |

### 2.3 `backup_code` (global)

| Coluna | Tipo | Constraints | Nota |
|--------|------|-------------|------|
| id | uuid | pk | |
| user_id | uuid | not null, fk → user(id) on delete cascade | |
| code_hash | text | not null | bcrypt cost 12 |
| consumed_at | timestamptz | nullable | NULL = ainda válido |
| created_at | timestamptz | not null | |

Índice: `(user_id) where consumed_at is null` (parcial, lookup rápido de códigos disponíveis).

### 2.4 `refresh_token` (global)

| Coluna | Tipo | Constraints | Nota |
|--------|------|-------------|------|
| id | uuid | pk | |
| user_id | uuid | not null, fk → user(id) on delete cascade | |
| token_hash | text | not null unique | hash do token opaco |
| issued_at | timestamptz | not null | |
| expires_at | timestamptz | not null | |
| revoked_at | timestamptz | nullable | |
| device_fingerprint | text | nullable | user-agent + ip hash para auditoria |

Índice: `(user_id) where revoked_at is null and expires_at > now()`.

### 2.5 `workspace` (tabela "raiz" do tenant)

| Coluna | Tipo | Constraints | Nota |
|--------|------|-------------|------|
| id | uuid | pk | |
| slug | text | unique not null | URL-friendly |
| display_name | text | not null | |
| brand_overrides | jsonb | not null default '{}' | nome, logo_url, primary_color, favicon_url para white-label (RF-10) |
| profile | text | not null default 'social' | `social` \| `enterprise` \| `both` — informacional, não controla acesso |
| created_at, updated_at, deleted_at | timestamptz | | |

Sem `workspace_id` (é a tabela-raiz). RLS não se aplica aqui — controle é por relacionamento com `workspace_member`.

### 2.6 `workspace_member` (junção user × workspace)

| Coluna | Tipo | Constraints | Nota |
|--------|------|-------------|------|
| id | uuid | pk | |
| workspace_id | uuid | not null, fk → workspace(id) on delete cascade | |
| user_id | uuid | not null, fk → user(id) on delete cascade | |
| roles | text[] | not null default '{}' | strings literais (sem enum), conforme princípio do legado |
| invited_at | timestamptz | not null | |
| accepted_at | timestamptz | nullable | NULL = convite pendente |
| created_at, updated_at, deleted_at | timestamptz | | |

Unique: `(workspace_id, user_id) where deleted_at is null`.
RLS aqui é especial: usuário só vê seus próprios `workspace_member` (filtro por `user_id = current_setting('app.user_id')::uuid`).

### 2.7 `module_registry` (global, catálogo de módulos descobertos)

| Coluna | Tipo | Constraints | Nota |
|--------|------|-------------|------|
| id | uuid | pk | |
| module_id | text | unique not null | ex.: `nattivus.crm.core` |
| version | text | not null | SemVer |
| manifest | jsonb | not null | snapshot completo no startup |
| discovered_at | timestamptz | not null | |
| disabled_globally | bool | not null default false | kill switch operacional |

### 2.8 `module_activation` (por workspace)

| Coluna | Tipo | Constraints | Nota |
|--------|------|-------------|------|
| id | uuid | pk | |
| workspace_id | uuid | not null, fk → workspace(id) on delete cascade | |
| module_id | text | not null, fk lógica → module_registry(module_id) | |
| activated_at | timestamptz | not null | |
| activated_by_user_id | uuid | not null, fk → user(id) | |
| config | jsonb | not null default '{}' | config específica do módulo no workspace |

Unique: `(workspace_id, module_id)`.

### 2.9 `audit_log` (global, append-only)

| Coluna | Tipo | Constraints | Nota |
|--------|------|-------------|------|
| id | uuid | pk | |
| workspace_id | uuid | nullable | NULL para ações globais (admin de plataforma) |
| user_id | uuid | nullable | NULL para ações de sistema |
| action | text | not null | ex.: `auth.login`, `workspace.create` |
| entity_type | text | nullable | |
| entity_id | uuid | nullable | |
| metadata | jsonb | not null default '{}' | |
| occurred_at | timestamptz | not null default now() | |
| request_id | text | nullable | correlação |

Partição mensal recomendada (não obrigatória no v1).

### 2.10 `vector_index_registry` (global)

| Coluna | Tipo | Constraints | Nota |
|--------|------|-------------|------|
| id | uuid | pk | |
| collection_name | text | unique not null | ex.: `module.crm.person` |
| backend | text | not null | `pgvector` \| `qdrant` |
| dimensions | int | not null | |
| metric | text | not null | `cosine` \| `l2` \| `inner` |
| owner_module_id | text | not null | |
| created_at | timestamptz | not null | |

## 3. Extensões e tipos custom

- `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
- `CREATE EXTENSION IF NOT EXISTS "pgcrypto";`
- `CREATE EXTENSION IF NOT EXISTS "citext";`
- `CREATE EXTENSION IF NOT EXISTS "pgvector";` (D-04 — se indisponível, módulos que precisem vão exclusivamente para Qdrant)

## 4. Triggers e funções

| Função | Propósito |
|--------|-----------|
| `tg_set_updated_at()` | Atualiza `updated_at = now()` em UPDATE para todas tabelas com a coluna |
| `tg_update_search_vector(text[])` | Atualiza `search_vector` a partir de colunas declaradas (parametrizado por trigger por tabela) |
| `tg_audit_row(action text)` | Insere em `audit_log` em INSERT/UPDATE/DELETE de tabelas marcadas |

## 5. Policies RLS — padrão para tabelas com `workspace_id`

```sql
ALTER TABLE <tabela> ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON <tabela>
  USING (workspace_id = current_setting('app.workspace_id')::uuid)
  WITH CHECK (workspace_id = current_setting('app.workspace_id')::uuid);
```

Configuração de sessão: `SET LOCAL app.workspace_id = '<uuid>'; SET LOCAL app.user_id = '<uuid>';` aplicada por middleware ORM em cada request.

## 6. Migrações

Estrutura de pastas:

```
packages/nattivus-shell/migrations/
  001-create-extensions.sql
  002-create-auth-tables.sql
  003-create-workspace-tables.sql
  004-create-module-registry.sql
  005-create-audit-log.sql
  006-create-vector-index-registry.sql
  007-enable-rls.sql
```

Comando: `yarn db:migrate` (idempotente). Comando `db:reset` recria do zero (apenas em dev).

## 7. Diff sobre o legado

| Aspecto | Twenty CRM | NattivusECO Shell |
|---------|------------|-------------------|
| Tabela `workspace` | Existe | Reaproveita conceito; adiciona `brand_overrides`, `profile` |
| Tabela `workspace_member` | Existe com roles enum | Roles como `text[]` (princípio "string literals over enums") |
| MFA | Inexistente / opcional | Obrigatório, modelado em `mfa_secret` + `backup_code` |
| Module registry | Não há — tudo é hard-coded em Nx packages | `module_registry` + `module_activation` em DB |
| Vector indexes | Inexistente | `vector_index_registry` registra todas coleções (pgvector + Qdrant) |
| RLS | Não usado (filtro só em ORM) | Obrigatória — defesa em profundidade |
| Audit log | Timeline polimórfica em domínio | `audit_log` global no shell + Timeline ficará por módulo de domínio quando entrar |

## 8. Sem migração de dados

Não há `runDataMigration`. Produto novo, schema vazio no primeiro `db:init`.
