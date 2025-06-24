require('dotenv').config();
const { supabaseAdmin } = require('./config/supabase');

async function fixDatabase() {
  console.log('Fixing database structure...');
  
  try {
    const { error } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        -- Ensure all columns exist in users table
        ALTER TABLE public.users ADD COLUMN IF NOT EXISTS gender VARCHAR(20) DEFAULT 'male';
        ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
        ALTER TABLE public.users ADD COLUMN IF NOT EXISTS birthdate DATE;
        ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;
        ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false;
      `
    });
    
    if (error) {
      console.error('Error fixing database structure:', error);
    } else {
      console.log('Database structure fixed successfully');
    }
  } catch (error) {
    console.error('Exception fixing database structure:', error);
  }
}

// Run the function
fixDatabase().then(() => {
  console.log('Done');
}).catch(error => {
  console.error('Unexpected error:', error);
});
