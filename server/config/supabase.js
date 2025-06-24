const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://tzvoplcsyxfjrsjfvfks.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseKey) {
  console.error('SUPABASE_KEY is not defined in environment variables');
}

if (!supabaseServiceRoleKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is not defined in environment variables');
}

// Create client with anonymous key for general operations
const supabase = createClient(supabaseUrl, supabaseKey);

// Create client with service role key for operations that need to bypass RLS
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// Test connection function
const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('health_check').select('*').limit(1);
    
    if (error) {
      throw error;
    }
    
    console.log('Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Supabase connection error:', error.message);
    return false;
  }
};

module.exports = { supabase, supabaseAdmin, testConnection };
