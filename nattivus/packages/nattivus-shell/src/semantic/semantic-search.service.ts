import type { SemanticSearchResult } from '@nattivus/sdk';
import { VectorIndexRegistryService } from './vector-index-registry.service';
import { PgvectorStrategy } from './pgvector.strategy';
import { QdrantStrategy } from './qdrant.strategy';

/**
 * SemanticSearchService — Facade de busca semântica unificada.
 *
 * Despacha para PgvectorStrategy ou QdrantStrategy conforme
 * o backend registrado em vector_index_registry para a coleção solicitada.
 *
 * Implementa o contrato ShellClient.semanticSearch() do SDK.
 *
 * Ref: data-delta.md §6, T048
 */

export interface SemanticSearchParams {
  collection: string;
  query: number[];
  topK?: number;
  filter?: Record<string, unknown>;
}

export class SemanticSearchService {
  constructor(
    private readonly registry: VectorIndexRegistryService,
    private readonly pgvector: PgvectorStrategy,
    private readonly qdrant: QdrantStrategy,
  ) {}

  /**
   * Executa busca semântica na coleção indicada.
   * Detecta o backend automaticamente via vector_index_registry.
   */
  async search(params: SemanticSearchParams): Promise<SemanticSearchResult[]> {
    const index = await this.registry.findByName(params.collection);
    if (!index) {
      throw new Error(`Vector collection not registered: ${params.collection}`);
    }

    if (index.backend === 'pgvector') {
      return this.pgvector.search({
        tableName: params.collection,
        embeddingColumn: 'embedding',
        queryVector: params.query,
        topK: params.topK,
        metric: index.metric as 'cosine' | 'l2' | 'inner',
      });
    }

    if (index.backend === 'qdrant') {
      const qdrantMetric: Record<string, 'Cosine' | 'Dot' | 'Euclid'> = {
        cosine: 'Cosine',
        inner: 'Dot',
        l2: 'Euclid',
      };

      // Converte filter genérico para formato Qdrant
      const qdrantFilter = params.filter
        ? {
            must: Object.entries(params.filter).map(([key, value]) => ({
              key,
              match: { value },
            })),
          }
        : undefined;

      return this.qdrant.search({
        collectionName: params.collection,
        queryVector: params.query,
        topK: params.topK,
        filter: qdrantFilter,
      });
    }

    throw new Error(`Unknown vector backend: ${index.backend}`);
  }

  /**
   * Registra e provisiona uma nova coleção (cria índices/coluna conforme backend).
   */
  async provisionCollection(params: {
    collectionName: string;
    backend: 'pgvector' | 'qdrant';
    dimensions: number;
    metric: 'cosine' | 'l2' | 'inner';
    ownerModuleId: string;
    tableName?: string; // para pgvector
  }): Promise<void> {
    await this.registry.register({
      collectionName: params.collectionName,
      backend: params.backend,
      dimensions: params.dimensions,
      metric: params.metric,
      ownerModuleId: params.ownerModuleId,
    });

    if (params.backend === 'pgvector' && params.tableName) {
      await this.pgvector.ensureEmbeddingColumn(
        params.tableName,
        'embedding',
        params.dimensions,
      );
      await this.pgvector.ensureHnswIndex(
        params.tableName,
        'embedding',
        params.metric,
      );
    }

    if (params.backend === 'qdrant') {
      const metricMap: Record<string, 'Cosine' | 'Dot' | 'Euclid'> = {
        cosine: 'Cosine',
        inner: 'Dot',
        l2: 'Euclid',
      };
      await this.qdrant.ensureCollection({
        name: params.collectionName,
        dimensions: params.dimensions,
        metric: metricMap[params.metric],
      });
    }
  }
}
