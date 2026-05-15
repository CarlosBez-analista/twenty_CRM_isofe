import { Client } from 'pg';
import type { SemanticSearchResult } from '@nattivus/sdk';

/**
 * PgvectorStrategy — Busca semântica via extensão pgvector.
 *
 * Suporte a:
 * - Criação dinâmica de coluna `embedding vector(N)` em tabela alvo
 * - Índice HNSW para busca ANN eficiente
 * - Métricas: cosine (<=>), l2 (<->), inner (<#>)
 *
 * Ref: data-delta.md §6, T046
 */

const METRIC_OPERATORS: Record<string, string> = {
  cosine: '<=>',
  l2: '<->',
  inner: '<#>',
};

export interface PgvectorSearchParams {
  tableName: string;
  embeddingColumn: string;
  queryVector: number[];
  topK?: number;
  metric?: 'cosine' | 'l2' | 'inner';
  filter?: string; // SQL WHERE clause extra (já sanitizado)
  idColumn?: string;
}

export class PgvectorStrategy {
  constructor(private readonly client: Client) {}

  /**
   * Adiciona coluna de embedding a uma tabela existente.
   * Idempotente — ignora erro se coluna já existe.
   */
  async ensureEmbeddingColumn(
    tableName: string,
    columnName: string,
    dimensions: number,
  ): Promise<void> {
    await this.client.query(`
      ALTER TABLE "${tableName}"
      ADD COLUMN IF NOT EXISTS "${columnName}" vector(${dimensions})
    `);
  }

  /**
   * Cria índice HNSW para busca aproximada eficiente.
   * Idempotente via IF NOT EXISTS.
   */
  async ensureHnswIndex(
    tableName: string,
    columnName: string,
    metric: 'cosine' | 'l2' | 'inner' = 'cosine',
  ): Promise<void> {
    const opclass = metric === 'cosine' ? 'vector_cosine_ops'
      : metric === 'l2' ? 'vector_l2_ops'
      : 'vector_ip_ops';
    const indexName = `idx_${tableName}_${columnName}_hnsw`;
    await this.client.query(`
      CREATE INDEX IF NOT EXISTS "${indexName}"
      ON "${tableName}" USING hnsw ("${columnName}" ${opclass})
    `);
  }

  /**
   * Upsert de um vetor de embedding para um registro específico.
   */
  async upsertEmbedding(
    tableName: string,
    id: string,
    columnName: string,
    vector: number[],
    idColumn = 'id',
  ): Promise<void> {
    await this.client.query(
      `UPDATE "${tableName}" SET "${columnName}" = $1 WHERE "${idColumn}" = $2`,
      [`[${vector.join(',')}]`, id],
    );
  }

  /**
   * Busca por similaridade semântica.
   * Retorna resultados ordenados por distância crescente (menor = mais similar).
   */
  async search(params: PgvectorSearchParams): Promise<SemanticSearchResult[]> {
    const {
      tableName,
      embeddingColumn,
      queryVector,
      topK = 10,
      metric = 'cosine',
      filter,
      idColumn = 'id',
    } = params;

    const operator = METRIC_OPERATORS[metric];
    const vectorLiteral = `'[${queryVector.join(',')}]'`;
    const whereClause = filter ? `AND (${filter})` : '';

    const { rows } = await this.client.query(
      `SELECT "${idColumn}" AS id,
              1 - ("${embeddingColumn}" ${operator} ${vectorLiteral}::vector) AS score,
              row_to_json("${tableName}".*) AS payload
       FROM "${tableName}"
       WHERE "${embeddingColumn}" IS NOT NULL ${whereClause}
       ORDER BY "${embeddingColumn}" ${operator} ${vectorLiteral}::vector
       LIMIT $1`,
      [topK],
    );

    return rows.map((r: any) => ({
      id: r.id,
      score: parseFloat(r.score),
      payload: r.payload,
    }));
  }
}
