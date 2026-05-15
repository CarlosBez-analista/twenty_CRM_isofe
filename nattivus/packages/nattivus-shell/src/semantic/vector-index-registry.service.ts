import { Client } from 'pg';

/**
 * VectorIndexRegistryService — CRUD no vector_index_registry.
 *
 * Permite que módulos registrem coleções de embedding sem conhecer
 * o backend concreto (pgvector ou Qdrant). O SemanticSearchService
 * lê este registry para despachar para a strategy correta.
 *
 * Ref: data-delta.md §2.10
 */

export type VectorBackend = 'pgvector' | 'qdrant';
export type VectorMetric = 'cosine' | 'l2' | 'inner';

export interface VectorIndexRecord {
  id: string;
  collectionName: string;
  backend: VectorBackend;
  dimensions: number;
  metric: VectorMetric;
  ownerModuleId: string;
  createdAt: Date;
}

export class VectorIndexRegistryService {
  constructor(private readonly client: Client) {}

  /** Registra uma nova coleção de embeddings */
  async register(params: Omit<VectorIndexRecord, 'id' | 'createdAt'>): Promise<VectorIndexRecord> {
    const { rows } = await this.client.query<VectorIndexRecord>(
      `INSERT INTO vector_index_registry
         (collection_name, backend, dimensions, metric, owner_module_id)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (collection_name) DO UPDATE
         SET backend = EXCLUDED.backend,
             dimensions = EXCLUDED.dimensions,
             metric = EXCLUDED.metric
       RETURNING id, collection_name AS "collectionName", backend,
                 dimensions, metric, owner_module_id AS "ownerModuleId",
                 created_at AS "createdAt"`,
      [params.collectionName, params.backend, params.dimensions, params.metric, params.ownerModuleId],
    );
    return rows[0];
  }

  /** Busca uma coleção por nome */
  async findByName(collectionName: string): Promise<VectorIndexRecord | null> {
    const { rows } = await this.client.query<VectorIndexRecord>(
      `SELECT id, collection_name AS "collectionName", backend,
              dimensions, metric, owner_module_id AS "ownerModuleId",
              created_at AS "createdAt"
       FROM vector_index_registry WHERE collection_name = $1`,
      [collectionName],
    );
    return rows[0] ?? null;
  }

  /** Lista todas as coleções registradas */
  async listAll(): Promise<VectorIndexRecord[]> {
    const { rows } = await this.client.query<VectorIndexRecord>(
      `SELECT id, collection_name AS "collectionName", backend,
              dimensions, metric, owner_module_id AS "ownerModuleId",
              created_at AS "createdAt"
       FROM vector_index_registry ORDER BY collection_name`,
    );
    return rows;
  }

  /** Remove uma coleção do registry */
  async deregister(collectionName: string): Promise<void> {
    await this.client.query(
      `DELETE FROM vector_index_registry WHERE collection_name = $1`,
      [collectionName],
    );
  }
}
