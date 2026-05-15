import { DataSource, EntitySchema } from 'typeorm';

import {
  AuditLogEntity,
  BackupCodeEntity,
  MfaSecretEntity,
  ModuleActivationEntity,
  ModuleRegistryEntity,
  RefreshTokenEntity,
  UserEntity,
  VectorIndexRegistryEntity,
  WorkspaceEntity,
  WorkspaceMemberEntity,
} from './entities';

export type DynamicEntity = Function | string | EntitySchema;

export const coreEntities: DynamicEntity[] = [
  AuditLogEntity,
  BackupCodeEntity,
  MfaSecretEntity,
  ModuleActivationEntity,
  ModuleRegistryEntity,
  RefreshTokenEntity,
  UserEntity,
  VectorIndexRegistryEntity,
  WorkspaceEntity,
  WorkspaceMemberEntity,
];

export const loadModuleEntities = (): DynamicEntity[] => {
  return [];
};

export const createDataSource = (
  extraEntities: DynamicEntity[] = loadModuleEntities(),
) =>
  new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [...coreEntities, ...extraEntities],
    migrations: [],
    synchronize: false,
    logging: process.env.TYPEORM_LOGGING === 'true',
  });

export const AppDataSource = createDataSource();
