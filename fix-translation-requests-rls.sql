-- Minimal RLS fix for translation_requests
-- This script creates the minimal necessary policies for the translation request flow

BEGIN;

-- 1. First, check if the table exists and has RLS enabled
SELECT 
    tablename, 
    rowsecurity,
    (SELECT count(*) FROM pg_policies WHERE tablename = t.tablename) as policy_count
FROM pg_tables t 
WHERE schemaname = 'public' 
AND tablename = 'translation_requests';

-- 2. Enable RLS if not already enabled
ALTER TABLE translation_requests ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies to avoid conflicts
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'translation_requests') THEN
        EXECUTE 'DROP POLICY IF EXISTS "Allow client insert" ON translation_requests';
        EXECUTE 'DROP POLICY IF EXISTS "Allow client select" ON translation_requests';
        EXECUTE 'DROP POLICY IF EXISTS "Allow translator select" ON translation_requests';
    END IF;
END $$;

-- 4. Create minimal policies
-- Allow clients to insert their own requests
CREATE POLICY "Allow client insert" 
ON translation_requests 
FOR INSERT 
TO authenticated
WITH CHECK (client_id = auth.uid());

-- Allow clients to view their own requests
CREATE POLICY "Allow client select" 
ON translation_requests 
FOR SELECT 
TO authenticated
USING (client_id = auth.uid());

-- Allow translators to view requests assigned to them
CREATE POLICY "Allow translator select" 
ON translation_requests 
FOR SELECT 
TO authenticated
USING (translator_id = auth.uid() OR translator_id IS NULL);

-- 5. Verify the policies were created
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'translation_requests';

-- 6. Test the policies
DO $$
DECLARE
    test_user_id UUID := auth.uid();
    test_translator_id UUID;
    test_request_id UUID;
BEGIN
    -- Get a test translator ID (any user with translator role)
    SELECT id INTO test_translator_id 
    FROM auth.users 
    WHERE raw_user_meta_data->>'user_type' = 'translator' 
    LIMIT 1;
    
    IF test_translator_id IS NULL THEN
        RAISE NOTICE 'No translator found in the database for testing';
    ELSE
        -- Test client insert
        BEGIN
            INSERT INTO translation_requests 
                (client_id, translator_id, status, source_lang, target_lang)
            VALUES 
                (test_user_id, test_translator_id, 'pending', 'en', 'fr')
            RETURNING id INTO test_request_id;
            
            RAISE NOTICE 'Successfully inserted test request with ID: %', test_request_id;
            
            -- Clean up
            DELETE FROM translation_requests WHERE id = test_request_id;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to insert test request: %', SQLERRM;
        END;
    END IF;
END $$;

COMMIT;

-- 7. Show final status
SELECT 
    'RLS policies updated for translation_requests' as message,
    (SELECT count(*) FROM pg_policies WHERE tablename = 'translation_requests') as policy_count;
