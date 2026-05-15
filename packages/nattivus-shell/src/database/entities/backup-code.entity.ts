import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '@nattivus/shared';

import { UserEntity } from './user.entity';

@Entity({ name: 'backup_code' })
export class BackupCodeEntity extends BaseEntity {
  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({ name: 'code_hash', type: 'text' })
  codeHash!: string;

  @Column({ name: 'used_at', type: 'timestamptz', nullable: true })
  usedAt?: Date | null;

  @ManyToOne(() => UserEntity, (user) => user.backupCodes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;
}
