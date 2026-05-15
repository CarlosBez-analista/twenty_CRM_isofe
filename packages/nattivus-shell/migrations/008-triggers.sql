CREATE OR REPLACE FUNCTION tg_set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION tg_update_search_vector()
RETURNS trigger AS $$
BEGIN
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION tg_audit_row()
RETURNS trigger AS $$
DECLARE
  workspace uuid;
BEGIN
  workspace := nullif(current_setting('app.workspace_id', true), '')::uuid;

  INSERT INTO audit_log (
    workspace_id,
    user_id,
    request_id,
    action,
    entity_type,
    entity_id,
    before,
    after
  ) VALUES (
    workspace,
    nullif(current_setting('app.user_id', true), '')::uuid,
    current_setting('app.request_id', true),
    TG_OP,
    TG_TABLE_NAME,
    coalesce(NEW.id, OLD.id),
    CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_user_updated_at ON "user";
CREATE TRIGGER trg_user_updated_at
  BEFORE UPDATE ON "user"
  FOR EACH ROW EXECUTE FUNCTION tg_set_updated_at();

DROP TRIGGER IF EXISTS trg_workspace_updated_at ON workspace;
CREATE TRIGGER trg_workspace_updated_at
  BEFORE UPDATE ON workspace
  FOR EACH ROW EXECUTE FUNCTION tg_set_updated_at();

DROP TRIGGER IF EXISTS trg_workspace_member_updated_at ON workspace_member;
CREATE TRIGGER trg_workspace_member_updated_at
  BEFORE UPDATE ON workspace_member
  FOR EACH ROW EXECUTE FUNCTION tg_set_updated_at();

DROP TRIGGER IF EXISTS trg_module_registry_updated_at ON module_registry;
CREATE TRIGGER trg_module_registry_updated_at
  BEFORE UPDATE ON module_registry
  FOR EACH ROW EXECUTE FUNCTION tg_set_updated_at();

DROP TRIGGER IF EXISTS trg_module_activation_updated_at ON module_activation;
CREATE TRIGGER trg_module_activation_updated_at
  BEFORE UPDATE ON module_activation
  FOR EACH ROW EXECUTE FUNCTION tg_set_updated_at();

DROP TRIGGER IF EXISTS trg_vector_index_registry_updated_at
  ON vector_index_registry;
CREATE TRIGGER trg_vector_index_registry_updated_at
  BEFORE UPDATE ON vector_index_registry
  FOR EACH ROW EXECUTE FUNCTION tg_set_updated_at();

DROP TRIGGER IF EXISTS trg_workspace_member_audit ON workspace_member;
CREATE TRIGGER trg_workspace_member_audit
  AFTER INSERT OR UPDATE OR DELETE ON workspace_member
  FOR EACH ROW EXECUTE FUNCTION tg_audit_row();

DROP TRIGGER IF EXISTS trg_module_activation_audit ON module_activation;
CREATE TRIGGER trg_module_activation_audit
  AFTER INSERT OR UPDATE OR DELETE ON module_activation
  FOR EACH ROW EXECUTE FUNCTION tg_audit_row();
