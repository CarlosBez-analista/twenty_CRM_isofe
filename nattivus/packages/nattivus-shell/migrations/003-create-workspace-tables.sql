-- Migration 003: Create workspace tables
-- Ref: data-delta.md §2.5–2.6

-- 2.5 workspace (tenant root)
CREATE TABLE workspace (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            text        NOT NULL UNIQUE,
  display_name    text        NOT NULL,
  brand_overrides jsonb       NOT NULL DEFAULT '{}',
  profile         text        NOT NULL DEFAULT 'social'
                              CHECK (profile IN ('social', 'enterprise', 'both')),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  deleted_at      timestamptz
);

-- 2.6 workspace_member (user × workspace junction)
CREATE TABLE workspace_member (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  uuid        NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  user_id       uuid        NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  roles         text[]      NOT NULL DEFAULT '{}',
  invited_at    timestamptz NOT NULL DEFAULT now(),
  accepted_at   timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  deleted_at    timestamptz
);

CREATE UNIQUE INDEX idx_workspace_member_unique ON workspace_member (workspace_id, user_id) WHERE deleted_at IS NULL;
