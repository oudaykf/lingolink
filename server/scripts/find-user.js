require('dotenv').config();
const { supabaseAdmin } = require('../config/supabase');

async function findUser() {
  try {
    const email = 'ouday.kefi@gmail.com';
    
    console.log(`Searching for user with email: ${email}`);
    
    // Try exact match
    const { data: exactUsers, error: exactError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email);
      
    if (exactError) {
      console.error('Error with exact search:', exactError);
    } else {
      console.log(`Exact match found ${exactUsers.length} users:`);
      console.log(JSON.stringify(exactUsers, null, 2));
    }
    
    // Try case-insensitive match
    const { data: ilikeUsers, error: ilikeError } = await supabaseAdmin
      .from('users')
      .select('*')
      .ilike('email', email);
      
    if (ilikeError) {
      console.error('Error with ilike search:', ilikeError);
    } else {
      console.log(`Case-insensitive match found ${ilikeUsers.length} users:`);
      console.log(JSON.stringify(ilikeUsers, null, 2));
    }
    
    // Try with lowercase
    const { data: lowerUsers, error: lowerError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase());
      
    if (lowerError) {
      console.error('Error with lowercase search:', lowerError);
    } else {
      console.log(`Lowercase match found ${lowerUsers.length} users:`);
      console.log(JSON.stringify(lowerUsers, null, 2));
    }
    
    // Get all users
    const { data: allUsers, error: allError } = await supabaseAdmin
      .from('users')
      .select('*');
      
    if (allError) {
      console.error('Error getting all users:', allError);
    } else {
      console.log(`Total users in database: ${allUsers.length}`);
      console.log('All emails:');
      allUsers.forEach(user => {
        console.log(`- ${user.email} (${user.user_type})`);
      });
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

findUser();
