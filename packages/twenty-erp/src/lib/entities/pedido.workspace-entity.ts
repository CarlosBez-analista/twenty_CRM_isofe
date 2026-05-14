import { BaseWorkspaceEntity } from '@twenty/server/core/entities';
import { Column, Entity } from 'typeorm';

@Entity('pedido')
export class PedidoWorkspaceEntity extends BaseWorkspaceEntity {
  @Column({ type: 'varchar', length: 255 })
  codigo: string;

  @Column({ type: 'varchar', length: 50, default: 'RASCUNHO' })
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valorTotal: number;

  @Column({ type: 'timestamp', nullable: true })
  dataEmissao: Date;

  @Column({ type: 'uuid' })
  companyId: string;

  @Column({ type: 'uuid', nullable: true })
  opportunityId: string;
}
