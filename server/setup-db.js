require('dotenv').config();
const { supabase } = require('./config/supabase');

async function setupDatabase() {
  console.log('Setting up database tables...');
  
  try {
    // Create users table
    console.log('Creating users table...');
    const { error: usersError } = await supabase.rpc('create_users_table');
    
    if (usersError) {
      console.error('Error creating users table:', usersError);
      
      // Try direct SQL approach
      console.log('Trying direct SQL approach...');
      const { error: sqlError } = await supabase.from('users').select('*').limit(1);
      
      if (sqlError && sqlError.code === '42P01') { // relation "users" does not exist
        console.log('Creating users table with SQL...');
        const { error: createError } = await supabase.rpc('execute_sql', {
          sql_query: `
            CREATE TABLE IF NOT EXISTS users (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              name TEXT NOT NULL,
              email TEXT UNIQUE NOT NULL,
              password TEXT NOT NULL,
              user_type TEXT NOT NULL CHECK (user_type IN ('client', 'translator')),
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `
        });
        
        if (createError) {
          console.error('Error creating users table with SQL:', createError);
          return false;
        }
      }
    }
    
    // Create translations table
    console.log('Creating translations table...');
    const { error: translationsError } = await supabase.rpc('create_translations_table');
    
    if (translationsError) {
      console.error('Error creating translations table:', translationsError);
      
      // Try direct SQL approach
      console.log('Trying direct SQL approach...');
      const { error: sqlError } = await supabase.from('translations').select('*').limit(1);
      
      if (sqlError && sqlError.code === '42P01') { // relation "translations" does not exist
        console.log('Creating translations table with SQL...');
        const { error: createError } = await supabase.rpc('execute_sql', {
          sql_query: `
            CREATE TABLE IF NOT EXISTS translations (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              user_id UUID NOT NULL,
              source_language TEXT NOT NULL,
              target_language TEXT NOT NULL,
              original_text TEXT NOT NULL,
              translated_text TEXT,
              status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
              word_count INTEGER NOT NULL,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              completed_at TIMESTAMP WITH TIME ZONE,
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `
        });
        
        if (createError) {
          console.error('Error creating translations table with SQL:', createError);
          return false;
        }
      }
    }
    
    console.log('Database setup completed successfully!');
    return true;
  } catch (error) {
    console.error('Unexpected error during database setup:', error);
    return false;
  }
}

// Run the setup
setupDatabase()
  .then(success => {
    console.log('Setup completed with status:', success ? 'SUCCESS' : 'FAILED');
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Error running setup:', error);
    process.exit(1);
  });
