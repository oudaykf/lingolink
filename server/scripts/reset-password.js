require('dotenv').config();
const bcrypt = require('bcryptjs');
const { supabaseAdmin } = require('../config/supabase');

async function resetPassword() {
  try {
    // Email and new password
    const email = 'ouday.kefi@gmail.com';
    const newPassword = 'password123';
    
    console.log(`Resetting password for user with email: ${email}`);
    
    // Generate hash
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    console.log('New password hash:', passwordHash);
    
    // Update user
    const { error } = await supabaseAdmin
      .from('users')
      .update({ password: passwordHash })
      .eq('email', email);
      
    if (error) {
      console.error('Error updating password:', error);
    } else {
      console.log('Password updated successfully');
    }
    
    // Verify the update
    const { data: users, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email);
      
    if (fetchError) {
      console.error('Error fetching updated user:', fetchError);
      return;
    }
    
    if (users && users.length > 0) {
      console.log('Updated user:', {
        id: users[0].id,
        name: users[0].name,
        email: users[0].email,
        passwordHash: users[0].password
      });
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

resetPassword();
