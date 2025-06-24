require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');

const supabaseUrl = process.env.SUPABASE_URL || 'https://tzvoplcsyxfjrsjfvfks.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6dm9wbGNzeXhmanJzamZ2ZmtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mzg1NTY3MiwiZXhwIjoyMDU5NDMxNjcyfQ.oGjgs5RpuFjlVCV9Sy3dgjSeOY90QOphZl2mLnCl4AM';

// Create client with service role key for operations that need to bypass RLS
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

async function testAdminRegistration() {
  try {
    console.log('Testing registration with admin client...');
    
    // Generate a unique email
    const timestamp = new Date().getTime();
    const email = `test${timestamp}@example.com`;
    const password = 'Password123!';
    
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const testUser = {
      name: 'Test User',
      email: email,
      password: hashedPassword,
      user_type: 'client',
      gender: 'male',
      phone: '1234567890',
      birthdate: '1990-01-01',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('Attempting to insert user:', testUser.email);
    
    // Insert into users table
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .insert([
        testUser
      ])
      .select();
    
    if (userError) {
      console.error('Error inserting user:', userError.message);
      console.error('Error details:', userError);
      return;
    }
    
    console.log('User inserted successfully:', userData);
    
    // Insert into clients table
    if (testUser.user_type === 'client') {
      const clientData = {
        user_id: userData[0].id,
        full_name: testUser.name,
        email: testUser.email,
        phone_number: testUser.phone,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data: clientResult, error: clientError } = await supabaseAdmin
        .from('clients')
        .insert([clientData])
        .select();
      
      if (clientError) {
        console.error('Error inserting client profile:', clientError.message);
        console.error('Error details:', clientError);
      } else {
        console.log('Client profile created successfully:', clientResult);
      }
    }
    
    // Check if user exists in the database
    const { data: checkData, error: checkError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', testUser.email);
    
    if (checkError) {
      console.error('Error checking user:', checkError.message);
    } else {
      console.log('User verification result:', checkData);
    }
    
  } catch (error) {
    console.error('Exception during admin registration test:', error.message);
    console.error(error);
  }
}

// Run test
testAdminRegistration();