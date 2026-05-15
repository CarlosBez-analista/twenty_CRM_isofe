import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { PermissionGuard } from '../auth/permission.guard';
import { ModuleRegistryService } from './module-registry.service';
import { ModuleActivationService } from './module-activation.service';
import { ModuleDiscoveryService } from './module-discovery.service';

/**
 * ModuleAdminController — Gerenciamento de módulos via REST.
 *
 * GET  /api/admin/modules              — lista todos no registry
 * GET  /api/admin/modules/:id          — detalhes de um módulo
 * GET  /api/admin/modules/:id/activation — ativação por workspace (header X-Workspace-Id)
 * POST /api/admin/modules/:id/activate  — ativa módulo no workspace
 * POST /api/admin/modules/:id/deactivate — desativa módulo no workspace
 * POST /api/admin/modules/:id/disable-globally — desabilita globalmente (super-admin)
 * POST /api/admin/modules/discover      — re-executa descoberta
 *
 * Ref: interfaces/module-system.md, T054
 */

export class ActivateDto {
  workspaceId!: string;
  activatedByUserId!: string;
  config?: Record<string, unknown>;
}

export class DeactivateDto {
  workspaceId!: string;
}

@UseGuards(AuthGuard, PermissionGuard)
@Controller('api/admin/modules')
export class ModuleAdminController {
  constructor(
    private readonly registryService: ModuleRegistryService,
    private readonly activationService: ModuleActivationService,
    private readonly discoveryService: ModuleDiscoveryService,
  ) {}

  /** Lista todos os módulos no registry global */
  @Get()
  async listAll() {
    return this.registryService.listActive();
  }

  /** Detalhes de um módulo específico */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const module = await this.registryService.findById(id);
    if (!module) return { error: `Module not found: ${id}` };
    return module;
  }

  /** Módulos ativos em um workspace */
  @Get(':id/activation')
  async getActivation(@Param('id') workspaceId: string) {
    return this.activationService.listActive(workspaceId);
  }

  /** Ativa um módulo em um workspace */
  @Post(':id/activate')
  @HttpCode(HttpStatus.CREATED)
  async activate(@Param('id') moduleId: string, @Body() dto: ActivateDto) {
    try {
      const record = await this.activationService.activate({
        workspaceId: dto.workspaceId,
        moduleId,
        activatedByUserId: dto.activatedByUserId,
        config: dto.config,
      });
      return record;
    } catch (err: any) {
      return { error: err.message };
    }
  }

  /** Desativa um módulo em um workspace */
  @Post(':id/deactivate')
  @HttpCode(HttpStatus.OK)
  async deactivate(@Param('id') moduleId: string, @Body() dto: DeactivateDto) {
    try {
      await this.activationService.deactivate({
        workspaceId: dto.workspaceId,
        moduleId,
      });
      return { success: true };
    } catch (err: any) {
      return { error: err.message };
    }
  }

  /** Desabilita um módulo globalmente (impede ativação em qualquer workspace) */
  @Post(':id/disable-globally')
  @HttpCode(HttpStatus.OK)
  async disableGlobally(@Param('id') moduleId: string) {
    await this.registryService.disableGlobally(moduleId);
    return { success: true, moduleId };
  }

  /** Re-executa descoberta de módulos (ex: após deploy de novo módulo) */
  @Post('discover')
  @HttpCode(HttpStatus.OK)
  async rediscover() {
    const results = await this.discoveryService.discoverAll();
    return {
      total: results.length,
      registered: results.filter((r) => r.status === 'registered').length,
      errors: results.filter((r) => r.status !== 'registered'),
    };
  }
}
