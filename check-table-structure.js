require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://tzvoplcsyxfjrsjfvfks.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6dm9wbGNzeXhmanJzamZ2ZmtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mzg1NTY3MiwiZXhwIjoyMDU5NDMxNjcyfQ.oGjgs5RpuFjlVCV9Sy3dgjSeOY90QOphZl2mLnCl4AM';

// Create client with service role key for operations that need to bypass RLS
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

async function checkTableStructure() {
  try {
    console.log('Checking users table structure...');
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error:', error);
    } else if (data && data.length > 0) {
      console.log('Column names:', Object.keys(data[0]));
    } else {
      console.log('No data found in users table');
    }
    
    // Check clients table
    console.log('\nChecking clients table structure...');
    const { data: clientsData, error: clientsError } = await supabaseAdmin
      .from('clients')
      .select('*')
      .limit(1);
    
    if (clientsError) {
      console.error('Error:', clientsError);
    } else if (clientsData && clientsData.length > 0) {
      console.log('Column names:', Object.keys(clientsData[0]));
    } else {
      console.log('No data found in clients table');
    }
    
    // Check translators table
    console.log('\nChecking translators table structure...');
    const { data: translatorsData, error: translatorsError } = await supabaseAdmin
      .from('translators')
      .select('*')
      .limit(1);
    
    if (translatorsError) {
      console.error('Error:', translatorsError);
    } else if (translatorsData && translatorsData.length > 0) {
      console.log('Column names:', Object.keys(translatorsData[0]));
    } else {
      console.log('No data found in translators table');
    }
    
  } catch (e) {
    console.error('Exception:', e);
  }
}

// Run check
checkTableStructure();