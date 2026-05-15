-- Migration 007: Enable Row-Level Security
-- Ref: data-delta.md §5

-- workspace_member: user can only see own memberships
ALTER TABLE workspace_member ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_wm ON workspace_member
  USING (user_id = current_setting('app.user_id')::uuid)
  WITH CHECK (user_id = current_setting('app.user_id')::uuid);

-- module_activation: isolated by workspace
ALTER TABLE module_activation ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_ma ON module_activation
  USING (workspace_id = current_setting('app.workspace_id')::uuid)
  WITH CHECK (workspace_id = current_setting('app.workspace_id')::uuid);

-- Note: Global tables (user, mfa_secret, backup_code, refresh_token,
-- module_registry, audit_log, vector_index_registry) do NOT have RLS.
-- workspace table is the tenant root and is protected via workspace_member relationship.
-- Future module tables with workspace_id must add their own RLS policy following this pattern.
