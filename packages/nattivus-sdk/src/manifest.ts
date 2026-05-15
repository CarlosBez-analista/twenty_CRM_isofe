export type ModuleLifecycleHook = (
  context: ModuleLifecycleContext,
) => Promise<void> | void;

export type ModuleLifecycleContext = {
  workspaceId: string;
  moduleId: string;
};

export type EntitySpec = {
  name: string;
  tableName: string;
  workspaceScoped: boolean;
};

export type RouteSpec = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  permission?: string;
};

export type IModuleManifest = {
  id: string;
  name: string;
  version: string;
  sdkVersion: string;
  entities?: EntitySpec[];
  routes?: RouteSpec[];
  permissions?: string[];
  dependencies?: string[];
};

export type IModule = {
  manifest: IModuleManifest;
  onActivate?: ModuleLifecycleHook;
  onDeactivate?: ModuleLifecycleHook;
};

export const createManifest = (
  manifest: IModuleManifest,
): IModuleManifest => manifest;

export const defineEntity = (entity: EntitySpec): EntitySpec => entity;
