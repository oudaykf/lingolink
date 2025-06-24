require('dotenv').config();
const { registerUser } = require('./services/userService');
const { supabase, supabaseAdmin } = require('./config/supabase');

async function testRegistration() {
  console.log('Starting registration test...');

  // Test Supabase connection first
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.from('users').select('count').limit(1);

    if (error) {
      console.error('Supabase connection error:', error.message);
      console.error('Error details:', error);
    } else {
      console.log('Supabase connection successful');
      console.log('Users count data:', data);
    }
  } catch (connError) {
    console.error('Supabase connection exception:', connError.message);
  }

  // Check if exec_sql function exists
  try {
    console.log('\nTesting exec_sql function...');
    const { data, error } = await supabaseAdmin.rpc('exec_sql', {
      sql: 'SELECT 1 as test'
    });

    if (error) {
      console.error('exec_sql function error:', error.message);
      console.error('Error details:', error);
    } else {
      console.log('exec_sql function exists and works');
    }
  } catch (execError) {
    console.error('exec_sql function exception:', execError.message);
  }

  // Check if tables exist
  try {
    console.log('\nChecking if tables exist...');

    // Check clients table
    const { data: clientsData, error: clientsError } = await supabaseAdmin
      .from('clients')
      .select('count')
      .limit(1);

    if (clientsError) {
      console.error('Clients table error:', clientsError.message);
    } else {
      console.log('Clients table exists');
    }

    // Check translators table
    const { data: translatorsData, error: translatorsError } = await supabaseAdmin
      .from('translators')
      .select('count')
      .limit(1);

    if (translatorsError) {
      console.error('Translators table error:', translatorsError.message);
    } else {
      console.log('Translators table exists');
    }
  } catch (tableError) {
    console.error('Table check exception:', tableError.message);
  }

  // Now test user registration
  try {
    console.log('\nAttempting to register a test user...');
    const testUser = {
      name: 'Test Translator',
      email: `translator${Date.now()}@example.com`, // Use timestamp to avoid duplicate email
      password: 'password123',
      userType: 'translator'
    };

    console.log('Registration data:', testUser);

    const result = await registerUser(testUser);
    console.log('Registration successful:', result);
  } catch (error) {
    console.error('Registration failed:', error.message);

    // Log more detailed error information
    if (error.stack) {
      console.error('\nError stack trace:');
      console.error(error.stack);
    }

    // Check if it's a Supabase error
    if (error.code) {
      console.error('\nError code:', error.code);
    }
  }
}

// Run the test
testRegistration().then(() => {
  console.log('\nTest completed');
}).catch(err => {
  console.error('Unexpected error during test:', err);
});