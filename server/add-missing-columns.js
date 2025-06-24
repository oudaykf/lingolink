require('dotenv').config();
const { supabaseAdmin } = require('./config/supabase');

async function addMissingColumns() {
  console.log('Adding missing columns to users table...');
  
  try {
    const { error } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        -- Add gender column if it doesn't exist
        DO $$ 
        BEGIN
          IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'gender'
          ) THEN
            ALTER TABLE public.users ADD COLUMN gender VARCHAR(20) DEFAULT 'male';
          END IF;
        END $$;
        
        -- Add phone column if it doesn't exist
        DO $$ 
        BEGIN
          IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'phone'
          ) THEN
            ALTER TABLE public.users ADD COLUMN phone VARCHAR(50);
          END IF;
        END $$;
      `
    });
    
    if (error) {
      console.error('Error adding missing columns:', error);
    } else {
      console.log('Missing columns added successfully or already exist');
    }
  } catch (error) {
    console.error('Exception adding missing columns:', error);
  }
}

// Run the function
addMissingColumns().then(() => {
  console.log('Done');
}).catch(error => {
  console.error('Unexpected error:', error);
});
