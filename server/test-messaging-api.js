// Test messaging and translation requests API
const http = require('http');

function testAPI() {
  console.log('Testing LingoLink Messaging and Translation Requests API...');
  
  // Test admin login first to get a token
  testAdminLogin();
}

function testAdminLogin() {
  console.log('\n1. Testing admin login...');
  
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
      if (res.statusCode === 200) {
        const response = JSON.parse(data);
        console.log('✅ Admin login successful');
        testUserLogin(response.token);
      } else {
        console.log('❌ Admin login failed:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Admin login error:', error.message);
  });

  req.write(postData);
  req.end();
}

function testUserLogin(adminToken) {
  console.log('\n2. Testing user login...');
  
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
    console.log(`User login status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        const response = JSON.parse(data);
        console.log('✅ User login successful');
        testMessagingAPI(response.token);
      } else {
        console.log('❌ User login failed:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('User login error:', error.message);
  });

  req.write(postData);
  req.end();
}

function testMessagingAPI(userToken) {
  console.log('\n3. Testing messaging API...');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/messages/conversations',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${userToken}`
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Conversations API status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        const conversations = JSON.parse(data);
        console.log(`✅ Conversations API working - Found ${conversations.length} conversations`);
        testTranslationRequestsAPI(userToken);
      } else {
        console.log('❌ Conversations API failed:', data);
        testTranslationRequestsAPI(userToken);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Conversations API error:', error.message);
  });

  req.end();
}

function testTranslationRequestsAPI(userToken) {
  console.log('\n4. Testing translation requests API...');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/translation-requests/available',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${userToken}`
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Translation requests API status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        const requests = JSON.parse(data);
        console.log(`✅ Translation requests API working - Found ${requests.length} requests`);
      } else {
        console.log('❌ Translation requests API failed:', data);
      }
      
      console.log('\n🎉 API testing completed!');
    });
  });

  req.on('error', (error) => {
    console.error('Translation requests API error:', error.message);
  });

  req.end();
}

testAPI();
