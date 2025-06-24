const axios = require('axios');

async function testRegistration() {
  try {
    console.log('Testing registration endpoint...');
    
    const testUser = {
      name: 'Test User',
      email: 'testuser123@example.com',
      password: 'password123',
      userType: 'client',
      gender: 'male',
      agreeToVerification: true
    };
    
    console.log('Sending registration request:', { ...testUser, password: '[REDACTED]' });
    
    const response = await axios.post('http://localhost:5001/api/auth/register', testUser, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Registration successful!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.error('Registration failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testRegistration();