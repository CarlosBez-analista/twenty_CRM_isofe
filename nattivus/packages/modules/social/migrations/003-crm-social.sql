-- Migration: 003-crm-social

CREATE TABLE service_scheduling (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID REFERENCES service_catalog(id),
  person_id UUID REFERENCES person(id),
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  qr_code_hash VARCHAR(255),
  status VARCHAR(50) DEFAULT 'SCHEDULED', -- SCHEDULED, CHECKED_IN, CANCELLED
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE attendance_record (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scheduling_id UUID REFERENCES service_scheduling(id),
  volunteer_id UUID REFERENCES person(id),
  notes TEXT, -- private notes
  requires_review BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE case_record (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  person_id UUID REFERENCES person(id),
  type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'OPEN',
  assigned_to UUID REFERENCES person(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE document_checklist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES case_record(id),
  document_type VARCHAR(100) NOT NULL,
  is_sensitive BOOLEAN DEFAULT true,
  storage_path VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE volunteer_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  person_id UUID REFERENCES person(id) UNIQUE,
  professional_area VARCHAR(100),
  background_check_status VARCHAR(50) DEFAULT 'PENDING',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
