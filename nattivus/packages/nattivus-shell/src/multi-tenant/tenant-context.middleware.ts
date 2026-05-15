import { Injectable, NestMiddleware, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Client } from 'pg';
import { JwtService } from '../auth/jwt.service';

/**
 * TenantContextMiddleware — Multi-tenancy via header X-Workspace-Id.
 *
 * Para cada request autenticado:
 * 1. Extrai workspace do header X-Workspace-Id
 * 2. Valida que o usuário é membro do workspace
 * 3. Injeta SET LOCAL app.workspace_id e app.user_id na conexão
 *    para ativar RLS e auditoria automática
 *
 * Ref: data-delta.md §5 (RLS), _reversa_sdd/domain.md RN-3 (isolamento)
 */

declare module 'express' {
  interface Request {
    userId?: string;
    workspaceId?: string;
    userRoles?: string[];
  }
}

@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly dbClient: Client,
  ) {}

  async use(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.slice(7);
    try {
      const payload = await this.jwtService.verify(token);
      req.userId = payload.sub;
      req.userRoles = payload.roles;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const workspaceId = req.headers['x-workspace-id'] as string | undefined;
    if (!workspaceId) {
      // Sem header → apenas usuário autenticado, sem contexto de workspace
      return next();
    }

    // Valida membership
    const { rowCount } = await this.dbClient.query(
      `SELECT 1 FROM workspace_member
       WHERE workspace_id = $1 AND user_id = $2
         AND accepted_at IS NOT NULL AND deleted_at IS NULL`,
      [workspaceId, req.userId],
    );

    if (!rowCount) {
      throw new ForbiddenException('User is not a member of this workspace');
    }

    req.workspaceId = workspaceId;

    // Injeta contexto no request storage (sem SET LOCAL aqui — feito por interceptor de DataSource)
    // O DataSourceInterceptor chama SET LOCAL na conexão real do ORM.
    // Para o request context, expõe em req para os services usarem.
    next();
  }
}
