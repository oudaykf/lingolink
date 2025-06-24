-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to create users table
CREATE OR REPLACE FUNCTION create_users_table()
RETURNS void AS $$
BEGIN
    -- Create users table if it doesn't exist
    CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        user_type TEXT NOT NULL CHECK (user_type IN ('client', 'translator')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Create index on email for faster lookups
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
END;
$$ LANGUAGE plpgsql;

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('client', 'translator')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create translations table
CREATE TABLE IF NOT EXISTS public.translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  source_language TEXT NOT NULL,
  target_language TEXT NOT NULL,
  original_text TEXT NOT NULL,
  translated_text TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
  word_count INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own data" 
  ON public.users 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" 
  ON public.users 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Create RLS policies for translations table
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own translations" 
  ON public.translations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own translations" 
  ON public.translations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own translations" 
  ON public.translations 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own translations" 
  ON public.translations 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create function to check if email exists
CREATE OR REPLACE FUNCTION public.check_email_exists(email_to_check TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users WHERE email = email_to_check
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
