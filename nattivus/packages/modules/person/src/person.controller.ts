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
import { PersonService, CreatePersonDto, UpdatePersonDto } from './person.service';
import { RequireAuth, RequirePermission } from '@nattivus/sdk';

type WorkspaceRequest = Request & { workspaceId: string };

@Controller('api/people')
@RequireAuth()
export class PersonController {
  constructor(private readonly service: PersonService) {}

  @Get()
  @RequirePermission('nattivus.crm.person:read')
  findAll(
    @Req() req: WorkspaceRequest,
    @Query('companyId') companyId?: string,
  ) {
    if (companyId) {
      return this.service.findByCompany(companyId, req.workspaceId);
    }
    return this.service.findAll(req.workspaceId);
  }

  @Get(':id')
  @RequirePermission('nattivus.crm.person:read')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: WorkspaceRequest,
  ) {
    return this.service.findOne(id, req.workspaceId);
  }

  @Post()
  @RequirePermission('nattivus.crm.person:write')
  create(@Body() dto: CreatePersonDto, @Req() req: WorkspaceRequest) {
    return this.service.create(req.workspaceId, dto);
  }

  @Patch(':id')
  @RequirePermission('nattivus.crm.person:write')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePersonDto,
    @Req() req: WorkspaceRequest,
  ) {
    return this.service.update(id, req.workspaceId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('nattivus.crm.person:write')
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: WorkspaceRequest) {
    return this.service.softDelete(id, req.workspaceId);
  }
}
