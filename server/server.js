const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// Manually set environment variables if they're not loaded from .env
if (!process.env.SUPABASE_URL) {
  process.env.SUPABASE_URL = 'https://tzvoplcsyxfjrsjfvfks.supabase.co';
  process.env.SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6dm9wbGNzeXhmanJzamZ2ZmtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NTU2NzIsImV4cCI6MjA1OTQzMTY3Mn0.Pj805bCcraF42LpWWuVPrfQys2RIw_YtOpbo2lG1IjQ';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6dm9wbGNzeXhmanJzamZ2ZmtzIiwicm9zZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mzg1NTY3MiwiZXhwIjoyMDU5NDMxNjcyfQ.oGjgs5RpuFjlVCV9Sy3dgjSeOY90QOphZl2mLnCl4AM';
  process.env.JWT_SECRET = '+PRSBnUVTfads9HxNyCEBBLAqIkF//6PmGhN9lbi96BGwMFStiKYslVJcc6ILaDbKgkB/bkA+PWcAxpEljNRlQ==';
  console.log('Environment variables set manually');
}

const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const { supabase, testConnection } = require('./config/supabase');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// Add request logger in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// Routes - Define routes before starting server
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/translations', require('./routes/translations'));
app.use('/api/translators', require('./routes/translators'));
app.use('/api/verification', require('./routes/verification'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/translation-requests', require('./routes/translation-requests'));
app.use('/api/admin', require('./routes/admin'));

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../client/build')));

// Test Supabase connection and start server
testConnection().then(connected => {
  if (connected) {
    console.log('Supabase connection successful');
  } else {
    console.warn('Supabase connection test failed, but starting server anyway');
    console.warn('Some features may not work correctly');
  }

  // Start the server regardless of connection status
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 LingoLink API Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🌐 Main site: http://localhost:3001`);
    console.log(`🔐 Admin access: Click logo 5 times on main site`);
  });
});

// Health check endpoint
app.get('/health', async (req, res) => {
  let dbStatus = 'unknown';

  try {
    // Test Supabase connection
    const { data, error } = await supabase.from('health_check').select('*').limit(1);
    dbStatus = error ? 'error' : 'connected';
  } catch (error) {
    dbStatus = 'disconnected';
    console.error('Health check Supabase error:', error.message);
  }

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: {
      type: 'supabase',
      status: dbStatus,
      url: process.env.SUPABASE_URL
    },
    uptime: process.uptime() + ' seconds',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check endpoint for API connectivity
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is reachable', timestamp: new Date().toISOString() });
});

// Catch all handler: send back React's index.html file for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});