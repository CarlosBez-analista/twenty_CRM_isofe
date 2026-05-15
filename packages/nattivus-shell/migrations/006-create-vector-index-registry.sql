CREATE TABLE IF NOT EXISTS vector_index_registry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES workspace(id) ON DELETE CASCADE,
  module_id text,
  entity_name text NOT NULL,
  table_name text NOT NULL,
  vector_column text NOT NULL DEFAULT 'embedding',
  backend text NOT NULL CHECK (backend IN ('pgvector', 'qdrant')),
  dimensions integer NOT NULL,
  distance text NOT NULL DEFAULT 'cosine',
  external_collection text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_vector_index_registry_workspace_id
  ON vector_index_registry(workspace_id);

CREATE UNIQUE INDEX IF NOT EXISTS uq_vector_index_registry_scope
  ON vector_index_registry(
    coalesce(workspace_id, '00000000-0000-0000-0000-000000000000'::uuid),
    entity_name,
    backend
  )
  WHERE deleted_at IS NULL;
