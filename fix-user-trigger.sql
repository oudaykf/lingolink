-- Script to fix user registration trigger
BEGIN;

-- 1. Check if the function exists
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- 2. Drop and recreate the function with proper error handling
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  -- First, insert into public.users
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
    COALESCE(NEW.created_at, NOW()), 
    COALESCE(NEW.updated_at, NOW()),
    (NEW.raw_user_meta_data->>'user_type')::user_type_enum,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) 
  DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = EXCLUDED.updated_at,
    user_type = EXCLUDED.user_type,
    name = EXCLUDED.name;

  -- Then insert into clients or translators table based on user_type
  IF (NEW.raw_user_meta_data->>'user_type')::text = 'client' THEN
    INSERT INTO public.clients (user_id, created_at, updated_at)
    VALUES (NEW.id, NOW(), NOW())
    ON CONFLICT (user_id) DO NOTHING;
  ELSIF (NEW.raw_user_meta_data->>'user_type')::text = 'translator' THEN
    INSERT INTO public.translators (user_id, created_at, updated_at)
    VALUES (NEW.id, NOW(), NOW())
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
  RETURN NEW; -- Still return NEW to allow auth to complete
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create or replace the trigger
DO $$
BEGIN
  -- Drop the trigger if it exists
  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  
  -- Create the trigger
  CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  
  RAISE NOTICE 'Trigger created successfully';
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error creating trigger: %', SQLERRM;
END $$;

-- 4. Check RLS policies on public.users
SELECT 
  tablename, 
  rowsecurity,
  (SELECT count(*) FROM pg_policies WHERE tablename = t.tablename) as policy_count
FROM pg_tables t 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'clients', 'translators');

-- 5. Set up RLS policies if they don't exist
DO $$
BEGIN
  -- Enable RLS on users table
  EXECUTE 'ALTER TABLE public.users ENABLE ROW LEVEL SECURITY';
  
  -- Create policy to allow users to view their own profile
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can view own profile') THEN
    EXECUTE 'CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id)';
  END IF;
  
  -- Enable RLS on clients table
  EXECUTE 'ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY';
  
  -- Create policy to allow users to view their own client profile
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'clients' AND policyname = 'Users can view own client profile') THEN
    EXECUTE 'CREATE POLICY "Users can view own client profile" ON public.clients FOR SELECT USING (auth.uid() = user_id)';
  END IF;
  
  RAISE NOTICE 'RLS policies verified/created';
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error setting up RLS: %', SQLERRM;
END $$;

-- 6. Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated, service_role;

-- 7. Check if the trigger is working by looking at recent signups
SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data->>'user_type' as user_type,
  u.created_at as auth_created_at,
  pu.created_at as public_user_created_at,
  c.id as client_id,
  t.id as translator_id
FROM auth.users u
LEFT JOIN public.users pu ON u.id = pu.id
LEFT JOIN public.clients c ON u.id = c.user_id
LEFT JOIN public.translators t ON u.id = t.user_id
WHERE u.created_at > NOW() - INTERVAL '1 day'
ORDER BY u.created_at DESC;

COMMIT;
