CREATE TABLE IF NOT EXISTS audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES workspace(id) ON DELETE SET NULL,
  user_id uuid REFERENCES "user"(id) ON DELETE SET NULL,
  request_id text,
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  before jsonb,
  after jsonb,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_workspace_created
  ON audit_log(workspace_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_log_request_id ON audit_log(request_id);
