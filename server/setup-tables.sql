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
  user_id UUID NOT NULL,
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

-- Create function to check if email exists
CREATE OR REPLACE FUNCTION public.check_email_exists(email_to_check TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users WHERE email = email_to_check
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if email exists with specific user type
CREATE OR REPLACE FUNCTION public.check_email_type(email_to_check TEXT, user_type_to_check TEXT)
RETURNS TABLE(exists BOOLEAN, conflicting_type TEXT) AS $$
DECLARE
  found_user_type TEXT;
BEGIN
  SELECT user_type INTO found_user_type
  FROM public.users
  WHERE email = email_to_check
  LIMIT 1;
  
  IF found_user_type IS NULL THEN
    -- Email doesn't exist
    exists := FALSE;
    conflicting_type := NULL;
  ELSIF found_user_type = user_type_to_check THEN
    -- Email exists with the same user type
    exists := TRUE;
    conflicting_type := NULL;
  ELSE
    -- Email exists with a different user type
    exists := FALSE;
    conflicting_type := found_user_type;
  END IF;
  
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
