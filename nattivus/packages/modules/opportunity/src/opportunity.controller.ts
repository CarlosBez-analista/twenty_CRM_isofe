import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { OpportunityService, CreateOpportunityDto, UpdateOpportunityDto } from './opportunity.service';
import { RequireAuth, RequirePermission } from '@nattivus/sdk';
import type { OpportunityStage } from './opportunity.entity';

type WorkspaceRequest = Request & { workspaceId: string };

@Controller('api/opportunities')
@RequireAuth()
export class OpportunityController {
  constructor(private readonly service: OpportunityService) {}

  @Get()
  @RequirePermission('nattivus.crm.opportunity:read')
  findAll(
    @Req() req: WorkspaceRequest,
    @Query('stage') stage?: OpportunityStage,
    @Query('companyId') companyId?: string,
  ) {
    if (stage) return this.service.findByStage(stage, req.workspaceId);
    if (companyId) return this.service.findByCompany(companyId, req.workspaceId);
    return this.service.findAll(req.workspaceId);
  }

  @Get(':id')
  @RequirePermission('nattivus.crm.opportunity:read')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: WorkspaceRequest,
  ) {
    return this.service.findOne(id, req.workspaceId);
  }

  @Post()
  @RequirePermission('nattivus.crm.opportunity:write')
  create(@Body() dto: CreateOpportunityDto, @Req() req: WorkspaceRequest) {
    return this.service.create(req.workspaceId, dto);
  }

  @Patch(':id')
  @RequirePermission('nattivus.crm.opportunity:write')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOpportunityDto,
    @Req() req: WorkspaceRequest,
  ) {
    return this.service.update(id, req.workspaceId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('nattivus.crm.opportunity:write')
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: WorkspaceRequest) {
    return this.service.softDelete(id, req.workspaceId);
  }
}
