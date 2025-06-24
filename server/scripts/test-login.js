require('dotenv').config();
const bcrypt = require('bcryptjs');
const { supabaseAdmin } = require('../config/supabase');

async function testLogin() {
  try {
    const email = 'ouday.kefi@gmail.com';
    const password = 'password123'; // Replace with your actual password

    console.log(`Testing login for email: ${email} with password: ${password}`);

    // Find user
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email);

    if (error) {
      console.error('Error finding user:', error);
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
      passwordHash: user.password,
      userType: user.user_type
    });

    // Test password
    console.log(`Testing password: "${password}" against hash: ${user.password}`);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      // Update password for testing
      console.log('Password does not match. Updating password...');

      const salt = await bcrypt.genSalt(10);
      const newHash = await bcrypt.hash(password, salt);
      console.log('New hash generated:', newHash);

      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({ password: newHash })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating password:', updateError);
      } else {
        console.log('Password updated successfully');

        // Verify the update
        const { data: updatedUser, error: fetchError } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (fetchError) {
          console.error('Error fetching updated user:', fetchError);
        } else {
          console.log('Updated user password hash:', updatedUser.password);

          // Test the new password
          const newIsMatch = await bcrypt.compare(password, updatedUser.password);
          console.log('New password match result:', newIsMatch);
        }
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testLogin();
