import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';

/**
 * T064: Rate Limit Guard para endpoints de Autenticação
 * 
 * Limita tentativas brutas:
 * - 10 requests por minuto por IP globalmente em /auth
 * - 5 requests por minuto por Email na rota de Login
 * - Cooldown de 60s em caso de estouro.
 * 
 * Implementação baseada em memória para a Fase 5. 
 * Num cenário distribuído, isso deve ser adaptado para usar Redis 
 * (que já é conectado no main.ts).
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

@Injectable()
export class AuthRateLimitGuard implements CanActivate {
  private readonly ipMap = new Map<string, RateLimitRecord>();
  private readonly emailMap = new Map<string, RateLimitRecord>();

  private readonly IP_LIMIT = 10;
  private readonly EMAIL_LIMIT = 5;
  private readonly WINDOW_MS = 60 * 1000;

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const email = req.body?.email?.toLowerCase();
    
    const now = Date.now();

    // 1. Checagem por IP (Geral)
    if (!this.checkLimit(this.ipMap, ip, this.IP_LIMIT, now)) {
      throw new HttpException('Too Many Requests from this IP', HttpStatus.TOO_MANY_REQUESTS);
    }

    // 2. Checagem por Email (Login específico)
    if (email && req.path.includes('/login')) {
      if (!this.checkLimit(this.emailMap, email, this.EMAIL_LIMIT, now)) {
        throw new HttpException('Too Many Login Attempts for this account', HttpStatus.TOO_MANY_REQUESTS);
      }
    }

    return true;
  }

  private checkLimit(store: Map<string, RateLimitRecord>, key: string, limit: number, now: number): boolean {
    let record = store.get(key);

    if (!record || record.resetTime < now) {
      record = { count: 1, resetTime: now + this.WINDOW_MS };
      store.set(key, record);
      return true;
    }

    if (record.count >= limit) {
      return false;
    }

    record.count += 1;
    return true;
  }
}
