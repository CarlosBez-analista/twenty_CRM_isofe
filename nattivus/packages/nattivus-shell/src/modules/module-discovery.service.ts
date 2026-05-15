import * as fs from 'fs';
import * as path from 'path';
import * as semver from 'semver';
import type { IModule } from '@nattivus/sdk';
import { ModuleRegistryService } from './module-registry.service';

/**
 * ModuleDiscoveryService — Descobre módulos instalados em packages/modules/.
 *
 * Fluxo de descoberta (executado no bootstrap do shell):
 * 1. Glob em packages/modules/*/dist/module.manifest.js
 * 2. Valida shape (moduleId, version, sdkVersion obrigatórios)
 * 3. Compara sdkVersion com SDK_VERSION suportado pelo shell
 * 4. Upsert no module_registry via ModuleRegistryService
 *
 * Ref: data-delta.md §2.7, _reversa_forward/001.../interfaces/sdk-contract.md §4
 */

/** Versão do SDK suportada por este shell */
const SUPPORTED_SDK_VERSION = '0.0.1';

function isValidManifest(obj: unknown): obj is IModule {
  if (typeof obj !== 'object' || !obj) return false;
  const m = obj as Record<string, unknown>;
  return (
    typeof m['moduleId'] === 'string' &&
    typeof m['version'] === 'string' &&
    typeof m['sdkVersion'] === 'string' &&
    Array.isArray(m['entities']) &&
    Array.isArray(m['routes']) &&
    Array.isArray(m['permissions'])
  );
}

export interface DiscoveryResult {
  moduleId: string;
  status: 'registered' | 'incompatible_sdk' | 'invalid_manifest' | 'error';
  reason?: string;
}

export class ModuleDiscoveryService {
  constructor(
    private readonly registryService: ModuleRegistryService,
    private readonly modulesBasePath: string = path.resolve(
      __dirname,
      '../../../../modules',
    ),
  ) {}

  /** Descobre e registra todos os módulos disponíveis */
  async discoverAll(): Promise<DiscoveryResult[]> {
    const results: DiscoveryResult[] = [];

    if (!fs.existsSync(this.modulesBasePath)) {
      return results;
    }

    const entries = fs.readdirSync(this.modulesBasePath, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const manifestPath = path.join(
        this.modulesBasePath,
        entry.name,
        'dist',
        'module.manifest.js',
      );

      if (!fs.existsSync(manifestPath)) {
        // Tenta src/module.manifest.ts em desenvolvimento
        const srcPath = path.join(
          this.modulesBasePath,
          entry.name,
          'src',
          'module.manifest.ts',
        );
        if (!fs.existsSync(srcPath)) continue;
      }

      const result = await this.processModule(entry.name, manifestPath);
      results.push(result);
    }

    return results;
  }

  private async processModule(
    dirName: string,
    manifestPath: string,
  ): Promise<DiscoveryResult> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const loaded = require(manifestPath);
      const manifest: unknown = loaded?.manifest ?? loaded?.default?.manifest ?? loaded;

      if (!isValidManifest(manifest)) {
        return {
          moduleId: dirName,
          status: 'invalid_manifest',
          reason: 'Missing required fields: moduleId, version, sdkVersion, entities, routes, permissions',
        };
      }

      // Verifica compatibilidade do SDK
      if (!semver.satisfies(SUPPORTED_SDK_VERSION, manifest.sdkVersion)) {
        return {
          moduleId: manifest.moduleId,
          status: 'incompatible_sdk',
          reason: `Module requires SDK ${manifest.sdkVersion}, shell provides ${SUPPORTED_SDK_VERSION}`,
        };
      }

      await this.registryService.upsert(manifest);

      return { moduleId: manifest.moduleId, status: 'registered' };
    } catch (err: any) {
      return {
        moduleId: dirName,
        status: 'error',
        reason: err.message,
      };
    }
  }
}
