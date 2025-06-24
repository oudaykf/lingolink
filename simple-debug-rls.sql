-- Simple debug script to test RLS policies
BEGIN;

-- 1. First, check current RLS status
SELECT 
    tablename, 
    rowsecurity,
    (SELECT count(*) FROM pg_policies WHERE tablename = t.tablename) as policy_count
FROM pg_tables t 
WHERE schemaname = 'public' 
AND tablename IN ('translation_requests', 'conversations', 'messages');

-- 2. Create a test function to check permissions
CREATE OR REPLACE FUNCTION test_permissions() RETURNS TABLE (
    operation TEXT,
    status TEXT,
    error_message TEXT
) AS $$
BEGIN
    -- Test SELECT on translation_requests
    BEGIN
        PERFORM 1 FROM translation_requests LIMIT 1;
        operation := 'SELECT translation_requests';
        status := 'SUCCESS';
        error_message := NULL;
        RETURN NEXT;
    EXCEPTION WHEN OTHERS THEN
        operation := 'SELECT translation_requests';
        status := 'FAILED';
        error_message := SQLERRM;
        RETURN NEXT;
    END;

    -- Test INSERT into translation_requests
    BEGIN
        INSERT INTO translation_requests (client_id, status, source_lang, target_lang)
        VALUES (auth.uid(), 'pending', 'en', 'fr');
        
        operation := 'INSERT translation_requests';
        status := 'SUCCESS';
        error_message := NULL;
        
        -- Clean up
        DELETE FROM translation_requests 
        WHERE client_id = auth.uid() 
        AND status = 'pending' 
        AND source_lang = 'en' 
        AND target_lang = 'fr';
        
        RETURN NEXT;
    EXCEPTION WHEN OTHERS THEN
        operation := 'INSERT translation_requests';
        status := 'FAILED';
        error_message := SQLERRM;
        RETURN NEXT;
    END;
    
    -- Test storage access
    BEGIN
        PERFORM 1 FROM storage.buckets LIMIT 1;
        operation := 'SELECT storage.buckets';
        status := 'SUCCESS';
        error_message := NULL;
        RETURN NEXT;
    EXCEPTION WHEN OTHERS THEN
        operation := 'SELECT storage.buckets';
        status := 'FAILED';
        error_message := SQLERRM;
        RETURN NEXT;
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Run the test function
SELECT * FROM test_permissions();

-- 4. Show current user and role
SELECT 
    current_user as current_user,
    current_setting('role') as current_role,
    session_user as session_user,
    current_schema() as current_schema;

-- 5. Show current RLS policies
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
WHERE schemaname IN ('public', 'storage')
AND tablename IN ('translation_requests', 'conversations', 'messages', 'objects')
ORDER BY schemaname, tablename;

-- 6. Show grants for the authenticated role
SELECT 
    grantee,
    table_schema,
    table_name,
    privilege_type
FROM information_schema.role_table_grants
WHERE grantee = 'authenticated'
AND table_schema IN ('public', 'storage')
ORDER BY table_schema, table_name;

COMMIT;
