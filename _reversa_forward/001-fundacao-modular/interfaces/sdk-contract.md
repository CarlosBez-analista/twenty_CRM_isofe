# Interface: `@nattivus/sdk` — Contrato Público

> Tipo: pacote npm público (TypeScript)
> Versionamento: SemVer 2.0 estrito
> Confidência: 🟢 (decisão D-15)

## 1. Propósito

Permitir que terceiros construam módulos do NattivusECO **fora do monorepo principal**, satisfazendo o contrato `IModule` e consumindo as APIs do shell de forma type-safe. O SDK é o **único ponto de extensão público** — o restante do código (shell, módulos comerciais Nattivus) permanece privado.

## 2. Exports principais

```ts
// Tipos
export interface IModule { /* ver §3 */ }
export interface IModuleManifest { /* ver §4 */ }
export type PermissionFlag = string;  // string literal, não enum (princípio do legado)
export abstract class BaseEntity { /* ver §5 */ }

// Helpers
export function createManifest(input: ManifestInput): IModuleManifest;
export function defineEntity<T extends BaseEntity>(spec: EntitySpec<T>): EntityDescriptor<T>;
export function definePermission(flag: PermissionFlag, label: string, description?: string): PermissionDescriptor;
export function defineRoute(spec: RouteSpec): RouteDescriptor;

// Decorators (NestJS-compatíveis para módulos backend)
export function RequireAuth(): MethodDecorator;
export function RequirePermission(flag: PermissionFlag): MethodDecorator;
export function RequireDomain(rule: DomainRuleSpec): MethodDecorator;

// Cliente do shell (para uso runtime dentro de módulos)
export interface ShellClient {
  semanticSearch(input: SemanticSearchInput): Promise<SemanticSearchResult[]>;
  registerVectorIndex(spec: VectorIndexSpec): Promise<void>;
  audit(action: string, metadata?: Record<string, unknown>): Promise<void>;
  getCurrentWorkspace(): WorkspaceContext;
  getCurrentUser(): UserContext;
}
```

## 3. `IModule` — contrato central

```ts
export interface IModule {
  id: string;                       // ex: 'nattivus.crm.core', 'partner.foo.bar'
  version: string;                  // SemVer
  displayName: string;
  description?: string;
  dependencies?: string[];          // ['nattivus.shell@^1.0.0']
  permissions: PermissionDescriptor[];
  entities: EntityDescriptor<BaseEntity>[];
  routes?: RouteDescriptor[];       // se o módulo expõe HTTP
  workflows?: WorkflowDescriptor[]; // se o módulo registra automações
  migrations: MigrationDescriptor[]; // migrações próprias do módulo
  onActivate?: (ctx: ActivationContext) => Promise<void>;
  onDeactivate?: (ctx: ActivationContext) => Promise<void>;
}
```

## 4. `IModuleManifest` — formato persistido

```ts
export interface IModuleManifest {
  id: string;
  version: string;
  displayName: string;
  description?: string;
  dependencies: string[];
  permissions: { flag: string; label: string; description?: string }[];
  entityIds: string[];              // standardIds estáveis das entidades
  routeCount: number;
  workflowCount: number;
  migrationCount: number;
  sdkVersion: string;               // versão do @nattivus/sdk usado
  builtAt: string;                  // ISO 8601
}
```

Manifesto é gerado em build-time por `createManifest()` e exportado como `default` em `dist/module.manifest.js`. O shell faz glob por esse arquivo no startup (D-10).

## 5. `BaseEntity` — classe abstrata

```ts
export abstract class BaseEntity {
  id: string;                       // uuid
  workspaceId: string;              // multi-tenant
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  searchVector?: string;            // gerenciado por trigger
  position?: number;
}
```

Módulos estendem essa classe para definir suas entidades. Field decorators (`@Field`, `@Relation`, `@Index`) são herdados do TypeORM via re-export do SDK para garantir compatibilidade.

## 6. Política de versionamento

| Tipo de mudança | Bump | Exemplo |
|------------------|------|---------|
| Bug fix sem mudança de tipo | patch | `1.0.0 → 1.0.1` |
| Novo export, novo campo opcional | minor | `1.0.1 → 1.1.0` |
| Remoção de export, mudança de assinatura, campo obrigatório novo | major | `1.1.0 → 2.0.0` |
| Mudança que quebra serialização do manifesto | major | — |

Política de deprecação: símbolos marcados `@deprecated` ficam pelo menos **uma minor** antes de remoção em major.

## 7. Compatibilidade shell × SDK

| Shell version | SDK suportado | Comportamento |
|---------------|---------------|---------------|
| 1.x.x | 1.x.x | ✓ compatível |
| 2.x.x | 1.x.x | módulo rejeitado no discovery com log: `module 'x' uses sdk@1, shell requires sdk@2` |
| 1.x.x | 2.x.x (futuro com fallback) | rejeitado |

Critério: campo `sdkVersion` no manifesto comparado contra range suportado pelo shell (config). Mismatch = módulo não carrega, shell continua subindo.

## 8. Garantias mínimas do SDK v1

- Type definitions completas, sem `any` em exports públicos
- Tree-shakable (ESM + CJS dual export)
- Zero dependências runtime obrigatórias além de `reflect-metadata` e `tslib`
- Suporte Node 20+ e bundlers modernos (Vite, esbuild, webpack 5)
- Testado em CI contra Node 20 e Node 22

## 9. Anti-padrões — o que o SDK NUNCA exporta

- Acesso direto ao banco de dados
- Strings de conexão, segredos ou chaves
- Internals do shell (services, repositories, internal types)
- Helpers que dependem de processo do shell rodando localmente (módulos podem rodar em outro processo via gRPC futuro)

## 10. Exemplo mínimo de módulo externo

```ts
// my-partner-module/src/manifest.ts
import { createManifest, defineEntity, definePermission, BaseEntity } from '@nattivus/sdk';

class Lead extends BaseEntity {
  email: string;
  source: string;
}

export default createManifest({
  id: 'partner.foo.leads',
  version: '0.1.0',
  displayName: 'Partner Foo Leads',
  permissions: [definePermission('partner.foo.leads.read', 'Ver leads')],
  entities: [defineEntity({ class: Lead, standardId: '20260514-foo-lead-0001-000000000000' })],
  migrations: [/* ... */],
});
```

Após `yarn build`, o `dist/module.manifest.js` é descoberto pelo shell e o módulo fica disponível no catálogo do admin.
