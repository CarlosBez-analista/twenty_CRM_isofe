import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '@nattivus/shared';

/** Extrai o domínio raiz de uma URL (ex: 'https://acme.com/path' → 'acme.com') */
export function extractDomainFromUrl(url: string): string | null {
  if (!url) return null;
  try {
    const normalized = url.startsWith('http') ? url : `https://${url}`;
    return new URL(normalized).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

/** Infere o nome de exibição a partir do domínio (ex: 'acme.com' → 'Acme') */
export function companyNameFromDomain(domain: string): string {
  const base = domain.split('.')[0] ?? domain;
  return base.charAt(0).toUpperCase() + base.slice(1).toLowerCase();
}

@Entity({ name: 'company', schema: 'public' })
export class Company extends BaseEntity {
  @Column({ type: 'text' })
  @Index()
  name!: string;

  // Usado para inferir nome de exibição e buscar logo via Clearbit/etc.
  @Column({ name: 'domain_name', type: 'text', nullable: true })
  domainName!: string | null;

  @Column({ name: 'address_street_1', type: 'text', nullable: true })
  addressStreet1!: string | null;

  @Column({ name: 'address_city', type: 'text', nullable: true })
  addressCity!: string | null;

  @Column({ name: 'address_state', type: 'text', nullable: true })
  addressState!: string | null;

  @Column({ name: 'address_country', type: 'text', nullable: true })
  addressCountry!: string | null;

  @Column({ name: 'address_postcode', type: 'text', nullable: true })
  addressPostcode!: string | null;

  @Column({ type: 'integer', nullable: true })
  employees!: number | null;

  // Armazenado em micros para evitar ponto flutuante (RN-3 do legado)
  @Column({ name: 'annual_revenue_amount_micros', type: 'bigint', nullable: true })
  annualRevenueAmountMicros!: bigint | null;

  @Column({ name: 'annual_revenue_currency_code', type: 'char', length: 3, nullable: true })
  annualRevenueCurrencyCode!: string | null;

  @Column({ name: 'linkedin_url', type: 'text', nullable: true })
  linkedinUrl!: string | null;

  @Column({ name: 'x_url', type: 'text', nullable: true })
  xUrl!: string | null;

  @Column({ name: 'ideal_customer_profile', type: 'boolean', default: false })
  idealCustomerProfile!: boolean;

  @Column({ name: 'workspace_id', type: 'uuid' })
  override workspaceId!: string;
}
