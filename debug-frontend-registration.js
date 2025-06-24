const axios = require('axios');

// Debug frontend registration by testing different scenarios
async function debugFrontendRegistration() {
  console.log('=== DEBUGGING FRONTEND REGISTRATION ===\n');
  
  const API_URL = 'http://localhost:5001';
  
  // Test 1: Exact same request as frontend would send
  console.log('Test 1: Simulating exact frontend request...');
  const testUser1 = {
    name: 'Frontend Debug User',
    email: `frontend-debug-${Date.now()}@example.com`,
    password: 'testpassword123',
    userType: 'client'
  };
  
  try {
    const response = await axios.post(`${API_URL}/api/auth/register`, testUser1, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000
    });
    
    console.log('✅ Registration successful');
    console.log('Response:', {
      status: response.status,
      user: response.data.user,
      hasToken: !!response.data.token
    });
    
  } catch (error) {
    console.log('❌ Registration failed');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else {
      console.log('Network error:', error.message);
    }
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 2: Check server health
  console.log('Test 2: Checking server health...');
  try {
    const healthResponse = await axios.get(`${API_URL}/api/health`, {
      timeout: 5000
    });
    console.log('✅ Server is healthy:', healthResponse.data);
  } catch (error) {
    console.log('❌ Server health check failed:', error.message);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 3: Check if there are any validation issues
  console.log('Test 3: Testing validation edge cases...');
  
  // Test with missing fields
  const invalidUser = {
    name: '',
    email: 'invalid-email',
    password: '123', // too short
    userType: 'client'
  };
  
  try {
    await axios.post(`${API_URL}/api/auth/register`, invalidUser, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    console.log('❌ Should have failed validation');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ Validation working correctly:', error.response.data.error);
    } else {
      console.log('❌ Unexpected error:', error.message);
    }
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 4: Check database connection
  console.log('Test 4: Checking database connection...');
  
  require('dotenv').config({ path: './server/.env' });
  const { createClient } = require('@supabase/supabase-js');
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.log('❌ Missing Supabase credentials');
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Database connection failed:', error.message);
    } else {
      console.log('✅ Database connection working');
    }
  } catch (error) {
    console.log('❌ Database error:', error.message);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 5: Check recent registrations
  console.log('Test 5: Checking recent registrations...');
  
  try {
    const { data: recentUsers, error } = await supabase
      .from('users')
      .select('id, name, email, user_type, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) {
      console.log('❌ Error fetching recent users:', error.message);
    } else {
      console.log('✅ Recent registrations:');
      recentUsers.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.name} (${user.email}) - ${user.user_type} - ${new Date(user.created_at).toLocaleString()}`);
      });
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  console.log('\n=== DEBUG COMPLETE ===');
}

debugFrontendRegistration();