/**
 * Script to test the authentication system
 * This script tests user registration, login, and fetching user data
 */

require('dotenv').config();
const { supabaseAdmin } = require('../config/supabase');
const { registerUser, loginUser, getUserById } = require('../services/userService');

async function testAuthSystem() {
  console.log('Testing authentication system...');
  
  try {
    // First, ensure tables are set up
    await checkTables();
    
    // Generate a unique email for testing
    const testEmail = `test-user-${Date.now()}@example.com`;
    const testPassword = 'Password123';
    
    // Test client registration
    console.log('\n--- Testing Client Registration ---');
    const clientData = {
      name: 'Test Client',
      email: testEmail,
      password: testPassword,
      userType: 'client',
      gender: 'male',
      phone: '1234567890',
      birthdate: '1990-01-01',
      agreeToVerification: true,
      fullName: 'Test Client User',
      address: '123 Test Street',
      country: 'Test Country',
      companyName: 'Test Company',
      languages: ['English', 'French']
    };
    
    const clientResult = await registerUser(clientData);
    console.log('Client registration result:', {
      success: !!clientResult,
      userId: clientResult?.user?.id,
      userType: clientResult?.user?.userType,
      email: clientResult?.user?.email
    });
    
    // Test client login
    console.log('\n--- Testing Client Login ---');
    const clientLoginResult = await loginUser(testEmail, testPassword);
    console.log('Client login result:', {
      success: !!clientLoginResult,
      userId: clientLoginResult?.user?.id,
      userType: clientLoginResult?.user?.userType,
      email: clientLoginResult?.user?.email,
      hasProfile: !!clientLoginResult?.user?.profile
    });
    
    if (clientLoginResult?.user?.profile) {
      console.log('Client profile data:', {
        fullName: clientLoginResult.user.profile.full_name,
        companyName: clientLoginResult.user.profile.company_name,
        country: clientLoginResult.user.profile.country,
        languages: clientLoginResult.user.profile.preferred_languages
      });
    }
    
    // Test getUserById
    console.log('\n--- Testing Get User By ID ---');
    const getUserResult = await getUserById(clientLoginResult.user.id);
    console.log('Get user result:', {
      success: !!getUserResult,
      userId: getUserResult?.id,
      userType: getUserResult?.userType,
      email: getUserResult?.email,
      hasProfile: !!getUserResult?.profile
    });
    
    // Test translator registration
    console.log('\n--- Testing Translator Registration ---');
    const translatorEmail = `test-translator-${Date.now()}@example.com`;
    const translatorData = {
      name: 'Test Translator',
      email: translatorEmail,
      password: testPassword,
      userType: 'translator',
      gender: 'female',
      phone: '0987654321',
      birthdate: '1985-05-15',
      agreeToVerification: true,
      fullName: 'Test Translator User',
      address: '456 Translator Avenue',
      country: 'Translator Country',
      languages: ['English', 'Spanish', 'German'],
      specializations: ['Legal', 'Technical'],
      certification: 'Certified Professional Translator',
      yearsOfExperience: 5,
      hourlyRate: 25
    };
    
    const translatorResult = await registerUser(translatorData);
    console.log('Translator registration result:', {
      success: !!translatorResult,
      userId: translatorResult?.user?.id,
      userType: translatorResult?.user?.userType,
      email: translatorResult?.user?.email
    });
    
    // Test translator login
    console.log('\n--- Testing Translator Login ---');
    const translatorLoginResult = await loginUser(translatorEmail, testPassword);
    console.log('Translator login result:', {
      success: !!translatorLoginResult,
      userId: translatorLoginResult?.user?.id,
      userType: translatorLoginResult?.user?.userType,
      email: translatorLoginResult?.user?.email,
      hasProfile: !!translatorLoginResult?.user?.profile
    });
    
    if (translatorLoginResult?.user?.profile) {
      console.log('Translator profile data:', {
        fullName: translatorLoginResult.user.profile.full_name,
        languages: translatorLoginResult.user.profile.languages,
        specializations: translatorLoginResult.user.profile.specializations,
        certification: translatorLoginResult.user.profile.certification,
        yearsOfExperience: translatorLoginResult.user.profile.years_of_experience,
        hourlyRate: translatorLoginResult.user.profile.hourly_rate
      });
    }
    
    console.log('\n--- Testing Complete ---');
    console.log('Authentication system is working correctly!');
    
    // Clean up test users
    await cleanupTestUsers([clientLoginResult.user.id, translatorLoginResult.user.id]);
    
  } catch (error) {
    console.error('Error testing authentication system:', error);
  }
}

// Check if required tables exist
async function checkTables() {
  console.log('Checking if required tables exist...');
  
  // Check users table
  const { error: usersError } = await supabaseAdmin
    .from('users')
    .select('count')
    .limit(1);
    
  if (usersError) {
    console.error('Users table error:', usersError);
    throw new Error('Users table does not exist or is not accessible');
  }
  
  // Check clients table
  const { error: clientsError } = await supabaseAdmin
    .from('clients')
    .select('count')
    .limit(1);
    
  if (clientsError) {
    console.error('Clients table error:', clientsError);
    throw new Error('Clients table does not exist or is not accessible');
  }
  
  // Check translators table
  const { error: translatorsError } = await supabaseAdmin
    .from('translators')
    .select('count')
    .limit(1);
    
  if (translatorsError) {
    console.error('Translators table error:', translatorsError);
    throw new Error('Translators table does not exist or is not accessible');
  }
  
  console.log('All required tables exist and are accessible');
}

// Clean up test users
async function cleanupTestUsers(userIds) {
  console.log('\n--- Cleaning up test users ---');
  
  for (const userId of userIds) {
    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userId);
      
    if (error) {
      console.error(`Error deleting test user ${userId}:`, error);
    } else {
      console.log(`Successfully deleted test user ${userId}`);
    }
  }
}

// Run the test
testAuthSystem();
