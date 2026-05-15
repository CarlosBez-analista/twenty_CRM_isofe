import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from '@nattivus/shared';

import { ModuleActivationEntity } from './module-activation.entity';

@Entity({ name: 'module_registry' })
export class ModuleRegistryEntity extends BaseEntity {
  @Column({ name: 'module_id', type: 'text', unique: true })
  moduleId!: string;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text' })
  version!: string;

  @Column({ name: 'sdk_version', type: 'text' })
  sdkVersion!: string;

  @Column({ type: 'jsonb' })
  manifest!: Record<string, unknown>;

  @Column({ type: 'text', default: 'available' })
  status!: string;

  @Column({ name: 'incompatible_reason', type: 'text', nullable: true })
  incompatibleReason?: string | null;

  @Column({ name: 'discovered_at', type: 'timestamptz', default: () => 'now()' })
  discoveredAt!: Date;

  @OneToMany(() => ModuleActivationEntity, (activation) => activation.module)
  activations!: ModuleActivationEntity[];
}
