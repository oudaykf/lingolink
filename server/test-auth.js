require('dotenv').config();
const bcrypt = require('bcryptjs');
const { supabase } = require('./config/supabase');

// Test function to check if email exists
async function checkEmailExists(email) {
  try {
    console.log(`Checking if email exists: ${email}`);
    
    const { data, error } = await supabase
      .from('users')
      .select('email, user_type')
      .eq('email', email);
    
    if (error) {
      console.error('Error checking email:', error);
      return { success: false, error: error.message };
    }
    
    const exists = data && data.length > 0;
    console.log(`Email exists: ${exists}`);
    
    if (exists) {
      console.log(`User type: ${data[0].user_type}`);
    }
    
    return { 
      success: true, 
      exists,
      userType: exists ? data[0].user_type : null
    };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error: error.message };
  }
}

// Test function to register a user
async function registerUser(userData) {
  try {
    const { name, email, password, userType } = userData;
    console.log(`Registering user: ${name}, ${email}, ${userType}`);
    
    // Check if user already exists
    const { success, exists, userType: existingUserType, error } = await checkEmailExists(email);
    
    if (!success) {
      return { success: false, error };
    }
    
    if (exists) {
      if (existingUserType === userType) {
        return { 
          success: false, 
          error: `An account with this email already exists as a ${userType}` 
        };
      } else {
        return { 
          success: false, 
          error: `This email is already registered as a ${existingUserType}. Please use a different email for ${userType} registration` 
        };
      }
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert new user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([
        { 
          name, 
          email, 
          password: hashedPassword, 
          user_type: userType,
          created_at: new Date().toISOString()
        }
      ])
      .select();
    
    if (insertError) {
      console.error('Error creating user:', insertError);
      return { success: false, error: insertError.message };
    }
    
    console.log('User registered successfully:', newUser[0].id);
    return { 
      success: true, 
      user: {
        id: newUser[0].id,
        name: newUser[0].name,
        email: newUser[0].email,
        userType: newUser[0].user_type
      }
    };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error: error.message };
  }
}

// Test function to login a user
async function loginUser(email, password) {
  try {
    console.log(`Logging in user: ${email}`);
    
    // Find user
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);
    
    if (error) {
      console.error('Error finding user:', error);
      return { success: false, error: error.message };
    }
    
    if (!data || data.length === 0) {
      return { success: false, error: 'Invalid email or password' };
    }
    
    const user = data[0];
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { success: false, error: 'Invalid email or password' };
    }
    
    console.log('User logged in successfully:', user.id);
    return { 
      success: true, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.user_type
      }
    };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error: error.message };
  }
}

// Run tests
async function runTests() {
  console.log('='.repeat(50));
  console.log('AUTHENTICATION TESTS');
  console.log('='.repeat(50));
  
  // Test 1: Check if email exists
  console.log('\nTest 1: Check if email exists');
  const emailCheckResult = await checkEmailExists('test@example.com');
  console.log('Result:', emailCheckResult);
  
  // Test 2: Register a client user
  console.log('\nTest 2: Register a client user');
  const clientRegisterResult = await registerUser({
    name: 'Test Client',
    email: 'client@example.com',
    password: 'password123',
    userType: 'client'
  });
  console.log('Result:', clientRegisterResult);
  
  // Test 3: Register a translator user
  console.log('\nTest 3: Register a translator user');
  const translatorRegisterResult = await registerUser({
    name: 'Test Translator',
    email: 'translator@example.com',
    password: 'password123',
    userType: 'translator'
  });
  console.log('Result:', translatorRegisterResult);
  
  // Test 4: Try to register with the same email but different user type
  console.log('\nTest 4: Try to register with the same email but different user type');
  const duplicateRegisterResult = await registerUser({
    name: 'Duplicate User',
    email: 'client@example.com',
    password: 'password123',
    userType: 'translator'
  });
  console.log('Result:', duplicateRegisterResult);
  
  // Test 5: Login with valid credentials
  console.log('\nTest 5: Login with valid credentials');
  const loginResult = await loginUser('client@example.com', 'password123');
  console.log('Result:', loginResult);
  
  // Test 6: Login with invalid credentials
  console.log('\nTest 6: Login with invalid credentials');
  const invalidLoginResult = await loginUser('client@example.com', 'wrongpassword');
  console.log('Result:', invalidLoginResult);
  
  // Test 7: Login with non-existent email
  console.log('\nTest 7: Login with non-existent email');
  const nonExistentLoginResult = await loginUser('nonexistent@example.com', 'password123');
  console.log('Result:', nonExistentLoginResult);
  
  console.log('\nTests completed!');
}

// Run the tests
runTests()
  .then(() => {
    console.log('All tests completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error running tests:', error);
    process.exit(1);
  });
