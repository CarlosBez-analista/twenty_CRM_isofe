import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '@nattivus/shared';

// String literals sobre enum para extensibilidade (convenção do legado e SDK)
export type OpportunityStage =
  | 'NEW'
  | 'MEETING_SCHEDULED'
  | 'DEMO_SCHEDULED'
  | 'DISCOVERY'
  | 'PROPOSAL_SENT'
  | 'NEGOTIATION'
  | 'CLOSED_WON'
  | 'CLOSED_LOST';

export const OPPORTUNITY_STAGES: OpportunityStage[] = [
  'NEW',
  'MEETING_SCHEDULED',
  'DEMO_SCHEDULED',
  'DISCOVERY',
  'PROPOSAL_SENT',
  'NEGOTIATION',
  'CLOSED_WON',
  'CLOSED_LOST',
];

export const CLOSED_STAGES: OpportunityStage[] = ['CLOSED_WON', 'CLOSED_LOST'];

@Entity({ name: 'opportunity', schema: 'public' })
export class Opportunity extends BaseEntity {
  @Column({ type: 'text' })
  @Index()
  name!: string;

  @Column({
    type: 'text',
    default: 'NEW',
  })
  stage!: OpportunityStage;

  @Column({ name: 'close_date', type: 'date', nullable: true })
  closeDate!: Date | null;

  // Armazenado em micros para evitar ponto flutuante (RN-3 do legado)
  @Column({ name: 'amount_micros', type: 'bigint', nullable: true })
  amountMicros!: bigint | null;

  @Column({ name: 'currency_code', type: 'char', length: 3, nullable: true })
  currencyCode!: string | null;

  // 0–100; null = desconhecido
  @Column({ type: 'smallint', nullable: true })
  probability!: number | null;

  // Referências virtuais sem FK no banco (decisão T001)
  @Column({ name: 'company_id', type: 'uuid', nullable: true })
  @Index()
  companyId!: string | null;

  @Column({ name: 'point_of_contact_id', type: 'uuid', nullable: true })
  pointOfContactId!: string | null;

  @Column({ name: 'workspace_id', type: 'uuid' })
  override workspaceId!: string;
}
