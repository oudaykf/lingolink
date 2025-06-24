// Test user registration with the current API
const http = require('http');

function testRegistration() {
  console.log('Testing user registration with current API...');
  
  const postData = JSON.stringify({
    name: 'Port Test User',
    email: 'porttest@example.com',
    password: '29613676',
    userType: 'client'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Registration status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Registration response:', data);
      
      if (res.statusCode === 201) {
        console.log('✅ Registration successful!');
        testLogin();
      } else {
        console.log('❌ Registration failed');
      }
    });
  });

  req.on('error', (error) => {
    console.error('Registration error:', error.message);
  });

  req.write(postData);
  req.end();
}

function testLogin() {
  console.log('\nTesting user login...');
  
  const postData = JSON.stringify({
    email: 'porttest@example.com',
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
      console.log('Login response:', data);
      
      if (res.statusCode === 200) {
        console.log('✅ Login successful!');
      } else {
        console.log('❌ Login failed');
      }
    });
  });

  req.on('error', (error) => {
    console.error('Login error:', error.message);
  });

  req.write(postData);
  req.end();
}

testRegistration();
