import * as argon2 from 'argon2';

/**
 * PasswordService — Hashing e verificação de senhas com Argon2id.
 *
 * Parâmetros per data-delta.md §3.1:
 *   memoryCost = 65536 (64 MB)
 *   timeCost   = 3
 *   parallelism = 4
 *   type       = argon2id
 *
 * Ref: _reversa_sdd/domain.md RN-7 (Autenticação segura)
 */

export const ARGON2_OPTIONS: argon2.Options & { raw: false } = {
  type: argon2.argon2id,
  memoryCost: 65536,   // 64 MB
  timeCost: 3,
  parallelism: 4,
  raw: false,
};

export class PasswordService {
  /**
   * Gera um hash Argon2id da senha fornecida.
   * O salt é gerado automaticamente pelo argon2 (16 bytes).
   */
  async hash(plaintext: string): Promise<string> {
    return argon2.hash(plaintext, ARGON2_OPTIONS);
  }

  /**
   * Verifica uma senha em plaintext contra um hash Argon2id armazenado.
   * Retorna true somente se a senha corresponder.
   */
  async verify(hash: string, plaintext: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, plaintext, ARGON2_OPTIONS);
    } catch {
      // hash malformado ou algoritmo diferente — trata como inválido
      return false;
    }
  }

  /**
   * Verifica se o hash precisa ser re-hashado (parâmetros desatualizados).
   * Útil para migração silenciosa de hashes legados.
   */
  needsRehash(hash: string): boolean {
    return argon2.needsRehash(hash, ARGON2_OPTIONS);
  }
}
