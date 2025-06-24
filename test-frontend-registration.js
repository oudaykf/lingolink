const axios = require('axios');

// Test frontend registration to debug why it's not saving to database
async function testFrontendRegistration() {
  console.log('Testing frontend registration flow...');
  
  const API_URL = 'http://localhost:5001';
  const testUser = {
    name: 'Frontend Test User',
    email: `frontend-test-${Date.now()}@example.com`,
    password: 'testpassword123',
    userType: 'client'
  };
  
  try {
    console.log('Sending registration request to:', `${API_URL}/api/auth/register`);
    console.log('Request data:', { ...testUser, password: '[REDACTED]' });
    
    const response = await axios.post(`${API_URL}/api/auth/register`, testUser, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('Registration successful!');
    console.log('Response status:', response.status);
    console.log('Response data:', {
      ...response.data,
      token: response.data.token ? response.data.token.substring(0, 20) + '...' : 'No token'
    });
    
    // Now check if user exists in database
    console.log('\nChecking if user was saved to database...');
    
    // Load environment variables for database check
    require('dotenv').config({ path: './server/.env' });
    const { createClient } = require('@supabase/supabase-js');
    
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase credentials');
      return;
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Check users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .eq('email', testUser.email);
    
    if (usersError) {
      console.error('Error checking users table:', usersError);
    } else {
      console.log('Users found:', users?.length || 0);
      if (users && users.length > 0) {
        console.log('User data:', users[0]);
        
        // Check clients table if user is a client
        if (testUser.userType === 'client') {
          const { data: clients, error: clientsError } = await supabase
            .from('clients')
            .select('*')
            .eq('user_id', users[0].id);
          
          if (clientsError) {
            console.error('Error checking clients table:', clientsError);
          } else {
            console.log('Client profiles found:', clients?.length || 0);
            if (clients && clients.length > 0) {
              console.log('Client data:', clients[0]);
            }
          }
        }
      }
    }
    
  } catch (error) {
    console.error('Registration failed!');
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.message);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testFrontendRegistration();