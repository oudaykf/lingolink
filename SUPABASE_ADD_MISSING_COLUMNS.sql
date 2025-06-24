-- Add missing columns to existing users table
-- Run this FIRST before running the complete schema

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add missing columns to users table one by one
DO $$ 
BEGIN
    -- Add status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'status') THEN
        ALTER TABLE users ADD COLUMN status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending'));
    END IF;
    
    -- Add phone column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'phone') THEN
        ALTER TABLE users ADD COLUMN phone VARCHAR(50);
    END IF;
    
    -- Add profile_image column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'profile_image') THEN
        ALTER TABLE users ADD COLUMN profile_image TEXT;
    END IF;
    
    -- Add bio column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'bio') THEN
        ALTER TABLE users ADD COLUMN bio TEXT;
    END IF;
    
    -- Add location column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'location') THEN
        ALTER TABLE users ADD COLUMN location VARCHAR(255);
    END IF;
    
    -- Add languages column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'languages') THEN
        ALTER TABLE users ADD COLUMN languages TEXT[];
    END IF;
    
    -- Add specialties column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'specialties') THEN
        ALTER TABLE users ADD COLUMN specialties TEXT[];
    END IF;
    
    -- Add years_of_experience column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'years_of_experience') THEN
        ALTER TABLE users ADD COLUMN years_of_experience INTEGER;
    END IF;
    
    -- Add hourly_rate column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'hourly_rate') THEN
        ALTER TABLE users ADD COLUMN hourly_rate DECIMAL(10,2);
    END IF;
    
    -- Add certifications column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'certifications') THEN
        ALTER TABLE users ADD COLUMN certifications TEXT;
    END IF;
    
    -- Add education column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'education') THEN
        ALTER TABLE users ADD COLUMN education TEXT;
    END IF;
    
    -- Add company_name column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'company_name') THEN
        ALTER TABLE users ADD COLUMN company_name VARCHAR(255);
    END IF;
    
    -- Add industry column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'industry') THEN
        ALTER TABLE users ADD COLUMN industry VARCHAR(255);
    END IF;
    
    -- Add is_verified column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'is_verified') THEN
        ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Add email_verified column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'email_verified') THEN
        ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Add phone_verified column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'phone_verified') THEN
        ALTER TABLE users ADD COLUMN phone_verified BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Add identity_verified column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'identity_verified') THEN
        ALTER TABLE users ADD COLUMN identity_verified BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Add gender column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'gender') THEN
        ALTER TABLE users ADD COLUMN gender TEXT CHECK (gender IN ('male', 'female', 'other'));
    END IF;
    
    -- Add birthdate column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'birthdate') THEN
        ALTER TABLE users ADD COLUMN birthdate DATE;
    END IF;
    
    -- Update user_type constraint to include admin
    BEGIN
        ALTER TABLE users DROP CONSTRAINT IF EXISTS users_user_type_check;
        ALTER TABLE users ADD CONSTRAINT users_user_type_check CHECK (user_type IN ('client', 'translator', 'admin'));
    EXCEPTION
        WHEN OTHERS THEN
            -- Constraint might not exist, that's okay
            NULL;
    END;
    
END $$;

-- Create health_check table for connection testing if it doesn't exist
CREATE TABLE IF NOT EXISTS health_check (
  id SERIAL PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'ok',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert a record into health_check for connection testing
INSERT INTO health_check (status) VALUES ('ok') ON CONFLICT DO NOTHING;

-- Create indexes for better performance on users table
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Grant permissions to the anon role for registration
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON public.users TO anon;
GRANT ALL ON public.health_check TO anon;
