-- Migration: 004-indicators

CREATE TABLE impact_indicator (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID REFERENCES program(id),
  attendance_id UUID REFERENCES attendance_record(id),
  type VARCHAR(50) NOT NULL,
  value NUMERIC NOT NULL,
  anonymized_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
