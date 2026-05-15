import * as jose from 'jose';
import * as crypto from 'crypto';

/**
 * JwtService — Emissão e verificação de tokens JWT com EdDSA (Ed25519).
 *
 * - Algoritmo: EdDSA (Ed25519) — assinatura determinística, chave pequena
 * - Header: { alg: 'EdDSA', kid: '<key-id>' }
 * - Claims mínimos: sub (userId), wid (workspaceId), roles, iat, exp
 * - Store de chaves rotacionável via KeyStore
 *
 * Ref: data-delta.md §3.3, _reversa_sdd/domain.md RN-7
 */

const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_HINT_TTL = '7d'; // apenas para payload — rotação real via RefreshTokenService

export interface JwtPayload {
  sub: string;       // userId
  wid: string;       // workspaceId
  roles: string[];
  iat?: number;
  exp?: number;
}

export interface KeyPair {
  kid: string;
  privateKey: jose.KeyLike;
  publicKey: jose.KeyLike;
}

/**
 * KeyStore em memória — em produção, substituir por leitura de secrets manager.
 * Suporta múltiplas chaves para rotação gradual.
 */
export class InMemoryKeyStore {
  private keys: Map<string, KeyPair> = new Map();
  private currentKid: string | null = null;

  async addKey(kid?: string): Promise<KeyPair> {
    const { privateKey, publicKey } = await jose.generateKeyPair('EdDSA');
    const id = kid ?? crypto.randomUUID();
    const pair: KeyPair = { kid: id, privateKey, publicKey };
    this.keys.set(id, pair);
    this.currentKid = id;
    return pair;
  }

  getKey(kid: string): KeyPair | undefined {
    return this.keys.get(kid);
  }

  getCurrentKey(): KeyPair {
    if (!this.currentKid) throw new Error('No keys in store');
    return this.keys.get(this.currentKid)!;
  }

  /** Lista todos os kid disponíveis (para JWKS endpoint) */
  listKids(): string[] {
    return Array.from(this.keys.keys());
  }
}

export class JwtService {
  constructor(private readonly keyStore: InMemoryKeyStore) {}

  /** Emite um access token JWT EdDSA */
  async sign(payload: JwtPayload): Promise<string> {
    const { kid, privateKey } = this.keyStore.getCurrentKey();
    return new jose.SignJWT({
      sub: payload.sub,
      wid: payload.wid,
      roles: payload.roles,
    })
      .setProtectedHeader({ alg: 'EdDSA', kid })
      .setIssuedAt()
      .setExpirationTime(ACCESS_TOKEN_TTL)
      .setIssuer('nattivus-eco')
      .sign(privateKey);
  }

  /**
   * Verifica e decodifica um JWT.
   * Faz lookup do kid no KeyStore para suportar rotação de chaves.
   */
  async verify(token: string): Promise<JwtPayload> {
    // Extrai kid do header sem verificar (necessário para buscar a chave)
    const decoded = jose.decodeProtectedHeader(token);
    const kid = decoded.kid;
    if (!kid) throw new Error('JWT missing kid header');

    const keyPair = this.keyStore.getKey(kid);
    if (!keyPair) throw new Error(`Unknown kid: ${kid}`);

    const { payload } = await jose.jwtVerify(token, keyPair.publicKey, {
      issuer: 'nattivus-eco',
      algorithms: ['EdDSA'],
    });

    return {
      sub: payload.sub as string,
      wid: payload['wid'] as string,
      roles: payload['roles'] as string[],
      iat: payload.iat,
      exp: payload.exp,
    };
  }
}
