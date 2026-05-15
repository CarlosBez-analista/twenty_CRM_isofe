-- Migration 006: Create vector index registry
-- Ref: data-delta.md §2.10

CREATE TABLE vector_index_registry (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_name text        NOT NULL UNIQUE,
  backend         text        NOT NULL CHECK (backend IN ('pgvector', 'qdrant')),
  dimensions      int         NOT NULL,
  metric          text        NOT NULL CHECK (metric IN ('cosine', 'l2', 'inner')),
  owner_module_id text        NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);
