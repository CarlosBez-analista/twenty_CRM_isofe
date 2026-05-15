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
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { CompanyService, CreateCompanyDto, UpdateCompanyDto } from './company.service';
import { RequireAuth, RequirePermission } from '@nattivus/sdk';

// workspaceId é injetado no request pelo TenantContextMiddleware do shell
type WorkspaceRequest = Request & { workspaceId: string };

@Controller('api/companies')
@RequireAuth()
export class CompanyController {
  constructor(private readonly service: CompanyService) {}

  @Get()
  @RequirePermission('nattivus.crm.company:read')
  findAll(@Req() req: WorkspaceRequest) {
    return this.service.findAll(req.workspaceId);
  }

  @Get(':id')
  @RequirePermission('nattivus.crm.company:read')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: WorkspaceRequest,
  ) {
    return this.service.findOne(id, req.workspaceId);
  }

  @Post()
  @RequirePermission('nattivus.crm.company:write')
  create(@Body() dto: CreateCompanyDto, @Req() req: WorkspaceRequest) {
    return this.service.create(req.workspaceId, dto);
  }

  @Patch(':id')
  @RequirePermission('nattivus.crm.company:write')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCompanyDto,
    @Req() req: WorkspaceRequest,
  ) {
    return this.service.update(id, req.workspaceId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('nattivus.crm.company:write')
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: WorkspaceRequest) {
    return this.service.softDelete(id, req.workspaceId);
  }
}
