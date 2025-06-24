// Debug JWT token issue
const jwt = require('jsonwebtoken');
const http = require('http');
require('dotenv').config();

function debugJWT() {
  console.log('Debugging JWT token issue...');
  
  // First get a token by logging in
  const postData = JSON.stringify({
    email: 'translator@test.com',
    password: '29613676'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Login status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        const response = JSON.parse(data);
        console.log('✅ Login successful');
        
        // Decode the JWT token to see what's inside
        const token = response.token;
        console.log('\nToken received:', token.substring(0, 50) + '...');
        
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          console.log('\nDecoded token:', JSON.stringify(decoded, null, 2));
          
          // Check what user ID we're looking for
          const userId = decoded.userId || decoded.id;
          console.log(`\nUser ID from token: ${userId}`);
          
          // Now test the messaging API with detailed debugging
          testMessagingWithDebug(token, userId);
          
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      } else {
        console.log('❌ Login failed:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Login error:', error.message);
  });

  req.write(postData);
  req.end();
}

function testMessagingWithDebug(token, expectedUserId) {
  console.log('\nTesting messaging API with debug info...');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/messages/conversations',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Messaging API status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response:', data);
      
      // Now let's manually check the database for this user
      checkUserInDatabase(expectedUserId);
    });
  });

  req.on('error', (error) => {
    console.error('Messaging API error:', error.message);
  });

  req.end();
}

function checkUserInDatabase(userId) {
  console.log(`\nChecking database for user ID: ${userId}`);
  
  // Use the check-users script functionality
  const { createClient } = require('@supabase/supabase-js');
  
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  // Check if user exists
  supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .then(({ data, error }) => {
      if (error) {
        console.error('Database error:', error);
      } else {
        console.log(`Found ${data.length} users with ID ${userId}:`);
        data.forEach(user => {
          console.log(`  - ${user.name} (${user.email}) - ${user.user_type}`);
        });
        
        if (data.length === 0) {
          console.log('❌ No user found with this ID');
        } else if (data.length > 1) {
          console.log('⚠️  Multiple users found with same ID (this should not happen)');
        } else {
          console.log('✅ Exactly one user found - this should work');
        }
      }
      
      console.log('\n🔍 Debug completed');
    });
}

debugJWT();
