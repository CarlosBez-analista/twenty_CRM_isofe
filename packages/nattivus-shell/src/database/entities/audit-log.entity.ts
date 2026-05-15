import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'audit_log' })
export class AuditLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'workspace_id', type: 'uuid', nullable: true })
  workspaceId?: string | null;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId?: string | null;

  @Column({ name: 'request_id', type: 'text', nullable: true })
  requestId?: string | null;

  @Column({ type: 'text' })
  action!: string;

  @Column({ name: 'entity_type', type: 'text', nullable: true })
  entityType?: string | null;

  @Column({ name: 'entity_id', type: 'uuid', nullable: true })
  entityId?: string | null;

  @Column({ type: 'jsonb', nullable: true })
  before?: Record<string, unknown> | null;

  @Column({ type: 'jsonb', nullable: true })
  after?: Record<string, unknown> | null;

  @Column({ type: 'jsonb', default: () => "'{}'::jsonb" })
  metadata!: Record<string, unknown>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
