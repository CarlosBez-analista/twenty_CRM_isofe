import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

/**
 * BackupCodeService — Geração e consumo de códigos de backup MFA.
 *
 * - Gera 10 códigos opacos (8 bytes hex = 16 chars, fácil de ler)
 * - Hash bcrypt cost 12 para armazenamento
 * - Consumo atômico (um por uso)
 * - Revogação de toda a família em troca de novos códigos
 *
 * Ref: data-delta.md §2.3, _reversa_sdd/domain.md RN-8
 */

const BCRYPT_COST = 12;
const CODE_BYTES = 8;    // 16 hex chars por código
const CODE_COUNT = 10;

export interface BackupCodePair {
  /** Código em plaintext (exibir uma vez ao usuário) */
  plaintext: string;
  /** Hash bcrypt para armazenar no banco */
  hash: string;
}

export class BackupCodeService {
  /**
   * Gera um conjunto de 10 backup codes com seus hashes.
   * Os hashes devem ser armazenados; os plaintexts exibidos uma única vez.
   */
  async generateCodes(): Promise<BackupCodePair[]> {
    const pairs: BackupCodePair[] = [];
    for (let i = 0; i < CODE_COUNT; i++) {
      const plaintext = crypto.randomBytes(CODE_BYTES).toString('hex');
      const hash = await bcrypt.hash(plaintext, BCRYPT_COST);
      pairs.push({ plaintext, hash });
    }
    return pairs;
  }

  /**
   * Verifica se um código plaintext corresponde a um hash armazenado.
   */
  async verify(plaintext: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(plaintext, hash);
    } catch {
      return false;
    }
  }

  /**
   * Formata um código de backup para exibição amigável:
   * "abcd1234efgh5678" → "ABCD-1234-EFGH-5678"
   */
  formatCode(plaintext: string): string {
    return plaintext
      .toUpperCase()
      .match(/.{4}/g)
      ?.join('-') ?? plaintext;
  }

  /**
   * Normaliza a entrada do usuário antes de verificar
   * (remove hífens e converte para lowercase).
   */
  normalizeInput(input: string): string {
    return input.replace(/-/g, '').toLowerCase().trim();
  }
}
