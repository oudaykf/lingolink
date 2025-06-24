const axios = require('axios');

const API_URL = 'http://localhost:3000';

async function createTestAccounts() {
  console.log('Creating test accounts for LingoLink platform...');

  const testUsers = [
    {
      name: 'Test Client',
      email: 'client@test.com',
      password: '29613676',
      userType: 'client',
      phone: '+1234567890'
    },
    {
      name: 'Test Translator',
      email: 'translator@test.com',
      password: '29613676',
      userType: 'translator',
      phone: '+1234567891',
      languages: ['English', 'French', 'Spanish'],
      specializations: ['Technical', 'Legal', 'Business']
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah.translator@test.com',
      password: '29613676',
      userType: 'translator',
      phone: '+1234567892',
      languages: ['English', 'German', 'Italian'],
      specializations: ['Medical', 'Scientific', 'Pharmaceutical']
    },
    {
      name: 'Admin User',
      email: 'admin@test.com',
      password: '29613676',
      userType: 'admin'
    }
  ];

  const createdUsers = [];

  for (const user of testUsers) {
    try {
      console.log(`Creating ${user.userType}: ${user.email}...`);
      
      const response = await axios.post(`${API_URL}/api/auth/register`, user);
      
      if (response.status === 201) {
        console.log(`✓ Created ${user.userType}: ${user.email}`);
        createdUsers.push({
          ...response.data.user,
          token: response.data.token
        });
      }
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message === 'User already exists') {
        console.log(`⚠ User already exists: ${user.email}`);
        
        // Try to login instead
        try {
          const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
            email: user.email,
            password: user.password
          });
          
          if (loginResponse.status === 200) {
            console.log(`✓ Logged in existing user: ${user.email}`);
            createdUsers.push({
              ...loginResponse.data.user,
              token: loginResponse.data.token
            });
          }
        } catch (loginError) {
          console.error(`✗ Failed to login existing user ${user.email}:`, loginError.response?.data?.message || loginError.message);
        }
      } else {
        console.error(`✗ Failed to create ${user.email}:`, error.response?.data?.message || error.message);
      }
    }
  }

  // Create some test translation requests
  const client = createdUsers.find(u => u.userType === 'client');
  if (client) {
    console.log('\nCreating test translation requests...');
    
    const testRequests = [
      {
        title: 'Legal Document Translation',
        description: 'Need to translate a legal contract from English to French. The document contains standard business terms and conditions.',
        sourceLanguage: 'English',
        targetLanguage: 'French',
        wordCount: 1500,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        budget: 180.00,
        specialRequirements: 'Certified translation required for legal purposes',
        urgency: 'normal'
      },
      {
        title: 'Medical Research Paper',
        description: 'Translation of a medical research paper from English to German. Requires expertise in medical terminology.',
        sourceLanguage: 'English',
        targetLanguage: 'German',
        wordCount: 3000,
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        budget: 450.00,
        specialRequirements: 'Medical translation expertise required',
        urgency: 'normal'
      },
      {
        title: 'Technical Manual Translation',
        description: 'Translation of a software technical manual from English to Spanish.',
        sourceLanguage: 'English',
        targetLanguage: 'Spanish',
        wordCount: 2500,
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        budget: 300.00,
        specialRequirements: 'Technical expertise in software documentation',
        urgency: 'normal'
      }
    ];

    for (const request of testRequests) {
      try {
        const response = await axios.post(`${API_URL}/api/translation-requests`, request, {
          headers: {
            'Authorization': `Bearer ${client.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.status === 201) {
          console.log(`✓ Created translation request: ${request.title}`);
        }
      } catch (error) {
        console.error(`✗ Failed to create request "${request.title}":`, error.response?.data?.message || error.message);
      }
    }
  }

  console.log('\n🎉 Test accounts setup completed!');
  console.log('\nTest Accounts Created:');
  console.log('📧 Client: client@test.com (password: 29613676)');
  console.log('🌐 Translator 1: translator@test.com (password: 29613676)');
  console.log('🌐 Translator 2: sarah.translator@test.com (password: 29613676)');
  console.log('👑 Admin: admin@test.com (password: 29613676)');
  console.log('\n🚀 You can now test the platform with these accounts!');
  console.log('\n📋 Testing Instructions:');
  console.log('1. Open http://localhost:3001 in your browser');
  console.log('2. Login with any of the test accounts above');
  console.log('3. Test the messaging system between client and translators');
  console.log('4. Test translation request creation and management');
  console.log('5. Test the verification system');
  console.log('6. Test the admin panel with the admin account');
}

// Run the setup if this file is executed directly
if (require.main === module) {
  createTestAccounts().then(() => {
    console.log('Setup complete');
    process.exit(0);
  }).catch(error => {
    console.error('Setup failed:', error);
    process.exit(1);
  });
}

module.exports = { createTestAccounts };
