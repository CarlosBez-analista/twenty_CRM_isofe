import * as crypto from 'crypto';
import { Client } from 'pg';

/**
 * RefreshTokenService — Rotação obrigatória de refresh tokens.
 *
 * Padrão: token opaco (32 bytes hex) armazenado como hash SHA-256.
 * Detecção de reutilização: se um token revogado é apresentado,
 * toda a família do usuário é revogada (Token Rotation + Reuse Detection).
 *
 * Ref: data-delta.md §2.4 + §3.4, _reversa_sdd/domain.md RN-7
 */

const TOKEN_BYTES = 32;
const TOKEN_TTL_DAYS = 7;

export interface RefreshTokenRecord {
  id: string;
  userId: string;
  tokenHash: string;
  issuedAt: Date;
  expiresAt: Date;
  revokedAt: Date | null;
  deviceFingerprint: string | null;
}

export class RefreshTokenService {
  constructor(private readonly client: Client) {}

  /** Gera um token opaco e o armazena como hash SHA-256 */
  async issue(params: {
    userId: string;
    deviceFingerprint?: string;
  }): Promise<{ token: string; record: RefreshTokenRecord }> {
    const token = crypto.randomBytes(TOKEN_BYTES).toString('hex');
    const tokenHash = this.hashToken(token);
    const expiresAt = new Date(Date.now() + TOKEN_TTL_DAYS * 86400 * 1000);

    const { rows } = await this.client.query<RefreshTokenRecord>(
      `INSERT INTO refresh_token (user_id, token_hash, expires_at, device_fingerprint)
       VALUES ($1, $2, $3, $4)
       RETURNING id, user_id AS "userId", token_hash AS "tokenHash",
                 issued_at AS "issuedAt", expires_at AS "expiresAt",
                 revoked_at AS "revokedAt", device_fingerprint AS "deviceFingerprint"`,
      [params.userId, tokenHash, expiresAt, params.deviceFingerprint ?? null],
    );

    return { token, record: rows[0] };
  }

  /**
   * Rotaciona um refresh token:
   * 1. Busca pelo hash do token apresentado
   * 2. Se já revogado → reuse detectado → revoga toda a família do user
   * 3. Se válido → revoga o atual, emite novo
   */
  async rotate(
    token: string,
    deviceFingerprint?: string,
  ): Promise<{ token: string; record: RefreshTokenRecord }> {
    const tokenHash = this.hashToken(token);

    const { rows } = await this.client.query<RefreshTokenRecord>(
      `SELECT id, user_id AS "userId", token_hash AS "tokenHash",
              issued_at AS "issuedAt", expires_at AS "expiresAt",
              revoked_at AS "revokedAt", device_fingerprint AS "deviceFingerprint"
       FROM refresh_token WHERE token_hash = $1`,
      [tokenHash],
    );

    const existing = rows[0];
    if (!existing) throw new Error('Refresh token not found');

    if (existing.revokedAt !== null) {
      // Reuse detectado — revoga toda a família do usuário
      await this.revokeAllForUser(existing.userId);
      throw new Error('Refresh token reuse detected — all sessions revoked');
    }

    if (existing.expiresAt < new Date()) {
      await this.revoke(existing.id);
      throw new Error('Refresh token expired');
    }

    // Rotaciona: revoga o atual e emite novo
    await this.revoke(existing.id);
    return this.issue({ userId: existing.userId, deviceFingerprint });
  }

  /** Revoga um token específico por ID */
  async revoke(id: string): Promise<void> {
    await this.client.query(
      `UPDATE refresh_token SET revoked_at = now() WHERE id = $1`,
      [id],
    );
  }

  /** Revoga todos os tokens ativos de um usuário (logout de todas as sessões) */
  async revokeAllForUser(userId: string): Promise<void> {
    await this.client.query(
      `UPDATE refresh_token SET revoked_at = now()
       WHERE user_id = $1 AND revoked_at IS NULL`,
      [userId],
    );
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
