const axios = require('axios');
require('dotenv').config({ path: './server/.env' });
const { createClient } = require('@supabase/supabase-js');

async function testRegistrationAndCheck() {
  try {
    console.log('=== Testing Registration and Database Check ===');
    
    // Initialize Supabase clients
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Create a unique test user
    const timestamp = Date.now();
    const testUser = {
      name: 'Test User ' + timestamp,
      email: `testuser${timestamp}@example.com`,
      password: 'password123',
      userType: 'client',
      gender: 'male',
      agreeToVerification: true
    };
    
    console.log('\n1. Registering new user:', { ...testUser, password: '[REDACTED]' });
    
    // Register the user
    const response = await axios.post('http://localhost:5001/api/auth/register', testUser, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Registration successful!');
    console.log('User ID:', response.data.user.id);
    const userId = response.data.user.id;
    
    // Wait a moment for database to update
    console.log('\n2. Waiting 2 seconds for database to update...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check with regular client (subject to RLS)
    console.log('\n3. Checking with regular Supabase client (subject to RLS):');
    const { data: userWithRLS, error: rlsError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (rlsError) {
      console.log('RLS Error:', rlsError.message);
    } else {
      console.log('User found with RLS:', userWithRLS);
    }
    
    // Check with admin client (bypasses RLS)
    console.log('\n4. Checking with admin Supabase client (bypasses RLS):');
    const { data: userWithAdmin, error: adminError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (adminError) {
      console.log('Admin Error:', adminError.message);
    } else {
      console.log('User found with admin:', userWithAdmin);
    }
    
    // Check clients table
    console.log('\n5. Checking clients table with admin client:');
    const { data: clientProfile, error: clientError } = await supabaseAdmin
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (clientError) {
      console.log('Client Error:', clientError.message);
    } else {
      console.log('Client profile found:', clientProfile);
    }
    
    // List all users with admin client
    console.log('\n6. Listing all users with admin client:');
    const { data: allUsers, error: allUsersError } = await supabaseAdmin
      .from('users')
      .select('id, name, email, user_type, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (allUsersError) {
      console.log('All users error:', allUsersError.message);
    } else {
      console.log('All users found:', allUsers.length);
      allUsers.forEach(user => {
        console.log(`- ${user.id} | ${user.name} | ${user.email} | ${user.user_type}`);
      });
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testRegistrationAndCheck();