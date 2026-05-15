import { Client } from 'pg';

/**
 * UserService — CRUD de usuários e gerenciamento de estado de autenticação.
 *
 * Responsabilidades:
 * - Criar usuário com status 'pending'
 * - Buscar por email (case-insensitive via citext)
 * - Controlar lock por tentativas de login
 * - Marcar enrollment MFA
 *
 * Ref: data-delta.md §2.1, _reversa_sdd/domain.md RN-9 (lock após 5 tentativas)
 */

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  status: 'pending' | 'active' | 'disabled';
  mfaEnrolledAt: Date | null;
  lastLoginAt: Date | null;
  failedLoginCount: number;
  lockedUntil: Date | null;
}

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MINUTES = 15;

export class UserService {
  constructor(private readonly client: Client) {}

  /** Cria um novo usuário com status 'pending' */
  async create(params: { email: string; passwordHash: string }): Promise<User> {
    const { rows } = await this.client.query<User>(
      `INSERT INTO "user" (email, password_hash, status)
       VALUES ($1, $2, 'pending')
       RETURNING id, email, password_hash AS "passwordHash", status,
                 mfa_enrolled_at AS "mfaEnrolledAt", last_login_at AS "lastLoginAt",
                 failed_login_count AS "failedLoginCount", locked_until AS "lockedUntil"`,
      [params.email, params.passwordHash],
    );
    return rows[0];
  }

  /** Busca usuário por email (citext: case-insensitive) */
  async findByEmail(email: string): Promise<User | null> {
    const { rows } = await this.client.query<User>(
      `SELECT id, email, password_hash AS "passwordHash", status,
              mfa_enrolled_at AS "mfaEnrolledAt", last_login_at AS "lastLoginAt",
              failed_login_count AS "failedLoginCount", locked_until AS "lockedUntil"
       FROM "user" WHERE email = $1 AND deleted_at IS NULL`,
      [email],
    );
    return rows[0] ?? null;
  }

  /** Busca usuário por ID */
  async findById(id: string): Promise<User | null> {
    const { rows } = await this.client.query<User>(
      `SELECT id, email, password_hash AS "passwordHash", status,
              mfa_enrolled_at AS "mfaEnrolledAt", last_login_at AS "lastLoginAt",
              failed_login_count AS "failedLoginCount", locked_until AS "lockedUntil"
       FROM "user" WHERE id = $1 AND deleted_at IS NULL`,
      [id],
    );
    return rows[0] ?? null;
  }

  /** Ativa o usuário (confirma email) */
  async activate(id: string): Promise<void> {
    await this.client.query(
      `UPDATE "user" SET status = 'active' WHERE id = $1`,
      [id],
    );
  }

  /**
   * Registra tentativa de login mal-sucedida.
   * Após MAX_FAILED_ATTEMPTS, bloqueia por LOCK_DURATION_MINUTES.
   */
  async recordFailedLogin(id: string): Promise<void> {
    await this.client.query(
      `UPDATE "user"
       SET failed_login_count = failed_login_count + 1,
           locked_until = CASE
             WHEN failed_login_count + 1 >= $2
             THEN now() + ($3 || ' minutes')::interval
             ELSE locked_until
           END
       WHERE id = $1`,
      [id, MAX_FAILED_ATTEMPTS, LOCK_DURATION_MINUTES],
    );
  }

  /** Registra login bem-sucedido — reseta contadores */
  async recordSuccessfulLogin(id: string): Promise<void> {
    await this.client.query(
      `UPDATE "user"
       SET failed_login_count = 0,
           locked_until = NULL,
           last_login_at = now()
       WHERE id = $1`,
      [id],
    );
  }

  /** Verifica se o usuário está bloqueado */
  isLocked(user: User): boolean {
    if (!user.lockedUntil) return false;
    return user.lockedUntil > new Date();
  }

  /** Marca enrollment MFA como concluído */
  async markMfaEnrolled(id: string): Promise<void> {
    await this.client.query(
      `UPDATE "user" SET mfa_enrolled_at = now() WHERE id = $1`,
      [id],
    );
  }
}
