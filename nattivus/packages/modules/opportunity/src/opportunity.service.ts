import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Opportunity, OpportunityStage, OPPORTUNITY_STAGES } from './opportunity.entity';

export interface CreateOpportunityDto {
  name: string;
  stage?: OpportunityStage;
  closeDate?: string;
  amountMicros?: bigint;
  currencyCode?: string;
  probability?: number;
  companyId?: string;
  pointOfContactId?: string;
}

export interface UpdateOpportunityDto extends Partial<CreateOpportunityDto> {}

@Injectable()
export class OpportunityService {
  constructor(
    @InjectRepository(Opportunity)
    private readonly repo: Repository<Opportunity>,
  ) {}

  async findAll(workspaceId: string): Promise<Opportunity[]> {
    return this.repo.find({
      where: { workspaceId, deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }

  async findByStage(stage: OpportunityStage, workspaceId: string): Promise<Opportunity[]> {
    return this.repo.find({
      where: { stage, workspaceId, deletedAt: IsNull() },
      order: { position: 'ASC', createdAt: 'ASC' },
    });
  }

  async findByCompany(companyId: string, workspaceId: string): Promise<Opportunity[]> {
    return this.repo.find({
      where: { companyId, workspaceId, deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, workspaceId: string): Promise<Opportunity> {
    const opp = await this.repo.findOne({
      where: { id, workspaceId, deletedAt: IsNull() },
    });
    if (!opp) throw new NotFoundException(`Opportunity ${id} not found`);
    return opp;
  }

  async create(workspaceId: string, dto: CreateOpportunityDto): Promise<Opportunity> {
    this.validateStage(dto.stage);
    const opp = this.repo.create({
      ...dto,
      stage: dto.stage ?? 'NEW',
      workspaceId,
    });
    return this.repo.save(opp);
  }

  async update(id: string, workspaceId: string, dto: UpdateOpportunityDto): Promise<Opportunity> {
    const opp = await this.findOne(id, workspaceId);
    this.validateStage(dto.stage);
    Object.assign(opp, dto);
    return this.repo.save(opp);
  }

  async softDelete(id: string, workspaceId: string): Promise<void> {
    const opp = await this.findOne(id, workspaceId);
    opp.deletedAt = new Date();
    await this.repo.save(opp);
  }

  private validateStage(stage?: string): void {
    if (stage && !OPPORTUNITY_STAGES.includes(stage as OpportunityStage)) {
      throw new BadRequestException(
        `Invalid stage "${stage}". Valid values: ${OPPORTUNITY_STAGES.join(', ')}`,
      );
    }
  }
}
