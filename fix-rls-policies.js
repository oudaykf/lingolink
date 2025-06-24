require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.SUPABASE_URL || 'https://tzvoplcsyxfjrsjfvfks.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6dm9wbGNzeXhmanJzamZ2ZmtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mzg1NTY3MiwiZXhwIjoyMDU5NDMxNjcyfQ.oGjgs5RpuFjlVCV9Sy3dgjSeOY90QOphZl2mLnCl4AM';

// Create client with service role key for operations that need to bypass RLS
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

async function fixRlsPolicies() {
  try {
    console.log('Fixing RLS policies...');
    
    // SQL statements to fix RLS policies
    const sqlStatements = [
      // Enable RLS on users table
      'ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;',
      
      // Drop existing policies
      'DROP POLICY IF EXISTS users_insert_policy ON public.users;',
      'DROP POLICY IF EXISTS users_select_policy ON public.users;',
      
      // Create insert policy for registration
      `CREATE POLICY users_insert_policy
       ON public.users
       FOR INSERT
       TO authenticated, anon
       WITH CHECK (true);`,
      
      // Create select policy
      `CREATE POLICY users_select_policy
       ON public.users
       FOR SELECT
       TO authenticated, anon
       USING (true);`,
      
      // Grant permissions
      'GRANT USAGE ON SCHEMA public TO anon;',
      'GRANT ALL ON public.users TO anon;',
      'GRANT ALL ON public.clients TO anon;',
      'GRANT ALL ON public.translators TO anon;'
    ];
    
    // Execute each SQL statement
    for (const sql of sqlStatements) {
      console.log(`Executing SQL: ${sql}`);
      const { data, error } = await supabaseAdmin.rpc('pgexec', { query: sql });
      
      if (error) {
        console.error('Error executing SQL:', error.message);
        console.error('Error details:', error);
      } else {
        console.log('SQL executed successfully');
      }
    }
    
    console.log('RLS policies fixed successfully');
    
  } catch (error) {
    console.error('Exception during RLS policy fix:', error.message);
    console.error(error);
  }
}

// Run the fix
fixRlsPolicies();