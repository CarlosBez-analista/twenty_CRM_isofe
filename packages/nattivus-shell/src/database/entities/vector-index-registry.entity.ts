import { Column, Entity } from 'typeorm';

import { BaseEntity } from '@nattivus/shared';

@Entity({ name: 'vector_index_registry' })
export class VectorIndexRegistryEntity extends BaseEntity {
  @Column({ name: 'workspace_id', type: 'uuid', nullable: true })
  workspaceId?: string | null;

  @Column({ name: 'module_id', type: 'text', nullable: true })
  moduleId?: string | null;

  @Column({ name: 'entity_name', type: 'text' })
  entityName!: string;

  @Column({ name: 'table_name', type: 'text' })
  tableName!: string;

  @Column({ name: 'vector_column', type: 'text', default: 'embedding' })
  vectorColumn!: string;

  @Column({ type: 'text' })
  backend!: 'pgvector' | 'qdrant';

  @Column({ type: 'int' })
  dimensions!: number;

  @Column({ type: 'text', default: 'cosine' })
  distance!: string;

  @Column({ name: 'external_collection', type: 'text', nullable: true })
  externalCollection?: string | null;
}
