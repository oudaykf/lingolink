-- Script to investigate and fix duplicate email issues
BEGIN;

-- 1. Check for duplicate emails in auth.users (case insensitive)
WITH email_counts AS (
  SELECT 
    LOWER(email) as normalized_email,
    COUNT(*) as count,
    array_agg(id) as user_ids,
    array_agg(email) as emails
  FROM auth.users
  GROUP BY LOWER(email)
  HAVING COUNT(*) > 1
)
SELECT 
  'auth.users' as table_name,
  normalized_email,
  count,
  user_ids,
  emails
FROM email_counts
ORDER BY count DESC;

-- 2. Check for emails in auth.users that are soft-deleted
SELECT 
  'auth.users (deleted)' as table_name,
  LOWER(email) as normalized_email,
  id,
  email,
  deleted_at,
  'Soft-deleted user' as status
FROM auth.users
WHERE deleted_at IS NOT NULL
ORDER BY email;

-- 3. Check for emails in auth.users that are not in public.users
SELECT 
  'auth.users (not in public.users)' as table_name,
  a.id,
  a.email,
  a.raw_user_meta_data->>'user_type' as user_type,
  a.created_at
FROM auth.users a
LEFT JOIN public.users p ON a.id = p.id
WHERE p.id IS NULL
AND a.deleted_at IS NULL
ORDER BY a.email;

-- 4. Check for case sensitivity issues in public.users
SELECT 
  'public.users (case sensitivity check)' as table_name,
  LOWER(email) as normalized_email,
  COUNT(*) as count,
  array_agg(id) as user_ids,
  array_agg(email) as emails
FROM public.users
GROUP BY LOWER(email)
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- 5. Find any inconsistencies between auth.users and public.users
SELECT 
  'Inconsistencies' as check_type,
  a.id,
  a.email as auth_email,
  p.email as public_email,
  a.raw_user_meta_data->>'user_type' as auth_user_type,
  p.user_type as public_user_type,
  CASE 
    WHEN a.email != p.email THEN 'Email mismatch'
    WHEN a.raw_user_meta_data->>'user_type' != p.user_type::text THEN 'User type mismatch'
    ELSE 'Other inconsistency'
  END as issue
FROM auth.users a
JOIN public.users p ON a.id = p.id
WHERE a.deleted_at IS NULL
AND (
  a.email != p.email 
  OR a.raw_user_meta_data->>'user_type' != p.user_type::text
)
ORDER BY a.email;

-- 6. Create a function to fix user sync issues
CREATE OR REPLACE FUNCTION public.sync_user_to_public()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or insert into public.users
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

  -- Insert into clients or translators table if needed
  IF NEW.raw_user_meta_data->>'user_type' = 'client' THEN
    INSERT INTO public.clients (user_id, created_at, updated_at)
    VALUES (NEW.id, NOW(), NOW())
    ON CONFLICT (user_id) DO NOTHING;
  ELSIF NEW.raw_user_meta_data->>'user_type' = 'translator' THEN
    INSERT INTO public.translators (user_id, created_at, updated_at)
    VALUES (NEW.id, NOW(), NOW())
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create a function to manually fix a user by email
CREATE OR REPLACE FUNCTION public.fix_user_sync(email_to_fix TEXT)
RETURNS JSONB AS $$
DECLARE
  auth_user RECORD;
  result JSONB;
BEGIN
  -- Get the auth user
  SELECT * INTO auth_user 
  FROM auth.users 
  WHERE LOWER(email) = LOWER(email_to_fix)
  AND deleted_at IS NULL
  ORDER BY created_at DESC
  LIMIT 1;

  IF auth_user.id IS NULL THEN
    RETURN jsonb_build_object(
      'status', 'error',
      'message', 'No active user found with email: ' || email_to_fix
    );
  END IF;

  -- Call the sync function
  PERFORM public.sync_user_to_public()
  FROM (SELECT auth_user.*) as u;

  RETURN jsonb_build_object(
    'status', 'success',
    'message', 'User sync completed for: ' || email_to_fix,
    'user_id', auth_user.id,
    'email', auth_user.email,
    'user_type', auth_user.raw_user_meta_data->>'user_type'
  );
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'status', 'error',
    'message', SQLERRM,
    'detail', SQLSTATE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Show instructions for fixing specific users
SELECT 'To fix a specific user, run: SELECT * FROM public.fix_user_sync(''user@example.com'');' as instructions;

-- 9. Show summary of issues found
SELECT 
  'Summary' as check_type,
  (SELECT COUNT(*) FROM auth.users WHERE deleted_at IS NULL) as active_auth_users,
  (SELECT COUNT(*) FROM public.users) as public_users,
  (SELECT COUNT(*) FROM auth.users WHERE deleted_at IS NOT NULL) as deleted_auth_users,
  (SELECT COUNT(DISTINCT LOWER(email)) FROM auth.users WHERE deleted_at IS NULL) as unique_emails,
  (SELECT COUNT(*) FROM (
    SELECT LOWER(email) as email 
    FROM auth.users 
    WHERE deleted_at IS NULL 
    GROUP BY LOWER(email) 
    HAVING COUNT(*) > 1
  ) as dupes) as duplicate_emails;

COMMIT;
