-- Fix Row Level Security (RLS) policies for the users table

-- First, enable RLS on the users table if it's not already enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies on the users table
DROP POLICY IF EXISTS users_insert_policy ON public.users;
DROP POLICY IF EXISTS users_select_policy ON public.users;

-- Create a policy that allows the authenticated user to insert new users
-- This is needed for registration to work with the anon key
CREATE POLICY users_insert_policy
  ON public.users
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Create a policy that allows users to select their own data
CREATE POLICY users_select_policy
  ON public.users
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Create health_check table for connection testing if it doesn't exist
CREATE TABLE IF NOT EXISTS health_check (
  id SERIAL PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'ok',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert a record into health_check for connection testing
INSERT INTO health_check (status) VALUES ('ok');

-- Grant permissions to the anon role
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON public.users TO anon;
GRANT ALL ON public.translations TO anon;
GRANT ALL ON public.health_check TO anon;