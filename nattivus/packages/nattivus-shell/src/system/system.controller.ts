import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Client } from 'pg';
import { AuthGuard } from '../auth/auth.guard';
import { UserService } from '../auth/user.service';
import { WorkspaceService } from '../workspace/workspace.service';

/**
 * MeController — Dados do usuário autenticado.
 * HealthController — Status de saúde dos serviços dependentes.
 *
 * GET /api/me      — usuário + workspaces ativos
 * GET /health      — status de db, redis, qdrant
 *
 * Ref: T055
 */

@UseGuards(AuthGuard)
@Controller('api/me')
export class MeController {
  constructor(
    private readonly userService: UserService,
    private readonly workspaceService: WorkspaceService,
  ) {}

  @Get()
  async me(@Req() req: Request) {
    const user = await this.userService.findById(req.userId!);
    if (!user) return { error: 'User not found' };

    return {
      id: user.id,
      email: user.email,
      status: user.status,
      mfaEnrolled: !!user.mfaEnrolledAt,
      lastLoginAt: user.lastLoginAt,
      currentWorkspaceId: req.workspaceId ?? null,
    };
  }
}

// ────────────────────────────────────────────────────────────────────

@Controller('health')
export class HealthController {
  constructor(
    private readonly dbClient: Client,
    private readonly qdrantUrl: string,
  ) {}

  @Get()
  async health() {
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkQdrant(),
    ]);

    const [db, qdrant] = checks.map((r) =>
      r.status === 'fulfilled' ? r.value : { ok: false, error: (r as any).reason?.message },
    );

    const allOk = [db, qdrant].every((c: any) => c.ok);

    return {
      status: allOk ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      checks: { db, qdrant },
    };
  }

  private async checkDatabase(): Promise<{ ok: boolean; latencyMs: number }> {
    const start = Date.now();
    await this.dbClient.query('SELECT 1');
    return { ok: true, latencyMs: Date.now() - start };
  }

  private async checkQdrant(): Promise<{ ok: boolean; latencyMs?: number }> {
    if (!this.qdrantUrl) return { ok: true }; // Qdrant é opcional
    const start = Date.now();
    const res = await fetch(`${this.qdrantUrl}/readyz`);
    return { ok: res.ok, latencyMs: Date.now() - start };
  }
}
