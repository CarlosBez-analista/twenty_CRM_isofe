import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '@nattivus/shared';

export interface ParsedName {
  firstName: string;
  lastName: string;
}

/**
 * Extrai firstName e lastName de um displayName livre.
 * Ex: 'Maria Clara Souza' → { firstName: 'Maria Clara', lastName: 'Souza' }
 * Ex: 'João' → { firstName: 'João', lastName: '' }
 */
export function parseName(displayName: string): ParsedName {
  const parts = displayName.trim().split(/\s+/);
  if (parts.length === 0) return { firstName: '', lastName: '' };
  if (parts.length === 1) return { firstName: parts[0]!, lastName: '' };
  const lastName = parts[parts.length - 1]!;
  const firstName = parts.slice(0, -1).join(' ');
  return { firstName, lastName };
}

/** Reconstrói o displayName a partir das partes */
export function buildDisplayName(firstName: string, lastName: string): string {
  return [firstName, lastName].filter(Boolean).join(' ');
}

@Entity({ name: 'person', schema: 'public' })
export class Person extends BaseEntity {
  @Column({ name: 'first_name', type: 'text', default: '' })
  firstName!: string;

  @Column({ name: 'last_name', type: 'text', default: '' })
  lastName!: string;

  @Column({ type: 'text', nullable: true })
  @Index()
  email!: string | null;

  @Column({ type: 'text', nullable: true })
  phone!: string | null;

  @Column({ name: 'job_title', type: 'text', nullable: true })
  jobTitle!: string | null;

  @Column({ type: 'text', nullable: true })
  city!: string | null;

  @Column({ name: 'avatar_url', type: 'text', nullable: true })
  avatarUrl!: string | null;

  @Column({ name: 'linkedin_url', type: 'text', nullable: true })
  linkedinUrl!: string | null;

  @Column({ name: 'x_url', type: 'text', nullable: true })
  xUrl!: string | null;

  // Referência virtual ao módulo company (sem FK no banco — T001)
  @Column({ name: 'company_id', type: 'uuid', nullable: true })
  @Index()
  companyId!: string | null;

  @Column({ name: 'workspace_id', type: 'uuid' })
  override workspaceId!: string;

  get displayName(): string {
    return buildDisplayName(this.firstName, this.lastName);
  }
}
