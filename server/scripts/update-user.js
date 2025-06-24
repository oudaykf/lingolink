require('dotenv').config();
console.log('Starting update script...');
const { supabaseAdmin } = require('../config/supabase');

async function updateUser() {
  try {
    const email = 'kefiouday@gmail.com';

    console.log(`Looking for user with email: ${email}`);

    // Find the user
    const { data: user, error: findError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (findError) {
      console.error('Error finding user:', findError);
      return;
    }

    if (!user) {
      console.log(`No user found with email: ${email}`);
      return;
    }

    console.log('Current user data:', user);

    // Update the user's name
    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        name: 'Ouday Kefi',
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select();

    if (updateError) {
      console.error('Error updating user:', updateError);
      return;
    }

    console.log('User updated successfully:', updatedUser);

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

updateUser();
