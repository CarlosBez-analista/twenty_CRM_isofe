import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Person, parseName } from './person.entity';

export interface CreatePersonDto {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  city?: string;
  avatarUrl?: string;
  linkedinUrl?: string;
  xUrl?: string;
  companyId?: string;
}

export interface UpdatePersonDto extends Partial<CreatePersonDto> {}

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly repo: Repository<Person>,
  ) {}

  async findAll(workspaceId: string): Promise<Person[]> {
    return this.repo.find({
      where: { workspaceId, deletedAt: IsNull() },
      order: { lastName: 'ASC', firstName: 'ASC' },
    });
  }

  async findByCompany(companyId: string, workspaceId: string): Promise<Person[]> {
    return this.repo.find({
      where: { companyId, workspaceId, deletedAt: IsNull() },
      order: { lastName: 'ASC' },
    });
  }

  async findOne(id: string, workspaceId: string): Promise<Person> {
    const person = await this.repo.findOne({
      where: { id, workspaceId, deletedAt: IsNull() },
    });
    if (!person) throw new NotFoundException(`Person ${id} not found`);
    return person;
  }

  async create(workspaceId: string, dto: CreatePersonDto): Promise<Person> {
    const { firstName, lastName } = this.resolveNames(dto);
    const person = this.repo.create({ ...dto, firstName, lastName, workspaceId });
    return this.repo.save(person);
  }

  async update(id: string, workspaceId: string, dto: UpdatePersonDto): Promise<Person> {
    const person = await this.findOne(id, workspaceId);

    if (dto.displayName) {
      const parsed = parseName(dto.displayName);
      if (!dto.firstName) dto.firstName = parsed.firstName;
      if (!dto.lastName) dto.lastName = parsed.lastName;
      delete (dto as Record<string, unknown>)['displayName'];
    }

    Object.assign(person, dto);
    return this.repo.save(person);
  }

  async softDelete(id: string, workspaceId: string): Promise<void> {
    const person = await this.findOne(id, workspaceId);
    person.deletedAt = new Date();
    await this.repo.save(person);
  }

  private resolveNames(dto: CreatePersonDto): { firstName: string; lastName: string } {
    if (dto.firstName || dto.lastName) {
      return { firstName: dto.firstName ?? '', lastName: dto.lastName ?? '' };
    }
    if (dto.displayName) return parseName(dto.displayName);
    return { firstName: '', lastName: '' };
  }
}
