import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { getRequirePermission } from '@nattivus/sdk';

/**
 * PermissionGuard — Verifica flags de permissão do usuário.
 *
 * Lê metadados definidos pelo @RequirePermission(...flags) do SDK.
 * Verifica se o usuário possui TODAS as flags requeridas nos seus roles.
 *
 * Convenção de roles:
 *   Roles armazenados em workspace_member.roles são string[] como:
 *   ['admin', 'crm:read', 'crm:write', 'nattivus.crm:contact:delete']
 *   A verificação é feita por includes() — sem wildcard por ora.
 *
 * Ref: _reversa_sdd/domain.md RN-12 (pipeline guard 2/3)
 */
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const handler = context.getHandler();
    const requiredFlags = getRequirePermission(handler);

    if (!requiredFlags || requiredFlags.length === 0) {
      return true; // Sem requisito de permissão
    }

    const req = context.switchToHttp().getRequest<Request>();
    const userRoles: string[] = req.userRoles ?? [];

    // 'admin' tem acesso irrestrito
    if (userRoles.includes('admin')) return true;

    const hasAll = requiredFlags.every((flag) => userRoles.includes(flag));
    if (!hasAll) {
      const missing = requiredFlags.filter((f) => !userRoles.includes(f));
      throw new ForbiddenException(
        `Missing permissions: ${missing.join(', ')}`,
      );
    }

    return true;
  }
}
