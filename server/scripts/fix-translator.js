require('dotenv').config();
const { supabaseAdmin } = require('../config/supabase');

async function fixTranslator() {
  try {
    console.log('Starting fix translator script...');
    
    // Update the user directly
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ 
        name: 'Ouday Kefi (Translator)',
      })
      .eq('email', 'kefiouday@gmail.com')
      .select();
      
    if (error) {
      console.error('Error updating user:', error);
      return;
    }
    
    console.log('User updated successfully:', data);
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

fixTranslator();
