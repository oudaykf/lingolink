require('dotenv').config();
const bcrypt = require('bcryptjs');
const { supabaseAdmin } = require('../config/supabase');

async function testBcrypt() {
  try {
    // Test email
    const email = 'ouday.kefi@gmail.com';

    // Get user from database
    console.log(`Fetching user with email: ${email}`);
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email);

    if (error) {
      console.error('Error fetching user:', error);
      return;
    }

    if (!users || users.length === 0) {
      console.log('No user found with this email');
      return;
    }

    const user = users[0];
    console.log('User found:', {
      id: user.id,
      name: user.name,
      email: user.email,
      hashedPassword: user.password,
      userType: user.user_type
    });

    // Test password
    const testPassword = 'password123'; // Replace with the password you're using
    console.log(`Testing password: "${testPassword}" against hash: ${user.password}`);

    const isMatch = await bcrypt.compare(testPassword, user.password);
    console.log('Password match result:', isMatch);

    // Generate a new hash for comparison
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(testPassword, salt);
    console.log('New hash generated:', newHash);

    // Update user with new password hash for testing
    const updatePassword = true; // Set to true to update the password
    if (updatePassword) {
      console.log('Updating user password...');
      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({ password: newHash })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating password:', updateError);
      } else {
        console.log('Password updated successfully');
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testBcrypt();
