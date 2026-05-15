import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '@nattivus/shared';

import { UserEntity } from './user.entity';

@Entity({ name: 'refresh_token' })
export class RefreshTokenEntity extends BaseEntity {
  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({ name: 'family_id', type: 'uuid' })
  familyId!: string;

  @Column({ name: 'token_hash', type: 'text', unique: true })
  tokenHash!: string;

  @Column({ name: 'replaced_by_token_id', type: 'uuid', nullable: true })
  replacedByTokenId?: string | null;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt!: Date;

  @Column({ name: 'revoked_at', type: 'timestamptz', nullable: true })
  revokedAt?: Date | null;

  @ManyToOne(() => UserEntity, (user) => user.refreshTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;
}
