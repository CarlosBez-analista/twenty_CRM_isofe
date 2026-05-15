import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

/**
 * AuthGuard — Verifica que o request possui userId populado pelo TenantContextMiddleware.
 *
 * O middleware já validou o JWT; este guard apenas garante que o handler
 * requer autenticação (via @RequireAuth() do SDK).
 *
 * Ref: _reversa_sdd/domain.md RN-12 (pipeline de 3 guards)
 */
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    if (!req.userId) {
      throw new UnauthorizedException('Authentication required');
    }
    return true;
  }
}
