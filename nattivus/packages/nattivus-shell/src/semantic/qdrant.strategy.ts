import type { SemanticSearchResult } from '@nattivus/sdk';

/**
 * QdrantStrategy — Busca semântica via Qdrant (HTTP REST API).
 *
 * Suporte a:
 * - Criação de coleção com configurações de vetor
 * - Upsert de pontos com payload
 * - Busca por similaridade com filtros opcionais
 * - Delete de pontos
 *
 * Ref: data-delta.md §6, T047
 * Qdrant REST API: https://qdrant.tech/documentation/
 */

export interface QdrantConfig {
  url: string;   // ex: http://localhost:6333
  apiKey?: string;
}

export interface QdrantPoint {
  id: string | number;
  vector: number[];
  payload?: Record<string, unknown>;
}

export interface QdrantFilter {
  must?: Array<{ key: string; match: { value: unknown } }>;
}

export class QdrantStrategy {
  private readonly headers: Record<string, string>;

  constructor(private readonly config: QdrantConfig) {
    this.headers = {
      'Content-Type': 'application/json',
      ...(config.apiKey ? { 'api-key': config.apiKey } : {}),
    };
  }

  /** Cria uma coleção no Qdrant. Idempotente se já existir. */
  async ensureCollection(params: {
    name: string;
    dimensions: number;
    metric: 'Cosine' | 'Dot' | 'Euclid';
  }): Promise<void> {
    const url = `${this.config.url}/collections/${params.name}`;

    // Verifica se já existe
    const checkRes = await fetch(url, { headers: this.headers });
    if (checkRes.ok) return; // Já existe

    await this.request('PUT', `/collections/${params.name}`, {
      vectors: {
        size: params.dimensions,
        distance: params.metric,
      },
    });
  }

  /** Upsert de pontos em lote */
  async upsert(collectionName: string, points: QdrantPoint[]): Promise<void> {
    await this.request('PUT', `/collections/${collectionName}/points`, {
      points: points.map((p) => ({
        id: p.id,
        vector: p.vector,
        payload: p.payload ?? {},
      })),
    });
  }

  /** Busca por similaridade com filtros opcionais */
  async search(params: {
    collectionName: string;
    queryVector: number[];
    topK?: number;
    filter?: QdrantFilter;
  }): Promise<SemanticSearchResult[]> {
    const body: Record<string, unknown> = {
      vector: params.queryVector,
      limit: params.topK ?? 10,
      with_payload: true,
    };
    if (params.filter) body['filter'] = params.filter;

    const result = await this.request(
      'POST',
      `/collections/${params.collectionName}/points/search`,
      body,
    );

    return (result.result ?? []).map((hit: any) => ({
      id: String(hit.id),
      score: hit.score,
      payload: hit.payload ?? {},
    }));
  }

  /** Remove pontos por IDs */
  async delete(collectionName: string, ids: Array<string | number>): Promise<void> {
    await this.request('POST', `/collections/${collectionName}/points/delete`, {
      points: ids,
    });
  }

  private async request(method: string, path: string, body?: unknown): Promise<any> {
    const res = await fetch(`${this.config.url}${path}`, {
      method,
      headers: this.headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Qdrant ${method} ${path} failed (${res.status}): ${text}`);
    }
    return res.json();
  }
}
