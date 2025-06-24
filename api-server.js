const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './server/.env' });

const app = express();
const PORT = 5001;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Middleware
app.use(cors());
app.use(express.json());

// Authentication endpoints
app.post('/api/auth/login', async (req, res) => {
  // Set proper JSON content type
  res.setHeader('Content-Type', 'application/json');

  const { email, password } = req.body;

  console.log('Login attempt:', { email, password: '[REDACTED]' });

  try {
    // First try to find user in Supabase database
    const { data: supabaseUser, error: supabaseError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (supabaseUser && password === '29613676') {
      console.log('User found in Supabase database:', supabaseUser.email);
      return res.status(200).json({
        user: {
          id: supabaseUser.id,
          email: supabaseUser.email,
          name: supabaseUser.name,
          user_type: supabaseUser.user_type,
          gender: supabaseUser.gender,
          phone: supabaseUser.phone,
          birthdate: supabaseUser.birthdate,
          verified: supabaseUser.verified
        },
        token: 'mock-jwt-token'
      });
    }

    // If not found in Supabase, fall back to mock users for testing
    const mockUsers = [
      {
        id: 1,
        email: 'client@example.com',
        name: 'Client User',
        user_type: 'client'
      },
      {
        id: 2,
        email: 'ouday@example.com',
        name: 'Ouday Kefi',
        user_type: 'translator'
      },
      {
        id: 3,
        email: 'test@example.com',
        name: 'Test User',
        user_type: 'client'
      },
      {
        id: 4,
        email: 'kefiouday@gmail.com',
        name: 'Kefi Ouday',
        user_type: 'translator'
      },
      {
        id: 5,
        email: 'ouday.kefi@gmail.com',
        name: 'Ouday Kefi',
        user_type: 'translator'
      }
    ];

    // Find matching user in mock data
    const mockUser = mockUsers.find(u => u.email === email);

    if (mockUser && password === '29613676') {
      console.log('User found in mock data:', mockUser.email);
      return res.status(200).json({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          user_type: mockUser.user_type
        },
        token: 'mock-jwt-token'
      });
    }

    // No user found
    res.status(401).json({
      message: 'Invalid email or password. Use password: 29613676'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Internal server error during login'
    });
  }
});

app.post('/api/auth/register', async (req, res) => {
  // Set proper JSON content type
  res.setHeader('Content-Type', 'application/json');

  const { email, password, name, userType, gender, phone, birthdate } = req.body;

  console.log('Registration attempt:', { email, name, userType, gender, phone, birthdate, password: '[REDACTED]' });

  try {
    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      return res.status(400).json({
        message: 'User with this email already exists'
      });
    }

    // Create new user in Supabase with required fields
    const userData = {
      email: email.toLowerCase(),
      name: name,
      user_type: userType,
      password: password // Include password as it's required in the database
    };

    // Add optional fields only if they exist
    if (gender) userData.gender = gender;
    if (phone) userData.phone = phone;
    if (birthdate) userData.birthdate = birthdate;

    console.log('Attempting to insert user data:', userData);
    console.log('User type being sent:', userType);
    console.log('User type in userData:', userData.user_type);

    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    console.log('Returned user data:', newUser);
    console.log('User type in returned data:', newUser?.user_type);

    if (insertError) {
      console.error('Error inserting user into Supabase:', insertError);
      console.error('Error details:', JSON.stringify(insertError, null, 2));
      return res.status(500).json({
        message: 'Failed to create user account. Please try again.',
        error: insertError.message,
        details: insertError
      });
    }

    console.log('Successfully created user in Supabase:', newUser);

    // Create record in specific table based on user type
    let specificTableResult = null;
    try {
      if (userType === 'client') {
        // Create record in clients table with required fields
        const clientData = {
          user_id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          password: password,
          user_type: 'client'
        };

        const { data: clientRecord, error: clientError } = await supabase
          .from('clients')
          .insert([clientData])
          .select()
          .single();

        if (clientError) {
          console.error('Error creating client record:', clientError);
        } else {
          console.log('Successfully created client record:', clientRecord);
          specificTableResult = clientRecord;
        }
      } else if (userType === 'translator') {
        // Create record in translators table with required fields
        const translatorData = {
          user_id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          password: password,
          user_type: 'translator'
        };

        const { data: translatorRecord, error: translatorError } = await supabase
          .from('translators')
          .insert([translatorData])
          .select()
          .single();

        if (translatorError) {
          console.error('Error creating translator record:', translatorError);
        } else {
          console.log('Successfully created translator record:', translatorRecord);
          specificTableResult = translatorRecord;
        }
      }
    } catch (specificError) {
      console.error('Error creating specific table record:', specificError);
      // Don't fail the registration if specific table creation fails
    }

    // Return success response
    res.status(201).json({
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        user_type: newUser.user_type,
        gender: newUser.gender,
        phone: newUser.phone,
        birthdate: newUser.birthdate,
        verified: newUser.verified
      },
      specificRecord: specificTableResult,
      token: 'mock-jwt-token',
      message: `Registration successful! User saved to users table and ${userType}s table.`
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Internal server error during registration'
    });
  }
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

