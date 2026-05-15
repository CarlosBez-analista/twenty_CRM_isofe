ALTER TABLE workspace ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_member ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_activation ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE vector_index_registry ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS workspace_member_tenant_isolation ON workspace_member;
CREATE POLICY workspace_member_tenant_isolation
  ON workspace_member
  USING (
    workspace_id::text = current_setting('app.workspace_id', true)
    OR current_setting('app.is_system_context', true) = 'true'
  );

DROP POLICY IF EXISTS module_activation_tenant_isolation ON module_activation;
CREATE POLICY module_activation_tenant_isolation
  ON module_activation
  USING (
    workspace_id::text = current_setting('app.workspace_id', true)
    OR current_setting('app.is_system_context', true) = 'true'
  );

DROP POLICY IF EXISTS audit_log_tenant_isolation ON audit_log;
CREATE POLICY audit_log_tenant_isolation
  ON audit_log
  USING (
    workspace_id::text = current_setting('app.workspace_id', true)
    OR workspace_id IS NULL
    OR current_setting('app.is_system_context', true) = 'true'
  );

DROP POLICY IF EXISTS vector_index_registry_tenant_isolation
  ON vector_index_registry;
CREATE POLICY vector_index_registry_tenant_isolation
  ON vector_index_registry
  USING (
    workspace_id::text = current_setting('app.workspace_id', true)
    OR workspace_id IS NULL
    OR current_setting('app.is_system_context', true) = 'true'
  );

DROP POLICY IF EXISTS workspace_visible_to_members ON workspace;
CREATE POLICY workspace_visible_to_members
  ON workspace
  USING (
    id::text = current_setting('app.workspace_id', true)
    OR current_setting('app.is_system_context', true) = 'true'
  );
