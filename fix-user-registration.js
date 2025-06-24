require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function main() {
  try {
    // Get environment variables
    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing required environment variables. Please set REACT_APP_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    }

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    });

    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'fix-user-trigger.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');

    console.log('Executing SQL script...');
    
    // Execute the SQL script
    const { data, error } = await supabase.rpc('exec_sql', { query: sql });

    if (error) {
      console.error('Error executing SQL:', error);
      process.exit(1);
    }

    console.log('SQL script executed successfully!');
    console.log('User registration should now work correctly.');
    console.log('Please try registering a new account.');
    
  } catch (error) {
    console.error('An error occurred:', error.message);
    process.exit(1);
  }
}

main();
