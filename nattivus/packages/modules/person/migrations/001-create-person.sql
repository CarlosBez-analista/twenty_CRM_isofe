-- Person module — migration 001
-- Ref: T009, _reversa_sdd/domain.md (RN-2,4)
-- company_id é referência virtual (sem FK física) — decisão T001

CREATE TABLE IF NOT EXISTS person (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id        uuid        NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  first_name          text        NOT NULL DEFAULT '',
  last_name           text        NOT NULL DEFAULT '',
  email               text,
  phone               text,
  job_title           text,
  city                text,
  avatar_url          text,
  linkedin_url        text,
  x_url               text,
  -- Referência virtual a company (sem integridade referencial — T001)
  company_id          uuid,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  deleted_at          timestamptz,
  search_vector       tsvector,
  position            numeric
);

CREATE INDEX IF NOT EXISTS idx_person_workspace
  ON person(workspace_id)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_person_company
  ON person(workspace_id, company_id)
  WHERE deleted_at IS NULL AND company_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_person_email
  ON person(workspace_id, email)
  WHERE deleted_at IS NULL AND email IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_person_search
  ON person USING gin(search_vector);

CREATE TRIGGER tg_person_updated_at
  BEFORE UPDATE ON person
  FOR EACH ROW EXECUTE FUNCTION tg_set_updated_at();

CREATE TRIGGER tg_person_search_vector
  BEFORE INSERT OR UPDATE ON person
  FOR EACH ROW EXECUTE FUNCTION tg_update_search_vector();

ALTER TABLE person ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON person
  USING (workspace_id = current_setting('app.workspace_id')::uuid)
  WITH CHECK (workspace_id = current_setting('app.workspace_id')::uuid);
