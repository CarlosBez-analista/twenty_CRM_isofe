-- Migration 004: Create module registry tables
-- Ref: data-delta.md §2.7–2.8

-- 2.7 module_registry (global catalogue)
CREATE TABLE module_registry (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id         text        NOT NULL UNIQUE,
  version           text        NOT NULL,
  manifest          jsonb       NOT NULL,
  discovered_at     timestamptz NOT NULL DEFAULT now(),
  disabled_globally bool        NOT NULL DEFAULT false
);

-- 2.8 module_activation (per workspace)
CREATE TABLE module_activation (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id          uuid        NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  module_id             text        NOT NULL,
  activated_at          timestamptz NOT NULL DEFAULT now(),
  activated_by_user_id  uuid        NOT NULL REFERENCES "user"(id),
  config                jsonb       NOT NULL DEFAULT '{}',
  UNIQUE (workspace_id, module_id)
);
