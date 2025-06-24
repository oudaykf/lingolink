require('dotenv').config();
const { supabase, supabaseAdmin } = require('../config/supabase');

async function checkConstraints() {
  try {
    console.log('Checking database constraints...');

    // Try to insert a test user
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      user_type: 'client',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Attempting to insert test user:', testUser);

    const { data, error } = await supabaseAdmin
      .from('users')
      .insert([testUser])
      .select();

    if (error) {
      console.error('Error inserting test user:', error);
    } else {
      console.log('Test user inserted successfully:', data);

      // Clean up - delete the test user
      const { error: deleteError } = await supabaseAdmin
        .from('users')
        .delete()
        .eq('email', 'test@example.com');

      if (deleteError) {
        console.error('Error deleting test user:', deleteError);
      } else {
        console.log('Test user deleted successfully');
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

checkConstraints();
