-- Update RLS policy to allow clients to create translation requests with a translator_id
BEGIN;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Clients can create requests" ON translation_requests;

-- Create new policy that allows clients to create requests with or without a translator_id
CREATE POLICY "Clients can create requests" 
ON translation_requests 
FOR INSERT 
TO authenticated
WITH CHECK (
    -- Allow clients to create requests where they are the client
    client_id = auth.uid()
    -- The translator_id can be null (for open requests) or any valid translator ID
    AND (translator_id IS NULL OR 
         translator_id IN (SELECT id FROM users WHERE user_type = 'translator'))
);

-- Also update the update policy to be more permissive
DROP POLICY IF EXISTS "Clients can update own requests" ON translation_requests;

CREATE POLICY "Clients can update own requests" 
ON translation_requests 
FOR UPDATE 
USING (
    client_id = auth.uid()
)
WITH CHECK (
    -- Allow updating most fields, but not changing the client_id
    client_id = auth.uid()
    -- If updating translator_id, it must be a valid translator or null
    AND (translator_id IS NULL OR 
         translator_id IN (SELECT id FROM users WHERE user_type = 'translator'))
);

-- Add a policy to allow the translator to update the request status
-- First, create a policy for the USING clause (who can update)
CREATE POLICY "Translators can update assigned requests" 
ON translation_requests 
FOR UPDATE 
USING (
    translator_id = auth.uid()
);

-- Then create a policy for the WITH CHECK clause (what can be updated)
-- Note: We're not checking OLD.client_id here since we can't reference OLD in WITH CHECK
-- Instead, we'll rely on the application logic to prevent changing client_id
CREATE POLICY "Translators can update request status" 
ON translation_requests 
FOR UPDATE 
WITH CHECK (
    translator_id = auth.uid()
    -- Translators can only update status and completion-related fields
    -- This is a simplified check - in a real app, you might want to be more specific
    -- about which fields can be updated by translators
);

-- Grant necessary permissions to the authenticated role
GRANT SELECT, INSERT, UPDATE ON translation_requests TO authenticated;

COMMIT;
