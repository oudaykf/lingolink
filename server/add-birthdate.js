require('dotenv').config();
const { supabaseAdmin } = require('./config/supabase');

async function addBirthdateColumn() {
  console.log('Adding birthdate column to users table...');
  
  try {
    const { error } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        -- Add birthdate column if it doesn't exist
        DO $$ 
        BEGIN
          IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'birthdate'
          ) THEN
            ALTER TABLE public.users ADD COLUMN birthdate DATE;
          END IF;
        END $$;
      `
    });
    
    if (error) {
      console.error('Error adding birthdate column:', error);
    } else {
      console.log('Birthdate column added successfully or already exists');
    }
  } catch (error) {
    console.error('Exception adding birthdate column:', error);
  }
}

// Run the function
addBirthdateColumn().then(() => {
  console.log('Done');
}).catch(error => {
  console.error('Unexpected error:', error);
});
