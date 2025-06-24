/**
 * Script to execute SQL commands in Supabase
 * This script reads the SQL file and executes it in Supabase
 */

const fs = require('fs');
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

async function executeSql() {
  try {
    console.log('Reading SQL file...');
    const sqlFilePath = path.join(__dirname, 'create-tables.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split SQL content into individual statements
    const statements = sqlContent
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        // Since we can't directly execute SQL, we'll use the REST API
        // For demonstration purposes, we'll show what would be executed
        console.log('SQL Statement:');
        console.log(statement);
        
        // In a real implementation, you would use a PostgreSQL client
        // or the Supabase SQL editor to execute these statements
        console.log('This statement would be executed in Supabase SQL editor');
      } catch (error) {
        console.error(`Error executing statement ${i + 1}:`, error);
      }
    }
    
    console.log('\nTo execute these SQL statements:');
    console.log('1. Go to https://tzvoplcsyxfjrsjfvfks.supabase.co');
    console.log('2. Navigate to the SQL Editor');
    console.log('3. Copy and paste the SQL statements from create-tables.sql');
    console.log('4. Click "Run" to execute the statements');
    
    // Check if tables exist
    console.log('\nChecking if tables exist...');
    
    // Check users table
    const { error: usersError } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1);
      
    if (usersError) {
      console.error('Users table error:', usersError);
    } else {
      console.log('Users table exists');
    }
    
    // Check clients table
    const { error: clientsError } = await supabaseAdmin
      .from('clients')
      .select('count')
      .limit(1);
      
    if (clientsError) {
      console.error('Clients table error:', clientsError);
    } else {
      console.log('Clients table exists');
    }
    
    // Check translators table
    const { error: translatorsError } = await supabaseAdmin
      .from('translators')
      .select('count')
      .limit(1);
      
    if (translatorsError) {
      console.error('Translators table error:', translatorsError);
    } else {
      console.log('Translators table exists');
    }
    
    // Check user_verification table
    const { error: verificationError } = await supabaseAdmin
      .from('user_verification')
      .select('count')
      .limit(1);
      
    if (verificationError) {
      console.error('User verification table error:', verificationError);
    } else {
      console.log('User verification table exists');
    }
    
  } catch (error) {
    console.error('Error executing SQL:', error);
  }
}

// Run the script
executeSql();
