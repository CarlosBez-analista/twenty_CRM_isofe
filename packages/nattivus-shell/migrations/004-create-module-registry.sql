CREATE TABLE IF NOT EXISTS module_registry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id text NOT NULL UNIQUE,
  name text NOT NULL,
  version text NOT NULL,
  sdk_version text NOT NULL,
  manifest jsonb NOT NULL,
  status text NOT NULL DEFAULT 'available',
  incompatible_reason text,
  discovered_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE IF NOT EXISTS module_activation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  module_registry_id uuid NOT NULL REFERENCES module_registry(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active',
  activated_at timestamptz NOT NULL DEFAULT now(),
  deactivated_at timestamptz,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  CONSTRAINT uq_module_activation_workspace_module UNIQUE (
    workspace_id,
    module_registry_id
  )
);

CREATE INDEX IF NOT EXISTS idx_module_activation_workspace_id
  ON module_activation(workspace_id);
