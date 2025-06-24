require('dotenv').config();
const bcrypt = require('bcryptjs');
const { supabaseAdmin } = require('../config/supabase');

async function fixAuth() {
  try {
    // 1. First, let's check if the user exists
    const email = 'ouday.kefi@gmail.com';
    const password = 'password123';
    const name = 'Ouday Kefi';
    const userType = 'client';
    
    console.log(`Checking if user with email ${email} exists...`);
    
    const { data: existingUsers, error: queryError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email);
      
    if (queryError) {
      console.error('Error checking user:', queryError);
      return;
    }
    
    // 2. If user exists, delete it to start fresh
    if (existingUsers && existingUsers.length > 0) {
      console.log(`User with email ${email} exists. Deleting...`);
      
      const { error: deleteError } = await supabaseAdmin
        .from('users')
        .delete()
        .eq('email', email);
        
      if (deleteError) {
        console.error('Error deleting user:', deleteError);
        return;
      }
      
      console.log('User deleted successfully.');
    } else {
      console.log(`No user found with email ${email}.`);
    }
    
    // 3. Create a new user with the specified email and password
    console.log(`Creating new user with email ${email}...`);
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const newUser = {
      name,
      email,
      password: hashedPassword,
      user_type: userType,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data: insertedUser, error: insertError } = await supabaseAdmin
      .from('users')
      .insert([newUser])
      .select();
      
    if (insertError) {
      console.error('Error creating user:', insertError);
      return;
    }
    
    console.log('User created successfully:', {
      id: insertedUser[0].id,
      name: insertedUser[0].name,
      email: insertedUser[0].email,
      userType: insertedUser[0].user_type
    });
    
    // 4. Verify that the password works
    console.log('Verifying password...');
    
    const isMatch = await bcrypt.compare(password, insertedUser[0].password);
    console.log(`Password verification result: ${isMatch}`);
    
    if (isMatch) {
      console.log('SUCCESS: User created and password verified.');
      console.log(`You can now log in with email: ${email} and password: ${password}`);
    } else {
      console.log('ERROR: Password verification failed.');
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

fixAuth();
