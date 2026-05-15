import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { WorkspaceScopedEntity } from '@nattivus/shared';

import { UserEntity } from './user.entity';
import { WorkspaceEntity } from './workspace.entity';

@Entity({ name: 'workspace_member' })
@Unique('uq_workspace_member_user', ['workspaceId', 'userId'])
export class WorkspaceMemberEntity extends WorkspaceScopedEntity {
  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({ type: 'text', default: 'member' })
  role!: string;

  @Column({ name: 'invited_email', type: 'citext', nullable: true })
  invitedEmail?: string | null;

  @Column({ name: 'invited_at', type: 'timestamptz', nullable: true })
  invitedAt?: Date | null;

  @Column({ name: 'accepted_at', type: 'timestamptz', nullable: true })
  acceptedAt?: Date | null;

  @ManyToOne(() => WorkspaceEntity, (workspace) => workspace.members, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workspace_id' })
  workspace!: WorkspaceEntity;

  @ManyToOne(() => UserEntity, (user) => user.workspaceMembers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;
}
