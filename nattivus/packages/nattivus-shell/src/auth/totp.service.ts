import { authenticator } from 'otplib';
import * as crypto from 'crypto';

/**
 * TotpService — TOTP com otplib + criptografia AES-256-GCM para segredo em repouso.
 *
 * Fluxo de enrollment:
 *   1. generateSecret() → { secret, otpauthUrl, qrDataUrl? }
 *   2. Usuário escaneia QR e confirma com verifyToken()
 *   3. encryptSecret(secret) → armazena em mfa_secret.secret_encrypted
 *
 * Fluxo de verificação:
 *   1. decryptSecret(secret_encrypted) → secret
 *   2. verifyToken(token, secret) → boolean
 *
 * Ref: _reversa_sdd/domain.md RN-8 (MFA obrigatório para enterprise)
 *      data-delta.md §3.2
 */

const TOTP_ALGORITHM = 'SHA1';
const TOTP_DIGITS = 6;
const TOTP_PERIOD = 30;

// AES-256-GCM key from env (32 bytes em base64)
function getEncryptionKey(): Buffer {
  const key = process.env.MFA_SECRET_KEY;
  if (!key) throw new Error('MFA_SECRET_KEY env var is required');
  const buf = Buffer.from(key, 'base64');
  if (buf.length !== 32) throw new Error('MFA_SECRET_KEY must be 32 bytes (base64)');
  return buf;
}

export interface TotpEnrollment {
  /** Segredo Base32 em plaintext (jamais armazenar diretamente) */
  secret: string;
  /** URL otpauth:// para QR code */
  otpauthUrl: string;
}

export class TotpService {
  constructor() {
    authenticator.options = {
      algorithm: TOTP_ALGORITHM,
      digits: TOTP_DIGITS,
      step: TOTP_PERIOD,
    };
  }

  /** Gera um novo segredo TOTP e a URL otpauth:// correspondente */
  generateSecret(accountName: string, issuer = 'NattivusECO'): TotpEnrollment {
    const secret = authenticator.generateSecret(20); // 160 bits
    const otpauthUrl = authenticator.keyuri(accountName, issuer, secret);
    return { secret, otpauthUrl };
  }

  /**
   * Verifica um token TOTP contra um segredo Base32.
   * Aceita uma janela de ±1 período (30s) para tolerância de clock skew.
   */
  verifyToken(token: string, secret: string): boolean {
    try {
      return authenticator.verify({ token, secret });
    } catch {
      return false;
    }
  }

  /**
   * Criptografa o segredo TOTP com AES-256-GCM para armazenamento em banco.
   * Retorna Buffer contendo: iv(12) + authTag(16) + ciphertext.
   */
  encryptSecret(secret: string): Buffer {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(secret, 'utf-8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    // Layout: [iv:12][authTag:16][ciphertext:N]
    return Buffer.concat([iv, authTag, encrypted]);
  }

  /**
   * Decriptografa o segredo TOTP armazenado em banco.
   */
  decryptSecret(encryptedBuffer: Buffer): string {
    const key = getEncryptionKey();
    const iv = encryptedBuffer.subarray(0, 12);
    const authTag = encryptedBuffer.subarray(12, 28);
    const ciphertext = encryptedBuffer.subarray(28);
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    return decipher.update(ciphertext).toString('utf-8') + decipher.final('utf-8');
  }
}
