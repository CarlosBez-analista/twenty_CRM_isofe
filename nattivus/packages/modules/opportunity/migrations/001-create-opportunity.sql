-- Opportunity module — migration 001
-- Ref: T009, _reversa_sdd/state-machines.md (Opportunity pipeline)
-- company_id e point_of_contact_id são referências virtuais (sem FK física) — T001

CREATE TABLE IF NOT EXISTS opportunity (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id            uuid        NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  name                    text        NOT NULL CHECK (length(trim(name)) > 0),
  stage                   text        NOT NULL DEFAULT 'NEW'
                            CHECK (stage IN (
                              'NEW','MEETING_SCHEDULED','DEMO_SCHEDULED','DISCOVERY',
                              'PROPOSAL_SENT','NEGOTIATION','CLOSED_WON','CLOSED_LOST'
                            )),
  close_date              date,
  amount_micros           bigint      CHECK (amount_micros >= 0),
  currency_code           char(3),
  probability             smallint    CHECK (probability BETWEEN 0 AND 100),
  -- Referências virtuais (sem integridade referencial — T001)
  company_id              uuid,
  point_of_contact_id     uuid,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now(),
  deleted_at              timestamptz,
  search_vector           tsvector,
  position                numeric
);

CREATE INDEX IF NOT EXISTS idx_opportunity_workspace
  ON opportunity(workspace_id)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_opportunity_stage
  ON opportunity(workspace_id, stage)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_opportunity_company
  ON opportunity(workspace_id, company_id)
  WHERE deleted_at IS NULL AND company_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_opportunity_search
  ON opportunity USING gin(search_vector);

CREATE TRIGGER tg_opportunity_updated_at
  BEFORE UPDATE ON opportunity
  FOR EACH ROW EXECUTE FUNCTION tg_set_updated_at();

CREATE TRIGGER tg_opportunity_search_vector
  BEFORE INSERT OR UPDATE ON opportunity
  FOR EACH ROW EXECUTE FUNCTION tg_update_search_vector();

ALTER TABLE opportunity ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON opportunity
  USING (workspace_id = current_setting('app.workspace_id')::uuid)
  WITH CHECK (workspace_id = current_setting('app.workspace_id')::uuid);
