-- Script to diagnose and fix user registration issues
BEGIN;

-- 1. Check users table structure and RLS status
SELECT 
    tablename, 
    rowsecurity,
    (SELECT count(*) FROM pg_policies WHERE tablename = t.tablename) as policy_count
FROM pg_tables t 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'clients', 'translators');

-- 2. Check for auth triggers
SELECT 
    trigger_name, 
    event_manipulation, 
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'auth'
AND event_object_table = 'users';

-- 3. Check RLS policies on users table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename IN ('users', 'clients', 'translators')
ORDER BY tablename, policyname;

-- 4. Create or fix the auth.users trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into public.users
  INSERT INTO public.users (
    id, 
    email, 
    created_at, 
    updated_at,
    user_type,
    name
  ) VALUES (
    NEW.id, 
    NEW.email, 
    NEW.created_at, 
    NEW.updated_at,
    NEW.raw_user_meta_data->>'user_type',
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = EXCLUDED.updated_at,
    user_type = EXCLUDED.user_type,
    name = EXCLUDED.name;

  -- Insert into clients or translators table based on user type
  IF NEW.raw_user_meta_data->>'user_type' = 'client' THEN
    INSERT INTO public.clients (id, user_id, created_at, updated_at)
    VALUES (gen_random_uuid(), NEW.id, NOW(), NOW())
    ON CONFLICT (user_id) DO NOTHING;
  ELSIF NEW.raw_user_meta_data->>'user_type' = 'translator' THEN
    INSERT INTO public.translators (id, user_id, created_at, updated_at)
    VALUES (gen_random_uuid(), NEW.id, NOW(), NOW())
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create the trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

-- 6. Set up RLS policies for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can view own profile" ON users';
    EXECUTE 'DROP POLICY IF EXISTS "Users can update own profile" ON users';
  END IF;
END $$;

-- Create RLS policies for users table
CREATE POLICY "Users can view own profile" 
ON users 
FOR SELECT 
USING (id = auth.uid());

CREATE POLICY "Users can update own profile" 
ON users 
FOR UPDATE 
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- 7. Set up RLS policies for clients table
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'clients') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can view own client profile" ON clients';
  END IF;
END $$;

CREATE POLICY "Users can view own client profile" 
ON clients 
FOR SELECT 
USING (user_id = auth.uid());

-- 8. Set up RLS policies for translators table
ALTER TABLE translators ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'translators') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can view own translator profile" ON translators';
  END IF;
END $$;

CREATE POLICY "Users can view own translator profile" 
ON translators 
FOR SELECT 
USING (user_id = auth.uid());

-- 9. Grant necessary permissions
GRANT ALL ON users TO authenticated;
GRANT ALL ON clients TO authenticated;
GRANT ALL ON translators TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- 10. Test the setup
SELECT 'User registration setup completed. Please test registration.' as status;

COMMIT;
