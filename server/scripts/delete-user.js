require('dotenv').config();
const { supabaseAdmin } = require('../config/supabase');

async function deleteUser(email) {
  try {
    console.log(`Attempting to delete user with email: ${email}`);
    
    // First, check if the user exists
    const { data: users, error: queryError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email);
      
    if (queryError) {
      console.error('Error querying user:', queryError);
      return;
    }
    
    if (!users || users.length === 0) {
      console.log(`No user found with email: ${email}`);
      return;
    }
    
    console.log(`Found user:`, users[0]);
    
    // Delete the user
    const { error: deleteError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('email', email);
      
    if (deleteError) {
      console.error('Error deleting user:', deleteError);
    } else {
      console.log(`User with email ${email} deleted successfully`);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.error('Please provide an email address as a command line argument');
  console.log('Usage: node delete-user.js <email>');
  process.exit(1);
}

deleteUser(email);
