import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

/**
 * BaseEntity — Entidade base para todas as tabelas transacionais do NattivusECO.
 *
 * Colunas herdadas:
 * - id: UUID v4 gerado pelo banco
 * - workspaceId: FK para workspace (nullable em tabelas globais — override no filho)
 * - createdAt, updatedAt, deletedAt: timestamps de auditoria (soft-delete)
 * - searchVector: tsvector para full-text search (atualizado por trigger)
 * - position: numeric para ordenação manual drag-and-drop
 *
 * Referência: _reversa_sdd/domain.md (RN-2,4,5) + data-delta.md §1
 */
export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  workspaceId!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt!: Date | null;

  @Column({ type: 'tsvector', nullable: true, select: false })
  searchVector!: string | null;

  @Column({ type: 'numeric', nullable: true })
  position!: number | null;
}
