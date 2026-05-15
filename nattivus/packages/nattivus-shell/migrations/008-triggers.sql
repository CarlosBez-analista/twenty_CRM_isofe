-- Migration 008: Trigger functions and wiring
-- Ref: data-delta.md §4

-- tg_set_updated_at: auto-update updated_at on UPDATE
CREATE OR REPLACE FUNCTION tg_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- tg_update_search_vector: rebuild search_vector from specified columns
-- Usage: CREATE TRIGGER ... EXECUTE FUNCTION tg_update_search_vector('col1', 'col2')
CREATE OR REPLACE FUNCTION tg_update_search_vector()
RETURNS TRIGGER AS $$
DECLARE
  col text;
  result tsvector := ''::tsvector;
BEGIN
  FOREACH col IN ARRAY TG_ARGV
  LOOP
    result := result || to_tsvector('portuguese', COALESCE(NEW::text, ''));
  END LOOP;
  NEW.search_vector := result;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- tg_audit_row: insert into audit_log on data changes
CREATE OR REPLACE FUNCTION tg_audit_row()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log (workspace_id, user_id, action, entity_type, entity_id, metadata)
  VALUES (
    NULLIF(current_setting('app.workspace_id', true), '')::uuid,
    NULLIF(current_setting('app.user_id', true), '')::uuid,
    TG_ARGV[0] || '.' || TG_OP,
    TG_TABLE_NAME,
    CASE WHEN TG_OP = 'DELETE' THEN OLD.id ELSE NEW.id END,
    jsonb_build_object('op', TG_OP)
  );
  IF TG_OP = 'DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END;
$$ LANGUAGE plpgsql;

-- Wire triggers to auth & workspace tables
CREATE TRIGGER trg_user_updated_at BEFORE UPDATE ON "user"
  FOR EACH ROW EXECUTE FUNCTION tg_set_updated_at();

CREATE TRIGGER trg_workspace_updated_at BEFORE UPDATE ON workspace
  FOR EACH ROW EXECUTE FUNCTION tg_set_updated_at();

CREATE TRIGGER trg_workspace_member_updated_at BEFORE UPDATE ON workspace_member
  FOR EACH ROW EXECUTE FUNCTION tg_set_updated_at();

CREATE TRIGGER trg_mfa_secret_updated_at BEFORE UPDATE ON mfa_secret
  FOR EACH ROW EXECUTE FUNCTION tg_set_updated_at();
