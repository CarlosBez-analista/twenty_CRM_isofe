import { Client } from 'pg';
import type { IModule } from '@nattivus/sdk';
import { ModuleRegistryService } from './module-registry.service';

/**
 * ModuleActivationService — Ativa/desativa módulos por workspace.
 *
 * Fluxo de ativação:
 * 1. Verifica módulo existe no registry e não está disabled_globally
 * 2. Verifica dependências (módulos dependentes também devem estar ativos)
 * 3. Insere em module_activation (transação atômica)
 * 4. Chama manifest.onActivate() se definido
 *
 * Ref: data-delta.md §2.8, T044 (🟡 — registro dinâmico de rotas simplificado)
 */

export interface ActivationRecord {
  id: string;
  workspaceId: string;
  moduleId: string;
  activatedAt: Date;
  activatedByUserId: string;
  config: Record<string, unknown>;
}

export class ModuleActivationService {
  constructor(
    private readonly client: Client,
    private readonly registryService: ModuleRegistryService,
  ) {}

  /** Ativa um módulo para um workspace */
  async activate(params: {
    workspaceId: string;
    moduleId: string;
    activatedByUserId: string;
    config?: Record<string, unknown>;
  }): Promise<ActivationRecord> {
    const module = await this.registryService.findById(params.moduleId);
    if (!module) throw new Error(`Module not found: ${params.moduleId}`);
    if (module.disabledGlobally) throw new Error(`Module is disabled: ${params.moduleId}`);

    // Verificar dependências
    const manifest = module.manifest as IModule;
    if (manifest.dependencies?.length) {
      await this.checkDependencies(params.workspaceId, manifest.dependencies);
    }

    // Inserir ativação
    const { rows } = await this.client.query<ActivationRecord>(
      `INSERT INTO module_activation
         (workspace_id, module_id, activated_by_user_id, config)
       VALUES ($1, $2, $3, $4)
       RETURNING id, workspace_id AS "workspaceId", module_id AS "moduleId",
                 activated_at AS "activatedAt",
                 activated_by_user_id AS "activatedByUserId",
                 config`,
      [
        params.workspaceId,
        params.moduleId,
        params.activatedByUserId,
        JSON.stringify(params.config ?? {}),
      ],
    );

    const record = rows[0];

    // Chamar onActivate se definido
    if (typeof manifest.onActivate === 'function') {
      await manifest.onActivate({ workspaceId: params.workspaceId });
    }

    return record;
  }

  /** Desativa um módulo para um workspace */
  async deactivate(params: {
    workspaceId: string;
    moduleId: string;
  }): Promise<void> {
    const module = await this.registryService.findById(params.moduleId);
    const manifest = module?.manifest as IModule | undefined;

    // Chamar onDeactivate se definido
    if (typeof manifest?.onDeactivate === 'function') {
      await manifest.onDeactivate({ workspaceId: params.workspaceId });
    }

    await this.client.query(
      `DELETE FROM module_activation
       WHERE workspace_id = $1 AND module_id = $2`,
      [params.workspaceId, params.moduleId],
    );
  }

  /** Lista módulos ativos para um workspace */
  async listActive(workspaceId: string): Promise<ActivationRecord[]> {
    const { rows } = await this.client.query<ActivationRecord>(
      `SELECT id, workspace_id AS "workspaceId", module_id AS "moduleId",
              activated_at AS "activatedAt",
              activated_by_user_id AS "activatedByUserId",
              config
       FROM module_activation WHERE workspace_id = $1
       ORDER BY activated_at`,
      [workspaceId],
    );
    return rows;
  }

  private async checkDependencies(
    workspaceId: string,
    dependencies: string[],
  ): Promise<void> {
    const { rows } = await this.client.query(
      `SELECT module_id FROM module_activation
       WHERE workspace_id = $1 AND module_id = ANY($2)`,
      [workspaceId, dependencies],
    );
    const active = new Set(rows.map((r: any) => r.module_id));
    const missing = dependencies.filter((d) => !active.has(d));
    if (missing.length) {
      throw new Error(`Required modules not active: ${missing.join(', ')}`);
    }
  }
}
