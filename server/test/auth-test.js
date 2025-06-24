const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { supabase } = require('../config/supabase');

// Test JWT token generation and validation
async function testAuthFlow() {
  try {
    // Test user data
    const testUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      userType: 'client'
    };

    // Generate token
    const token = jwt.sign(
      { userId: testUser.id, userType: testUser.userType },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Generated token:', token);

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token verification successful:', decoded);
    } catch (error) {
      console.error('Token verification failed:', error.message);
    }

    // Test password hashing
    const password = 'testPassword123';
    const hashedPassword = await bcrypt.hash(password, 10);
    const passwordMatch = await bcrypt.compare(password, hashedPassword);

    console.log('Password hash test:', passwordMatch ? 'Success' : 'Failed');

  } catch (error) {
    console.error('Auth flow test failed:', error);
  }
}

// Run the test
testAuthFlow().then(() => {
  console.log('Auth flow test completed');
}).catch(error => {
  console.error('Test execution failed:', error);
});