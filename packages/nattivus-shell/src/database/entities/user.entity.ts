import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from '@nattivus/shared';

import { BackupCodeEntity } from './backup-code.entity';
import { MfaSecretEntity } from './mfa-secret.entity';
import { RefreshTokenEntity } from './refresh-token.entity';
import { WorkspaceMemberEntity } from './workspace-member.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @Column({ type: 'citext', unique: true })
  email!: string;

  @Column({ name: 'password_hash', type: 'text' })
  passwordHash!: string;

  @Column({ name: 'failed_login_count', type: 'int', default: 0 })
  failedLoginCount!: number;

  @Column({ name: 'locked_until', type: 'timestamptz', nullable: true })
  lockedUntil?: Date | null;

  @Column({ name: 'mfa_enrolled_at', type: 'timestamptz', nullable: true })
  mfaEnrolledAt?: Date | null;

  @OneToMany(() => WorkspaceMemberEntity, (member) => member.user)
  workspaceMembers!: WorkspaceMemberEntity[];

  @OneToMany(() => MfaSecretEntity, (secret) => secret.user)
  mfaSecrets!: MfaSecretEntity[];

  @OneToMany(() => BackupCodeEntity, (code) => code.user)
  backupCodes!: BackupCodeEntity[];

  @OneToMany(() => RefreshTokenEntity, (token) => token.user)
  refreshTokens!: RefreshTokenEntity[];
}
