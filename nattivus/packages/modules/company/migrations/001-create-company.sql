-- Company module — migration 001
-- Ref: T009, _reversa_sdd/domain.md (RN-2,4)

CREATE TABLE IF NOT EXISTS company (
  id                              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id                    uuid        NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  name                            text        NOT NULL CHECK (length(trim(name)) > 0),
  domain_name                     text,
  address_street_1                text,
  address_city                    text,
  address_state                   text,
  address_country                 text,
  address_postcode                text,
  employees                       integer     CHECK (employees >= 0),
  annual_revenue_amount_micros    bigint      CHECK (annual_revenue_amount_micros >= 0),
  annual_revenue_currency_code    char(3),
  linkedin_url                    text,
  x_url                           text,
  ideal_customer_profile          boolean     NOT NULL DEFAULT false,
  created_at                      timestamptz NOT NULL DEFAULT now(),
  updated_at                      timestamptz NOT NULL DEFAULT now(),
  deleted_at                      timestamptz,
  search_vector                   tsvector,
  position                        numeric
);

CREATE INDEX IF NOT EXISTS idx_company_workspace
  ON company(workspace_id)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_company_name
  ON company(workspace_id, name)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_company_search
  ON company USING gin(search_vector);

CREATE TRIGGER tg_company_updated_at
  BEFORE UPDATE ON company
  FOR EACH ROW EXECUTE FUNCTION tg_set_updated_at();

-- Atualiza search_vector com nome + domínio para full-text search
CREATE TRIGGER tg_company_search_vector
  BEFORE INSERT OR UPDATE ON company
  FOR EACH ROW EXECUTE FUNCTION tg_update_search_vector();

ALTER TABLE company ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON company
  USING (workspace_id = current_setting('app.workspace_id')::uuid)
  WITH CHECK (workspace_id = current_setting('app.workspace_id')::uuid);
