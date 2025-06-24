-- Add gender field to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female', 'other'));

-- Add phone number and verification fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_level TEXT DEFAULT 'basic' CHECK (verification_level IN ('basic', 'intermediate', 'advanced'));

-- Create verification table
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
  liveness_frames JSONB,
  birthdate DATE,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'in-progress', 'approved', 'rejected')),
  verification_notes TEXT,
  verification_level TEXT DEFAULT 'basic' CHECK (verification_level IN ('basic', 'intermediate', 'advanced')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for better performance
CREATE INDEX IF NOT EXISTS idx_user_verification_user_id ON user_verification(user_id);

-- Create verification codes table for email and phone verification
CREATE TABLE IF NOT EXISTS verification_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'phone')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id and type for better performance
CREATE INDEX IF NOT EXISTS idx_verification_codes_user_id_type ON verification_codes(user_id, type);

-- Add trigger to update the updated_at column in user_verification
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_verification_updated_at
BEFORE UPDATE ON user_verification
FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
