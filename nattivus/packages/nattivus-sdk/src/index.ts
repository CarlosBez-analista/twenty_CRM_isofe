// @nattivus/sdk — SDK público para extensões NattivusECO
export type { IModule, IModuleManifest, EntitySpec, RouteSpec } from './manifest';
export { createManifest, defineEntity } from './manifest';

export type { PermissionFlag, DomainRuleSpec } from './permissions';
export { definePermission, RequireAuth, RequirePermission, RequireDomain } from './permissions';
export { getRequireAuth, getRequirePermission, getRequireDomain } from './permissions';

export type { ShellClient, SemanticSearchResult, WorkspaceInfo, UserInfo } from './shell-client';
