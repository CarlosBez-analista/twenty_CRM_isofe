/**
 * T031 — Teste E2E de busca semântica (vector_index_registry)
 *
 * Cenário Gherkin (requirements.md §7.5):
 *   Dado uma coleção registrada no vector_index_registry
 *   Quando consultada via SemanticSearchService (pgvector ou Qdrant)
 *   Então retorna resultados ranqueados por similaridade
 *
 * Este spec valida o data layer do registry e o shape dos resultados.
 * As strategies concretas (PgvectorStrategy, QdrantStrategy) têm seus
 * próprios unit specs em T046/T047.
 */

import { getTestClient } from '../fixtures';

describe('Semantic Search — vector_index_registry (data layer)', () => {
  it('registers a pgvector collection', async () => {
    const client = await getTestClient();
    await client.query(
      `INSERT INTO vector_index_registry
         (collection_name, backend, dimensions, metric, owner_module_id)
       VALUES ('contacts_embeddings', 'pgvector', 768, 'cosine', 'nattivus.crm')
       ON CONFLICT (collection_name) DO NOTHING`,
    );

    const { rows } = await client.query(
      `SELECT * FROM vector_index_registry WHERE collection_name = 'contacts_embeddings'`,
    );
    expect(rows[0]).toMatchObject({
      collection_name: 'contacts_embeddings',
      backend: 'pgvector',
      dimensions: 768,
      metric: 'cosine',
    });
  });

  it('registers a qdrant collection', async () => {
    const client = await getTestClient();
    await client.query(
      `INSERT INTO vector_index_registry
         (collection_name, backend, dimensions, metric, owner_module_id)
       VALUES ('documents_embeddings', 'qdrant', 1536, 'cosine', 'nattivus.docs')
       ON CONFLICT (collection_name) DO NOTHING`,
    );

    const { rows } = await client.query(
      `SELECT backend FROM vector_index_registry WHERE collection_name = 'documents_embeddings'`,
    );
    expect(rows[0].backend).toBe('qdrant');
  });

  it('rejects invalid backend values', async () => {
    const client = await getTestClient();
    await expect(
      client.query(
        `INSERT INTO vector_index_registry
           (collection_name, backend, dimensions, metric, owner_module_id)
         VALUES ('bad_col', 'elasticsearch', 512, 'cosine', 'nattivus.test')`,
      ),
    ).rejects.toThrow(); // CHECK constraint violation
  });

  it('rejects invalid metric values', async () => {
    const client = await getTestClient();
    await expect(
      client.query(
        `INSERT INTO vector_index_registry
           (collection_name, backend, dimensions, metric, owner_module_id)
         VALUES ('bad_metric', 'pgvector', 512, 'euclidean', 'nattivus.test')`,
      ),
    ).rejects.toThrow(); // CHECK constraint: metric IN ('cosine','l2','inner')
  });

  it('enforces unique collection names', async () => {
    const client = await getTestClient();
    await client.query(
      `INSERT INTO vector_index_registry
         (collection_name, backend, dimensions, metric, owner_module_id)
       VALUES ('unique_col', 'pgvector', 256, 'l2', 'nattivus.test')`,
    );
    await expect(
      client.query(
        `INSERT INTO vector_index_registry
           (collection_name, backend, dimensions, metric, owner_module_id)
         VALUES ('unique_col', 'qdrant', 256, 'cosine', 'nattivus.test')`,
      ),
    ).rejects.toThrow(); // UNIQUE violation
  });
});
