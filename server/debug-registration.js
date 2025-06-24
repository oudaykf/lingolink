require('dotenv').config();
const { supabaseAdmin } = require('./config/supabase');
const { registerUser } = require('./services/userService');

async function debugRegistration() {
  console.log('Starting registration debugging...');
  
  // Test user data
  const testUser = {
    name: 'Debug Test User',
    email: `debug_test_${Date.now()}@example.com`,
    password: 'password123',
    userType: 'client',
    gender: 'male',
    phone: '1234567890',
    birthdate: '1990-01-01',
    agreeToVerification: true
  };
  
  console.log('Test user data:', { ...testUser, password: '[REDACTED]' });
  
  try {
    // Check if user_verification table exists
    console.log('\nChecking if user_verification table exists...');
    const { data: verificationData, error: verificationError } = await supabaseAdmin
      .from('user_verification')
      .select('count')
      .limit(1);
      
    if (verificationError) {
      console.error('user_verification table error:', verificationError);
      
      // Try to create the table
      console.log('Attempting to create user_verification table...');
      try {
        const { error: createTableError } = await supabaseAdmin.rpc('exec_sql', {
          sql: `
            CREATE TABLE IF NOT EXISTS user_verification (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              user_id UUID REFERENCES users(id) ON DELETE CASCADE,
              identity_verified BOOLEAN DEFAULT false,
              face_verified BOOLEAN DEFAULT false,
              verification_status VARCHAR(50) DEFAULT 'pending',
              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
          `
        });
        
        if (createTableError) {
          console.error('Error creating user_verification table:', createTableError);
        } else {
          console.log('user_verification table created successfully');
        }
      } catch (error) {
        console.error('Exception creating user_verification table:', error);
      }
    } else {
      console.log('user_verification table exists');
    }
    
    // Now try to register the user
    console.log('\nAttempting to register user...');
    const result = await registerUser(testUser);
    console.log('Registration successful!', result);
  } catch (error) {
    console.error('Registration failed:', error.message);
    
    if (error.stack) {
      console.error('\nError stack trace:');
      console.error(error.stack);
    }
    
    // Try to identify the specific issue
    if (error.message.includes('user_verification')) {
      console.log('\nThe error appears to be related to the user_verification table.');
    } else if (error.message.includes('email_verified')) {
      console.log('\nThe error appears to be related to the email_verified column.');
    }
  }
}

// Run the debug function
debugRegistration().then(() => {
  console.log('\nDebugging completed');
}).catch(error => {
  console.error('Unexpected error during debugging:', error);
});
