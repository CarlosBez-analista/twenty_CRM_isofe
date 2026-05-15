import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { getRequireDomain, type DomainRuleSpec } from '@nattivus/sdk';

/**
 * DomainGuard — Avalia regras de negócio definidas por @RequireDomain(rule).
 *
 * Delega para o handler `evaluate()` definido pelo próprio módulo.
 * Isso permite que módulos de domínio implementem regras complexas
 * (ex: "só o gerente da empresa pode aprovar pedidos acima de X")
 * sem depender do shell.
 *
 * Ref: _reversa_sdd/domain.md RN-12 (pipeline guard 3/3)
 *      SDK: DomainRuleSpec
 */
@Injectable()
export class DomainGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler();
    const rule: DomainRuleSpec | undefined = getRequireDomain(handler);

    if (!rule) return true; // Sem regra de domínio definida

    const req = context.switchToHttp().getRequest<Request>();

    if (!req.userId || !req.workspaceId) {
      throw new ForbiddenException('Domain rule requires authenticated workspace context');
    }

    const allowed = await rule.evaluate({
      userId: req.userId,
      workspaceId: req.workspaceId,
      params: req.params as Record<string, unknown>,
    });

    if (!allowed) {
      throw new ForbiddenException(`Domain rule violated: ${rule.ruleId}`);
    }

    return true;
  }
}
