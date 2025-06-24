/**
 * Script to check the schema of the users table
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Manually set environment variables if they're not loaded from .env
if (!process.env.SUPABASE_URL) {
  process.env.SUPABASE_URL = 'https://tzvoplcsyxfjrsjfvfks.supabase.co';
  process.env.SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6dm9wbGNzeXhmanJzamZ2ZmtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NTU2NzIsImV4cCI6MjA1OTQzMTY3Mn0.Pj805bCcraF42LpWWuVPrfQys2RIw_YtOpbo2lG1IjQ';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6dm9wbGNzeXhmanJzamZ2ZmtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mzg1NTY3MiwiZXhwIjoyMDU5NDMxNjcyfQ.oGjgs5RpuFjlVCV9Sy3dgjSeOY90QOphZl2mLnCl4AM';
  process.env.JWT_SECRET = '+PRSBnUVTfads9HxNyCEBBLAqIkF//6PmGhN9lbi96BGwMFStiKYslVJcc6ILaDbKgkB/bkA+PWcAxpEljNRlQ==';
  console.log('Environment variables set manually');
}

const { createClient } = require('@supabase/supabase-js');

// Create Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

async function checkSchema() {
  try {
    console.log('Checking schema of the users table...');
    
    // Get a user from the database to check the schema
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('*')
      .limit(1);
      
    if (usersError) {
      console.error('Error fetching users:', usersError);
      return;
    }
    
    if (!users || users.length === 0) {
      console.log('No users found in the database');
      return;
    }
    
    // Get the schema of the users table
    const user = users[0];
    console.log('User schema:');
    console.log(Object.keys(user));
    
    // Print the user object
    console.log('\nUser object:');
    console.log(user);
    
  } catch (error) {
    console.error('Error checking schema:', error);
  }
}

// Run the script
checkSchema();
