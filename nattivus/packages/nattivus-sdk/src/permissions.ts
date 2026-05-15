/**
 * Sistema de permissões do NattivusECO.
 *
 * PermissionFlag é string literal (não enum) — segue princípio do legado
 * (_reversa_sdd/permissions.md): strings literais sobre enums para extensibilidade.
 *
 * Decorators para guards NestJS no shell.
 * Referência: _reversa_sdd/domain.md#regra-12 (pipeline de 3 guards)
 */

/** Tipo para flags de permissão — string literal extensível */
export type PermissionFlag = string;

/** Helper para declarar uma permissão com namespace */
export function definePermission(moduleId: string, action: string): PermissionFlag {
  return `${moduleId}:${action}`;
}

// ─── Decorators (metadata keys para guards NestJS) ──────────────────

const REQUIRE_AUTH_KEY = 'nattivus:require-auth';
const REQUIRE_PERMISSION_KEY = 'nattivus:require-permission';
const REQUIRE_DOMAIN_KEY = 'nattivus:require-domain';

/**
 * @RequireAuth() — Marca o handler como requerendo autenticação JWT.
 * O AuthGuard do shell valida o token e popula request.user.
 */
export function RequireAuth(): MethodDecorator & ClassDecorator {
  return (target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) => {
    if (propertyKey && descriptor) {
      Reflect.defineMetadata(REQUIRE_AUTH_KEY, true, descriptor.value);
    } else {
      Reflect.defineMetadata(REQUIRE_AUTH_KEY, true, target);
    }
  };
}

/**
 * @RequirePermission(...flags) — Exige que o usuário tenha TODAS as flags listadas.
 * O PermissionGuard do shell verifica contra os roles do workspace_member.
 */
export function RequirePermission(...flags: PermissionFlag[]): MethodDecorator & ClassDecorator {
  return (target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) => {
    if (propertyKey && descriptor) {
      Reflect.defineMetadata(REQUIRE_PERMISSION_KEY, flags, descriptor.value);
    } else {
      Reflect.defineMetadata(REQUIRE_PERMISSION_KEY, flags, target);
    }
  };
}

/** Especificação de regra de domínio para DomainGuard */
export interface DomainRuleSpec {
  /** Identificador da regra */
  ruleId: string;
  /** Descrição legível */
  description: string;
  /** Handler que avalia a regra (implementado pelo módulo) */
  evaluate: (context: { userId: string; workspaceId: string; params: Record<string, unknown> }) => Promise<boolean>;
}

/**
 * @RequireDomain(rule) — Exige que uma regra de negócio do domínio seja satisfeita.
 * O DomainGuard do shell delega ao handler do módulo.
 */
export function RequireDomain(rule: DomainRuleSpec): MethodDecorator {
  return (_target: any, _propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(REQUIRE_DOMAIN_KEY, rule, descriptor.value);
    return descriptor;
  };
}

/** Utilitários para guards lerem os metadados */
export function getRequireAuth(target: any): boolean {
  return Reflect.getMetadata(REQUIRE_AUTH_KEY, target) ?? false;
}

export function getRequirePermission(target: any): PermissionFlag[] {
  return Reflect.getMetadata(REQUIRE_PERMISSION_KEY, target) ?? [];
}

export function getRequireDomain(target: any): DomainRuleSpec | undefined {
  return Reflect.getMetadata(REQUIRE_DOMAIN_KEY, target);
}
