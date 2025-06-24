-- Create extension for UUID generation if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('client', 'translator')),
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  phone TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  birthdate DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create clients table if it doesn't exist
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(255),
  full_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(50),
  address TEXT,
  country VARCHAR(100),
  preferred_languages TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);

-- Create translators table if it doesn't exist
CREATE TABLE IF NOT EXISTS translators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(50),
  address TEXT,
  country VARCHAR(100),
  languages TEXT[],
  specializations TEXT[],
  certification TEXT,
  years_of_experience INTEGER,
  hourly_rate DECIMAL(10,2),
  availability_status VARCHAR(20) DEFAULT 'available',
  rating DECIMAL(3,2),
  review_count INTEGER DEFAULT 0,
  completed_projects INTEGER DEFAULT 0,
  on_time_percentage INTEGER DEFAULT 100,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_translators_user_id ON translators(user_id);

-- Create user_verification table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_verification (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  identity_verified BOOLEAN DEFAULT FALSE,
  face_verified BOOLEAN DEFAULT FALSE,
  identity_document_type TEXT,
  identity_document_number TEXT,
  identity_document_expiry DATE,
  identity_document_country TEXT,
  face_image_url TEXT,
  identity_document_url TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'in-progress', 'approved', 'rejected')),
  verification_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_verification_user_id ON user_verification(user_id);

-- Create verification_codes table if it doesn't exist
CREATE TABLE IF NOT EXISTS verification_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'phone', 'reset')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id and type for faster lookups
CREATE INDEX IF NOT EXISTS idx_verification_codes_user_id_type ON verification_codes(user_id, type);

-- Create health_check table for server health checks
CREATE TABLE IF NOT EXISTS health_check (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  status TEXT DEFAULT 'ok',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert a record into health_check table if it's empty
INSERT INTO health_check (status)
SELECT 'ok'
WHERE NOT EXISTS (SELECT 1 FROM health_check LIMIT 1);
