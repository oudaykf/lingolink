// Simple test without axios
const http = require('http');

function testAPI() {
  console.log('Testing API with simple HTTP request...');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response:', data);
      
      // Test admin login
      testAdminLogin();
    });
  });

  req.on('error', (error) => {
    console.error('Error:', error.message);
  });

  req.end();
}

function testAdminLogin() {
  console.log('\nTesting admin login...');
  
  const postData = JSON.stringify({
    email: 'ouday.kefi@gmail.com',
    password: 'Ouday.12345'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/admin-login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Admin login status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Admin login response:', data);
    });
  });

  req.on('error', (error) => {
    console.error('Admin login error:', error.message);
  });

  req.write(postData);
  req.end();
}

testAPI();
