-- Migration 001: Create PostgreSQL extensions
-- Ref: data-delta.md §3

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";
CREATE EXTENSION IF NOT EXISTS "vector";  -- pgvector; if unavailable, modules fallback to Qdrant-only
