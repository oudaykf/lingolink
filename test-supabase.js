require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://tzvoplcsyxfjrsjfvfks.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6dm9wbGNzeXhmanJzamZ2ZmtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NTU2NzIsImV4cCI6MjA1OTQzMTY3Mn0.Pj805bCcraF42LpWWuVPrfQys2RIw_YtOpbo2lG1IjQ';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6dm9wbGNzeXhmanJzamZ2ZmtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mzg1NTY3MiwiZXhwIjoyMDU5NDMxNjcyfQ.oGjgs5RpuFjlVCV9Sy3dgjSeOY90QOphZl2mLnCl4AM';

console.log('URL:', supabaseUrl);
console.log('Key exists:', !!supabaseKey);
console.log('Service Role Key exists:', !!supabaseServiceRoleKey);

// Create client with anonymous key for general operations
const supabase = createClient(supabaseUrl, supabaseKey);

// Create client with service role key for operations that need to bypass RLS
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.from('users').select('count').limit(1);

    if (error) {
      console.error('Supabase connection error:', error.message);
      console.error('Error details:', error);
    } else {
      console.log('Supabase connection successful');
      console.log('Users count data:', data);
    }
  } catch (connError) {
    console.error('Supabase connection exception:', connError.message);
  }
}

async function testAdminConnection() {
  try {
    console.log('\nTesting Supabase Admin connection...');
    const { data, error } = await supabaseAdmin.from('users').select('count').limit(1);

    if (error) {
      console.error('Supabase Admin connection error:', error.message);
      console.error('Error details:', error);
    } else {
      console.log('Supabase Admin connection successful');
      console.log('Users count data:', data);
    }
  } catch (connError) {
    console.error('Supabase Admin connection exception:', connError.message);
  }
}

// Run tests
testConnection();
testAdminConnection();