-- Create exec_sql function
CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
RETURNS void AS $$
BEGIN
  EXECUTE sql;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant usage to authenticated users and anon
GRANT EXECUTE ON FUNCTION public.exec_sql(text) TO authenticated, anon;

-- Create user_verification table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_verification (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  identity_verified BOOLEAN DEFAULT false,
  face_verified BOOLEAN DEFAULT false,
  verification_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create or update users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  user_type VARCHAR(50) NOT NULL,
  gender VARCHAR(20) DEFAULT 'male',
  phone VARCHAR(50),
  birthdate DATE,
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ensure all columns exist in users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS gender VARCHAR(20) DEFAULT 'male';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS birthdate DATE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false;

-- Add email_verified column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'email_verified'
  ) THEN
    ALTER TABLE public.users ADD COLUMN email_verified BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Add phone_verified column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'phone_verified'
  ) THEN
    ALTER TABLE public.users ADD COLUMN phone_verified BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Add birthdate column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'birthdate'
  ) THEN
    ALTER TABLE public.users ADD COLUMN birthdate DATE;
  END IF;
END $$;

-- Create clients table
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  company_name VARCHAR(255),
  full_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(50),
  address TEXT,
  country VARCHAR(100),
  preferred_languages TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create translators table
CREATE TABLE IF NOT EXISTS public.translators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
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
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  completed_projects INTEGER DEFAULT 0,
  on_time_percentage INTEGER DEFAULT 100,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add missing columns to translators table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_name = 'translators' AND column_name = 'review_count'
  ) THEN
    ALTER TABLE public.translators ADD COLUMN review_count INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_name = 'translators' AND column_name = 'completed_projects'
  ) THEN
    ALTER TABLE public.translators ADD COLUMN completed_projects INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_name = 'translators' AND column_name = 'on_time_percentage'
  ) THEN
    ALTER TABLE public.translators ADD COLUMN on_time_percentage INTEGER DEFAULT 100;
  END IF;

  IF NOT EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_name = 'translators' AND column_name = 'description'
  ) THEN
    ALTER TABLE public.translators ADD COLUMN description TEXT;
  END IF;
END $$;
