-- Migration: 002-inventory

CREATE TABLE product_catalog_social (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) NOT NULL, -- FISICO, DIGITAL, SOCIAL, INSTITUCIONAL
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE inventory_item_social (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES product_catalog_social(id),
  batch_number VARCHAR(100),
  expiration_date DATE,
  donor_partner_id UUID REFERENCES company(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE stock_movement_social (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inventory_item_id UUID REFERENCES inventory_item_social(id),
  type VARCHAR(50) NOT NULL, -- ENTRADA, SAIDA
  quantity NUMERIC NOT NULL,
  triggered_by_crm_attendance_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE donation_record (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) NOT NULL, -- PRODUTO, DINHEIRO, HORA_VOLUNTARIA
  donor_id UUID REFERENCES person(id),
  amount NUMERIC,
  inventory_item_id UUID REFERENCES inventory_item_social(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
