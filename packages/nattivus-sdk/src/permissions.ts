export type PermissionFlag = `${string}.${string}`;

export type DomainRuleSpec = {
  name: string;
  args?: Record<string, unknown>;
};

export type AuthRequirement =
  | { type: 'auth' }
  | { type: 'permission'; flag: PermissionFlag }
  | { type: 'domain'; rule: DomainRuleSpec };

const REQUIREMENTS = Symbol.for('nattivus:requirements');

const pushRequirement = (
  target: object,
  requirement: AuthRequirement,
): void => {
  const current = Reflect.get(target, REQUIREMENTS) as
    | AuthRequirement[]
    | undefined;

  Reflect.set(target, REQUIREMENTS, [...(current ?? []), requirement]);
};

export const definePermission = (flag: PermissionFlag): PermissionFlag => flag;

export const RequireAuth = () => (target: object): void => {
  pushRequirement(target, { type: 'auth' });
};

export const RequirePermission =
  (flag: PermissionFlag) =>
  (target: object): void => {
    pushRequirement(target, { type: 'permission', flag });
  };

export const RequireDomain =
  (rule: DomainRuleSpec) =>
  (target: object): void => {
    pushRequirement(target, { type: 'domain', rule });
  };
