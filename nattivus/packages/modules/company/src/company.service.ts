import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Company, extractDomainFromUrl, companyNameFromDomain } from './company.entity';

export interface CreateCompanyDto {
  name?: string;
  domainName?: string;
  addressStreet1?: string;
  addressCity?: string;
  addressState?: string;
  addressCountry?: string;
  addressPostcode?: string;
  employees?: number;
  annualRevenueAmountMicros?: bigint;
  annualRevenueCurrencyCode?: string;
  linkedinUrl?: string;
  xUrl?: string;
  idealCustomerProfile?: boolean;
}

export interface UpdateCompanyDto extends Partial<CreateCompanyDto> {}

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly repo: Repository<Company>,
  ) {}

  async findAll(workspaceId: string): Promise<Company[]> {
    return this.repo.find({
      where: { workspaceId, deletedAt: IsNull() },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string, workspaceId: string): Promise<Company> {
    const company = await this.repo.findOne({
      where: { id, workspaceId, deletedAt: IsNull() },
    });
    if (!company) throw new NotFoundException(`Company ${id} not found`);
    return company;
  }

  async create(workspaceId: string, dto: CreateCompanyDto): Promise<Company> {
    const name = this.resolveName(dto);
    const domain = dto.domainName
      ? extractDomainFromUrl(dto.domainName) ?? dto.domainName
      : null;

    const company = this.repo.create({
      ...dto,
      name,
      domainName: domain,
      workspaceId,
    });
    return this.repo.save(company);
  }

  async update(id: string, workspaceId: string, dto: UpdateCompanyDto): Promise<Company> {
    const company = await this.findOne(id, workspaceId);

    if (dto.domainName !== undefined) {
      dto.domainName = extractDomainFromUrl(dto.domainName) ?? dto.domainName;
    }

    Object.assign(company, dto);
    return this.repo.save(company);
  }

  async softDelete(id: string, workspaceId: string): Promise<void> {
    const company = await this.findOne(id, workspaceId);
    company.deletedAt = new Date();
    await this.repo.save(company);
  }

  // Se nenhum nome for fornecido mas houver domínio, infere o nome
  private resolveName(dto: CreateCompanyDto): string {
    if (dto.name) return dto.name;
    if (dto.domainName) {
      const domain = extractDomainFromUrl(dto.domainName) ?? dto.domainName;
      return companyNameFromDomain(domain);
    }
    return 'Unknown Company';
  }
}
