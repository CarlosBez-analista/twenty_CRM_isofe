-- Migration: 001-base-social
-- Adiciona extensões na tabela person e cria as tabelas base do ERP Social

ALTER TABLE person
ADD COLUMN person_type VARCHAR(50) DEFAULT 'BENEFICIARIO',
ADD COLUMN cpf VARCHAR(255), -- AES-256 encrypted at application level
ADD COLUMN consent_status VARCHAR(50) DEFAULT 'PENDING',
ADD COLUMN birth_date DATE;

CREATE TABLE family (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  vulnerability_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE program (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  pillar VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE service_catalog (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID REFERENCES program(id),
  name VARCHAR(255) NOT NULL,
  eligibility_rules JSONB,
  lgpd_sensitive BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
