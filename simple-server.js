const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

// Mock authentication endpoints for testing
app.post('/api/auth/login', (req, res) => {
  // Set proper JSON content type
  res.setHeader('Content-Type', 'application/json');

  const { email, password } = req.body;

  // Mock user for testing - you can use these credentials to test
  if (email === 'test@example.com' && password === 'password123') {
    res.status(200).json({
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        user_type: 'client'
      },
      token: 'mock-jwt-token'
    });
  } else {
    res.status(401).json({
      message: 'Invalid email or password. Try: test@example.com / password123'
    });
  }
});

app.post('/api/auth/register', (req, res) => {
  // Set proper JSON content type
  res.setHeader('Content-Type', 'application/json');

  const { email, password, name, userType } = req.body;

  // Mock registration success
  res.status(201).json({
    user: {
      id: Date.now(),
      email,
      name,
      user_type: userType
    },
    token: 'mock-jwt-token',
    message: 'Registration successful'
  });
});

app.get('/api/auth/me', (req, res) => {
  // Set proper JSON content type
  res.setHeader('Content-Type', 'application/json');

  // Mock current user endpoint
  res.json({
    user: {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      user_type: 'client'
    }
  });
});

app.post('/api/auth/check-email-type', (req, res) => {
  // Set proper JSON content type
  res.setHeader('Content-Type', 'application/json');

  const { email, userType } = req.body;

  // Mock response - for testing, let's say the email doesn't exist
  res.json({
    exists: false,
    conflictingType: null
  });
});

// Simple health check on main server
app.get('/health', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({
    status: 'ok',
    message: 'Main server is running!',
    database: 'mock',
    timestamp: new Date().toISOString(),
    apiServer: 'http://localhost:5001'
  });
});

// Serve React app for specific routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Main server running on http://localhost:${PORT}`);
  console.log(`Mock login: any registered email / 29613676`);
});