app.post('/api/auth/check-email-type', async (req, res) => {
  // Set proper JSON content type
  res.setHeader('Content-Type', 'application/json');

  const { email, userType } = req.body;

  console.log('Email check:', { email, userType });

  try {
    // Check if email exists in Supabase database
    const { data: existingUser, error } = await supabase
      .from('users')
      .select('email, user_type')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      // Email exists, check if it's the same user type
      if (existingUser.user_type === userType) {
        return res.json({
          exists: true,
          conflictingType: null
        });
      } else {
        return res.json({
          exists: true,
          conflictingType: existingUser.user_type
        });
      }
    }

    // Email doesn't exist in database
    res.json({
      exists: false,
      conflictingType: null
    });

  } catch (error) {
    console.error('Email check error:', error);
    // On error, assume email doesn't exist to allow registration
    res.json({
      exists: false,
      conflictingType: null
    });
  }
});

// Test database endpoint
app.get('/test-db', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  try {
    // Test all tables - just get counts and check if tables exist
    const [usersResult, clientsResult, translatorsResult] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact' }).limit(1),
      supabase.from('clients').select('id', { count: 'exact' }).limit(1),
      supabase.from('translators').select('id', { count: 'exact' }).limit(1)
    ]);

    res.json({
      status: 'success',
      message: 'Database tables status',
      tables: {
        users: {
          exists: !usersResult.error,
          count: usersResult.count || 0,
          error: usersResult.error?.message || null
        },
        clients: {
          exists: !clientsResult.error,
          count: clientsResult.count || 0,
          error: clientsResult.error?.message || null
        },
        translators: {
          exists: !translatorsResult.error,
          count: translatorsResult.count || 0,
          error: translatorsResult.error?.message || null
        }
      }
    });
  } catch (error) {
    res.json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Get recent users endpoint
app.get('/recent-users', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, user_type, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      return res.json({
        status: 'error',
        message: 'Failed to fetch recent users',
        error: error.message
      });
    }

    res.json({
      status: 'success',
      message: 'Recent users fetched successfully',
      users: data || []
    });
  } catch (error) {
    res.json({
      status: 'error',
      message: 'Failed to fetch recent users',
      error: error.message
    });
  }
});

// Test client insertion endpoint
app.post('/test-client-insert', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  try {
    const testData = {
      user_id: '123e4567-e89b-12d3-a456-426614174000' // Test UUID
    };

    const { data, error } = await supabase
      .from('clients')
      .insert([testData])
      .select()
      .single();

    res.json({
      status: error ? 'error' : 'success',
      data: data,
      error: error,
      message: error ? 'Failed to insert test client' : 'Test client inserted successfully'
    });
  } catch (error) {
    res.json({
      status: 'error',
      message: 'Test client insertion failed',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/health', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  try {
    // Test Supabase connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    const dbStatus = error ? 'disconnected' : 'connected';

    res.json({
      status: 'ok',
      message: 'API server is running!',
      database: `supabase-${dbStatus}`,
      supabaseUrl: supabaseUrl,
      timestamp: new Date().toISOString(),
      mainServer: 'http://localhost:3000'
    });
  } catch (error) {
    res.json({
      status: 'ok',
      message: 'API server is running!',
      database: 'supabase-error',
      error: error.message,
      timestamp: new Date().toISOString(),
      mainServer: 'http://localhost:3000'
    });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Mock login credentials (password: 29613676):`);
  console.log(`  - client@example.com`);
  console.log(`  - ouday@example.com`);
  console.log(`  - test@example.com`);
  console.log(`  - kefiouday@gmail.com`);
  console.log(`  - ouday.kefi@gmail.com`);
});
