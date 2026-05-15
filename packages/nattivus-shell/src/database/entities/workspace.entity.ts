import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from '@nattivus/shared';

import { ModuleActivationEntity } from './module-activation.entity';
import { WorkspaceMemberEntity } from './workspace-member.entity';

@Entity({ name: 'workspace' })
export class WorkspaceEntity extends BaseEntity {
  @Column({ type: 'citext', unique: true })
  slug!: string;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text', default: 'active' })
  status!: string;

  @OneToMany(() => WorkspaceMemberEntity, (member) => member.workspace)
  members!: WorkspaceMemberEntity[];

  @OneToMany(() => ModuleActivationEntity, (activation) => activation.workspace)
  moduleActivations!: ModuleActivationEntity[];
}
