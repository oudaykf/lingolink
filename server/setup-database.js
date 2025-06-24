require('dotenv').config();
const { supabaseAdmin } = require('./config/supabase');

async function setupDatabase() {
  console.log('Starting database setup...');

  try {
    // First, check if exec_sql function exists, if not create it
    console.log('Checking if exec_sql function exists...');
    let execSqlError;
    try {
      const { data, error } = await supabaseAdmin.rpc('exec_sql', {
        sql: 'SELECT 1 as test'
      });
      execSqlError = error;
    } catch (e) {
      execSqlError = e;
    }

    if (execSqlError) {
      console.log('Creating exec_sql function...');

      // Create the exec_sql function
      const { error: createFuncError } = await supabaseAdmin.rpc('create_sql_function', {}).catch(e => ({ error: e }));

      if (createFuncError) {
        console.log('Creating exec_sql function directly...');
        // If the helper function doesn't exist, create exec_sql directly with raw SQL
        const { error: rawSqlError } = await supabaseAdmin.from('_sql').select('*').limit(1).catch(e => ({ error: e }));

        if (rawSqlError) {
          console.log('Creating exec_sql with raw SQL query...');
          // We need to use a raw SQL query, but Supabase JS client doesn't support this directly
          // We'll need to use the REST API directly or modify the approach
          console.error('Could not create exec_sql function automatically. Please run this SQL in the Supabase SQL Editor:');
          console.log(`
-- Create a function to execute arbitrary SQL
CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
RETURNS void AS $$
BEGIN
  EXECUTE sql;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant usage to authenticated users and anon
GRANT EXECUTE ON FUNCTION public.exec_sql(text) TO authenticated, anon;
          `);
        }
      } else {
        console.log('exec_sql function created successfully');
      }
    } else {
      console.log('exec_sql function already exists');
    }

    // Now set up the users table structure
    console.log('\nSetting up users table...');
    const createUsersTableSQL = `
    CREATE TABLE IF NOT EXISTS public.users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      user_type VARCHAR(50) NOT NULL,
      email_verified BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    `;

    // Use exec_sql if it exists, otherwise show the SQL to run
    try {
      await supabaseAdmin.rpc('exec_sql', { sql: createUsersTableSQL });
      console.log('Users table created or updated successfully');
    } catch (error) {
      console.error('Error creating users table:', error.message);
      console.log('Please run this SQL in the Supabase SQL Editor:');
      console.log(createUsersTableSQL);
    }

    // Set up the clients table
    console.log('\nSetting up clients table...');
    const createClientsTableSQL = `
    CREATE TABLE IF NOT EXISTS public.clients (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
      company_name VARCHAR(255),
      full_name VARCHAR(255) NOT NULL,
      phone_number VARCHAR(50),
      address TEXT,
      country VARCHAR(100),
      preferred_languages TEXT[],
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    `;

    try {
      await supabaseAdmin.rpc('exec_sql', { sql: createClientsTableSQL });
      console.log('Clients table created or updated successfully');
    } catch (error) {
      console.error('Error creating clients table:', error.message);
      console.log('Please run this SQL in the Supabase SQL Editor:');
      console.log(createClientsTableSQL);
    }

    // Set up the translators table
    console.log('\nSetting up translators table...');
    const createTranslatorsTableSQL = `
    CREATE TABLE IF NOT EXISTS public.translators (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
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
    `;

    try {
      await supabaseAdmin.rpc('exec_sql', { sql: createTranslatorsTableSQL });
      console.log('Translators table created or updated successfully');
    } catch (error) {
      console.error('Error creating translators table:', error.message);
      console.log('Please run this SQL in the Supabase SQL Editor:');
      console.log(createTranslatorsTableSQL);
    }

    console.log('\nDatabase setup completed successfully!');
  } catch (error) {
    console.error('Database setup failed:', error.message);
    console.error(error);
  }
}

// Run the setup
setupDatabase().catch(console.error);
