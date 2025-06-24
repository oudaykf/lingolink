require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Simple in-memory user database for testing
const users = [];

// Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, userType } = req.body;

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      userType: userType || 'client',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, userType: newUser.userType },
      process.env.JWT_SECRET || 'your_jwt_secret_here',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        userType: newUser.userType
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, userType: user.userType },
      process.env.JWT_SECRET || 'your_jwt_secret_here',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Middleware to verify token
const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_here');
    const user = users.find(user => user.id === decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

app.get('/api/auth/me', auth, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      userType: req.user.userType
    }
  });
});

// Check if email exists
app.post('/api/auth/check-email', (req, res) => {
  const { email } = req.body;
  const exists = users.some(user => user.email === email);
  res.json({ exists });
});

// Check if email exists with specific user type
app.post('/api/auth/check-email-type', (req, res) => {
  const { email, userType } = req.body;
  const user = users.find(user => user.email === email);

  if (!user) {
    return res.json({ exists: false, conflictingType: null });
  }

  const exists = user.userType === userType;
  const conflictingType = exists ? null : user.userType;

  res.json({ exists, conflictingType });
});

// Translations routes
const translations = [];

app.get('/api/translations', auth, (req, res) => {
  const userTranslations = translations.filter(t => t.userId === req.user.id);
  res.json(userTranslations);
});

app.post('/api/translations', auth, (req, res) => {
  try {
    const { sourceLanguage, targetLanguage, originalText } = req.body;

    // Simple word count calculation
    const wordCount = originalText.split(/\\s+/).filter(Boolean).length;

    const newTranslation = {
      id: Date.now().toString(),
      userId: req.user.id,
      sourceLanguage,
      targetLanguage,
      originalText,
      translatedText: '',
      status: 'pending',
      wordCount,
      createdAt: new Date().toISOString()
    };

    translations.push(newTranslation);
    res.status(201).json(newTranslation);
  } catch (error) {
    console.error('Create translation error:', error);
    res.status(500).json({ message: 'Error creating translation', error: error.message });
  }
});

// Start server
const PORT = 5001; // Use a different port
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT}/health to check server status`);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', users: users.length, translations: translations.length });
});
