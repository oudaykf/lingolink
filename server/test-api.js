const axios = require('axios');

const API_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('Testing LingoLink API...');

  try {
    // Test health endpoint
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_URL}/health`);
    console.log('✅ Health check:', healthResponse.data);

    // Test admin login
    console.log('\n2. Testing admin login...');
    const adminLoginResponse = await axios.post(`${API_URL}/api/auth/admin-login`, {
      email: 'ouday.kefi@gmail.com',
      password: 'Ouday.12345'
    });
    console.log('✅ Admin login successful:', adminLoginResponse.data);

    // Test user registration
    console.log('\n3. Testing user registration...');
    const registerResponse = await axios.post(`${API_URL}/api/auth/register`, {
      name: 'Test User',
      email: 'test@example.com',
      password: '29613676',
      userType: 'client'
    });
    console.log('✅ Registration successful:', registerResponse.data);

    // Test user login
    console.log('\n4. Testing user login...');
    const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
      email: 'test@example.com',
      password: '29613676'
    });
    console.log('✅ Login successful:', loginResponse.data);

    console.log('\n🎉 All API tests passed!');

  } catch (error) {
    console.error('\n❌ API test failed:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    console.error('URL:', error.config?.url);
  }
}

testAPI();
