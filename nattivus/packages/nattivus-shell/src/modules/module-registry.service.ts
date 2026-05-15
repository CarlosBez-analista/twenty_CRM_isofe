import { Client } from 'pg';
import type { IModule } from '@nattivus/sdk';

/**
 * ModuleRegistryService — CRUD no module_registry global.
 *
 * Responsabilidades:
 * - Registrar/atualizar módulos descobertos pelo ModuleDiscoveryService
 * - Verificar compatibilidade de versão (semver simples)
 * - Marcar módulos como disabled_globally (admin action)
 *
 * Ref: data-delta.md §2.7
 */

export interface ModuleRecord {
  id: string;
  moduleId: string;
  version: string;
  manifest: IModule;
  discoveredAt: Date;
  disabledGlobally: boolean;
}

export class ModuleRegistryService {
  constructor(private readonly client: Client) {}

  /** Upsert um módulo no registry (comparação por module_id) */
  async upsert(manifest: IModule): Promise<ModuleRecord> {
    const { rows } = await this.client.query<ModuleRecord>(
      `INSERT INTO module_registry (module_id, version, manifest)
       VALUES ($1, $2, $3)
       ON CONFLICT (module_id) DO UPDATE
         SET version = EXCLUDED.version,
             manifest = EXCLUDED.manifest
       RETURNING id, module_id AS "moduleId", version,
                 manifest, discovered_at AS "discoveredAt",
                 disabled_globally AS "disabledGlobally"`,
      [manifest.moduleId, manifest.version, JSON.stringify(manifest)],
    );
    return rows[0];
  }

  /** Busca módulo por moduleId */
  async findById(moduleId: string): Promise<ModuleRecord | null> {
    const { rows } = await this.client.query<ModuleRecord>(
      `SELECT id, module_id AS "moduleId", version, manifest,
              discovered_at AS "discoveredAt", disabled_globally AS "disabledGlobally"
       FROM module_registry WHERE module_id = $1`,
      [moduleId],
    );
    return rows[0] ?? null;
  }

  /** Lista todos os módulos ativos (não desabilitados globalmente) */
  async listActive(): Promise<ModuleRecord[]> {
    const { rows } = await this.client.query<ModuleRecord>(
      `SELECT id, module_id AS "moduleId", version, manifest,
              discovered_at AS "discoveredAt", disabled_globally AS "disabledGlobally"
       FROM module_registry WHERE disabled_globally = false
       ORDER BY module_id`,
    );
    return rows;
  }

  /** Desabilita globalmente um módulo (impede ativação em qualquer workspace) */
  async disableGlobally(moduleId: string): Promise<void> {
    await this.client.query(
      `UPDATE module_registry SET disabled_globally = true WHERE module_id = $1`,
      [moduleId],
    );
  }

  /** Reabilita um módulo previamente desabilitado */
  async enableGlobally(moduleId: string): Promise<void> {
    await this.client.query(
      `UPDATE module_registry SET disabled_globally = false WHERE module_id = $1`,
      [moduleId],
    );
  }
}
