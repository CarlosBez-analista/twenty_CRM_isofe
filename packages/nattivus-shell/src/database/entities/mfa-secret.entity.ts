import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '@nattivus/shared';

import { UserEntity } from './user.entity';

@Entity({ name: 'mfa_secret' })
export class MfaSecretEntity extends BaseEntity {
  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({ name: 'secret_encrypted', type: 'text' })
  secretEncrypted!: string;

  @ManyToOne(() => UserEntity, (user) => user.mfaSecrets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;
}
