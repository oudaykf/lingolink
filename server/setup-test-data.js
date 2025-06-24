// Setup test data using the registration API
const http = require('http');

function setupTestData() {
  console.log('Setting up test data for LingoLink...');
  
  // Create test users using the registration API
  createTestClient();
}

function createTestClient() {
  console.log('\n1. Creating test client...');
  
  const postData = JSON.stringify({
    name: 'Test Client',
    email: 'client@test.com',
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
    console.log(`Client registration status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 201) {
        console.log('✅ Test client created successfully');
        createTestTranslator();
      } else {
        console.log('Client already exists or error:', data);
        createTestTranslator();
      }
    });
  });

  req.on('error', (error) => {
    console.error('Client registration error:', error.message);
  });

  req.write(postData);
  req.end();
}

function createTestTranslator() {
  console.log('\n2. Creating test translator...');
  
  const postData = JSON.stringify({
    name: 'Test Translator',
    email: 'translator@test.com',
    password: '29613676',
    userType: 'translator'
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
    console.log(`Translator registration status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 201) {
        console.log('✅ Test translator created successfully');
        createSecondTranslator();
      } else {
        console.log('Translator already exists or error:', data);
        createSecondTranslator();
      }
    });
  });

  req.on('error', (error) => {
    console.error('Translator registration error:', error.message);
  });

  req.write(postData);
  req.end();
}

function createSecondTranslator() {
  console.log('\n3. Creating second translator...');
  
  const postData = JSON.stringify({
    name: 'Maria Rodriguez',
    email: 'maria@translator.com',
    password: '29613676',
    userType: 'translator'
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
    console.log(`Second translator registration status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 201) {
        console.log('✅ Second translator created successfully');
      } else {
        console.log('Second translator already exists or error:', data);
      }
      
      // Wait a moment then test login
      setTimeout(() => {
        testClientLogin();
      }, 1000);
    });
  });

  req.on('error', (error) => {
    console.error('Second translator registration error:', error.message);
  });

  req.write(postData);
  req.end();
}

function testClientLogin() {
  console.log('\n4. Testing client login...');
  
  const postData = JSON.stringify({
    email: 'client@test.com',
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
    console.log(`Client login status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        const response = JSON.parse(data);
        console.log('✅ Client login successful');
        testTranslatorLogin(response.token);
      } else {
        console.log('❌ Client login failed:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Client login error:', error.message);
  });

  req.write(postData);
  req.end();
}

function testTranslatorLogin(clientToken) {
  console.log('\n5. Testing translator login...');
  
  const postData = JSON.stringify({
    email: 'translator@test.com',
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
    console.log(`Translator login status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        const response = JSON.parse(data);
        console.log('✅ Translator login successful');
        testMessagingAPI(response.token);
      } else {
        console.log('❌ Translator login failed:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Translator login error:', error.message);
  });

  req.write(postData);
  req.end();
}

function testMessagingAPI(translatorToken) {
  console.log('\n6. Testing messaging API...');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/messages/conversations',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${translatorToken}`
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Messaging API status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        const conversations = JSON.parse(data);
        console.log(`✅ Messaging API working - Found ${conversations.length} conversations`);
      } else {
        console.log('❌ Messaging API failed:', data);
      }
      
      console.log('\n🎉 Test data setup completed!');
    });
  });

  req.on('error', (error) => {
    console.error('Messaging API error:', error.message);
  });

  req.end();
}

setupTestData();
