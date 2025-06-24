/**
 * Script to check if the required tables exist in the database
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

async function checkTables() {
  try {
    console.log('Checking if required tables exist in the database...');
    
    // List of tables to check
    const tables = ['users', 'clients', 'translators', 'user_verification', 'verification_codes', 'health_check'];
    
    for (const table of tables) {
      try {
        // Try to select a single row from the table
        const { data, error } = await supabaseAdmin
          .from(table)
          .select('*')
          .limit(1);
          
        if (error) {
          console.error(`Error checking table ${table}:`, error);
          console.log(`Table ${table} does not exist or is not accessible`);
        } else {
          console.log(`Table ${table} exists and is accessible`);
        }
      } catch (error) {
        console.error(`Exception checking table ${table}:`, error);
      }
    }
    
    // Check if we can create the clients table
    console.log('\nAttempting to create clients table...');
    
    const { error: createError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS clients (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          company_name VARCHAR(255),
          full_name VARCHAR(255) NOT NULL,
          phone_number VARCHAR(50),
          address TEXT,
          country VARCHAR(100),
          preferred_languages TEXT[],
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `
    });
    
    if (createError) {
      console.error('Error creating clients table:', createError);
    } else {
      console.log('Clients table created or already exists');
    }
    
    // Check if we can create the translators table
    console.log('\nAttempting to create translators table...');
    
    const { error: createTranslatorsError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS translators (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          full_name VARCHAR(255) NOT NULL,
          phone_number VARCHAR(50),
          address TEXT,
          country VARCHAR(100),
          languages TEXT[],
          specializations TEXT[],
          certification TEXT,
          years_of_experience INTEGER,
          hourly_rate DECIMAL(10,2),
          availability_status VARCHAR(20) DEFAULT 'available',
          rating DECIMAL(3,2),
          review_count INTEGER DEFAULT 0,
          completed_projects INTEGER DEFAULT 0,
          on_time_percentage INTEGER DEFAULT 100,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `
    });
    
    if (createTranslatorsError) {
      console.error('Error creating translators table:', createTranslatorsError);
    } else {
      console.log('Translators table created or already exists');
    }
    
  } catch (error) {
    console.error('Error checking tables:', error);
  }
}

// Run the script
checkTables();
