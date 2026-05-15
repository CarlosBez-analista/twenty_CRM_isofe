import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { WorkspaceScopedEntity } from '@nattivus/shared';

import { ModuleRegistryEntity } from './module-registry.entity';
import { WorkspaceEntity } from './workspace.entity';

@Entity({ name: 'module_activation' })
@Unique('uq_module_activation_workspace_module', [
  'workspaceId',
  'moduleRegistryId',
])
export class ModuleActivationEntity extends WorkspaceScopedEntity {
  @Column({ name: 'module_registry_id', type: 'uuid' })
  moduleRegistryId!: string;

  @Column({ type: 'text', default: 'active' })
  status!: string;

  @Column({ name: 'activated_at', type: 'timestamptz', default: () => 'now()' })
  activatedAt!: Date;

  @Column({ name: 'deactivated_at', type: 'timestamptz', nullable: true })
  deactivatedAt?: Date | null;

  @Column({ type: 'jsonb', default: () => "'{}'::jsonb" })
  config!: Record<string, unknown>;

  @ManyToOne(() => WorkspaceEntity, (workspace) => workspace.moduleActivations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workspace_id' })
  workspace!: WorkspaceEntity;

  @ManyToOne(() => ModuleRegistryEntity, (module) => module.activations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'module_registry_id' })
  module!: ModuleRegistryEntity;
}
