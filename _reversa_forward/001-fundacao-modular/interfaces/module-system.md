# Interface: Module Discovery & Activation API

> Tipo: HTTP/REST interno + GraphQL (admin)
> Base path: `/api/admin/modules`
> Auth: requer `nattivus.platform.admin` flag
> Confidência: 🟢 (decisões D-09, D-10, alinhadas a RN-01)

## 1. Ciclo de vida de um módulo

```
descoberto (no startup do shell)
    ↓
registrado em module_registry
    ↓
ativável (por workspace, via admin)
    ↓
ativo em workspace_X  ←→  inativo em workspace_Y
    ↓
desativável (libera rotas, mantém dados)
```

## 2. Discovery — ocorre no boot do shell

Não é endpoint HTTP. O shell:

1. Glob: `packages/modules/*/dist/module.manifest.js` (D-10)
2. Para cada arquivo, faz `import default` e valida shape contra `IModuleManifest`
3. Compara `sdkVersion` contra range suportado (D-15, §7 do sdk-contract)
4. Insere ou atualiza linha em `module_registry`
5. Loga `[modules] discovered: <id>@<version>` ou `[modules] rejected: <id> — <reason>`

Manifesto inválido nunca derruba o shell — registra erro e segue.

## 3. Endpoints HTTP

### GET `/api/admin/modules`

Lista módulos descobertos (catálogo da plataforma).

**Response 200:**
```json
{
  "modules": [
    {
      "module_id": "nattivus.crm.core",
      "version": "1.0.0",
      "display_name": "CRM Core",
      "description": "...",
      "dependencies": [],
      "discovered_at": "2026-05-14T12:00:00Z",
      "disabled_globally": false,
      "activations": 12
    }
  ]
}
```

### GET `/api/admin/modules/:moduleId/activation`

Status de ativação para o workspace atual (via `X-Workspace-Id`).

**Response 200:** `{ "active": true, "activated_at": "...", "config": {} }`
**Response 404:** módulo descoberto mas não ativado neste workspace.

### POST `/api/admin/modules/:moduleId/activate`

Ativa módulo no workspace atual.

**Request:** `{ "config": { "...": "valor opcional" } }`

**Response 200:** `{ "active": true, "activated_at": "...", "migrations_applied": 3 }`

**Comportamento:**
1. Verifica dependências (todas presentes em `module_registry` e ativas no workspace)
2. Insere em `module_activation`
3. Aplica migrações próprias do módulo (`migrations/` declaradas no manifesto)
4. Chama `onActivate(ctx)` do módulo se definido
5. Registra rotas dinamicamente (NestJS DynamicModule pattern)

**Erros:**
| HTTP | Código | Quando |
|------|--------|--------|
| 409 | `ALREADY_ACTIVE` | Já ativo no workspace |
| 412 | `MISSING_DEPENDENCY` | Dependência declarada não está ativa |
| 423 | `GLOBALLY_DISABLED` | `disabled_globally = true` (kill switch operacional) |
| 500 | `ACTIVATION_FAILED` | Migração falhou — transação roda back, módulo permanece inativo |

### POST `/api/admin/modules/:moduleId/deactivate`

Desativa módulo no workspace.

**Response 200:** `{ "active": false, "deactivated_at": "..." }`

**Comportamento:**
1. Remove rotas do roteador dinâmico
2. Chama `onDeactivate(ctx)` se definido
3. Marca `module_activation.deleted_at = now()` (soft-delete; dados das tabelas do módulo permanecem)
4. **Não roda migrações de rollback** — dados ficam preservados; ativar de novo restaura acesso sem perda

### POST `/api/admin/modules/:moduleId/disable-globally`

Kill switch operacional (afeta todos workspaces).

**Auth:** requer `nattivus.platform.superadmin` (não confundir com admin de workspace).

**Response 204.** A partir daí, ativar em workspaces falha com `GLOBALLY_DISABLED`. Workspaces que já têm o módulo ativo recebem 503 nas rotas do módulo.

## 4. GraphQL — para UI admin

```graphql
type Module {
  id: ID!
  moduleId: String!
  version: String!
  displayName: String!
  description: String
  dependencies: [String!]!
  discoveredAt: DateTime!
  disabledGlobally: Boolean!
  activeInCurrentWorkspace: Boolean!
  activatedAt: DateTime
}

type Query {
  modules(filter: ModuleFilter): [Module!]!
}

type Mutation {
  activateModule(moduleId: String!, config: JSON): ModuleActivation!
  deactivateModule(moduleId: String!): ModuleActivation!
}
```

## 5. Estratégia de erro silencioso vs explícito

| Situação | Comportamento |
|----------|---------------|
| Manifesto inválido no startup | Log + ignora módulo + shell sobe normalmente |
| Manifesto válido mas SDK incompatível | Log + entrada em `module_registry` com flag `incompatible = true` + módulo não aparece no catálogo |
| Migração do módulo falha na ativação | Transação roda back, retorna 500, registra em `audit_log` |
| `onActivate` lança exceção | Mesma estratégia: rollback + erro 500 + audit |

## 6. Idempotência

| Endpoint | Idempotente | Como |
|----------|-------------|------|
| GET | sim | natural |
| POST `/activate` | sim | `ALREADY_ACTIVE` 409 em vez de mudar estado |
| POST `/deactivate` | sim | nop em módulo já inativo |

## 7. Auditoria

Cada ativação/desativação gera linha em `audit_log` com `action ∈ {module.activated, module.deactivated, module.disabled_globally}` e `metadata.module_id`.

## 8. Limites e performance

- Discovery roda síncrono no startup; aceitar até 5s para até 50 módulos.
- Ativação de módulo bloqueia o request até as migrações terminarem (lock pessimista em `module_activation` por `(workspace_id, module_id)`).
- Listagem de catálogo é cacheada por 60s.
