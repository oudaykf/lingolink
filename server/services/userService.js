const { supabase, supabaseAdmin } = require('../config/supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
const registerUser = async (userData) => {
  try {
    const {
      name,
      email,
      password,
      userType,
      gender,
      phone,
      birthdate,
      agreeToVerification,
      // Additional fields for client and translator profiles
      fullName,
      address,
      country,
      companyName,
      languages,
      specializations,
      certification,
      yearsOfExperience,
      hourlyRate
    } = userData;

    console.log(`Registration attempt for: ${name}, ${email}, ${userType}, ${gender}`);

    // Validate required fields
    if (!name || !email || !password || !userType) {
      throw new Error('All fields are required: name, email, password, and userType');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please provide a valid email address');
    }

    // Validate password strength (at least 6 characters)
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Validate userType
    if (userType !== 'client' && userType !== 'translator') {
      throw new Error('User type must be either "client" or "translator"');
    }

    // Validate gender if provided
    if (gender && gender !== 'male' && gender !== 'female' && gender !== 'other') {
      throw new Error('Gender must be either "male", "female", or "other"');
    }

    // Validate phone number if provided
    if (phone) {
      const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
      if (!phoneRegex.test(phone)) {
        throw new Error('Please provide a valid phone number');
      }
    }

    // Validate birthdate if provided
    if (birthdate) {
      const birthDate = new Date(birthdate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      if (isNaN(birthDate.getTime())) {
        throw new Error('Please provide a valid birth date');
      }

      if (age < 18) {
        throw new Error('You must be at least 18 years old to register');
      }

      if (age > 100) {
        throw new Error('Please provide a valid birth date');
      }
    }

    // Require verification agreement
    if (agreeToVerification === false) {
      throw new Error('You must agree to the verification process to continue');
    }

    // Check if the users table exists by trying to query it
    const { error: tableCheckError } = await supabase.from('users').select('count').limit(1);
    if (tableCheckError) {
      console.error('Error checking users table:', tableCheckError);
      throw new Error('Database setup error - users table may not exist');
    }

    // Check if clients and translators tables exist
    const { error: clientsTableError } = await supabase.from('clients').select('count').limit(1);
    if (clientsTableError && clientsTableError.code === '42P01') { // Table doesn't exist
      console.error('Clients table does not exist, creating it...');
      await createClientsTable();
    }

    const { error: translatorsTableError } = await supabase.from('translators').select('count').limit(1);
    if (translatorsTableError && translatorsTableError.code === '42P01') { // Table doesn't exist
      console.error('Translators table does not exist, creating it...');
      await createTranslatorsTable();
    }

    // Check if user already exists with the same email - try multiple approaches
    console.log(`Checking if email ${email} already exists...`);

    // 1. Try exact match first
    let emailExists = false;
    let existingUserType = null;

    const { data: existingUser, error: queryError } = await supabaseAdmin
      .from('users')
      .select('email, user_type')
      .eq('email', email);

    if (queryError) {
      console.error('Error checking existing user:', queryError);
      throw new Error('Error during registration process');
    }

    if (existingUser && existingUser.length > 0) {
      emailExists = true;
      existingUserType = existingUser[0].user_type;
      console.log(`Found existing user with exact match: ${existingUser[0].email} (${existingUserType})`);
    }

    // 2. If not found, try case-insensitive match
    if (!emailExists) {
      const { data: ilikeUsers, error: ilikeError } = await supabaseAdmin
        .from('users')
        .select('email, user_type')
        .ilike('email', email);

      if (ilikeError) {
        console.error('Error in case-insensitive email check:', ilikeError);
      } else if (ilikeUsers && ilikeUsers.length > 0) {
        emailExists = true;
        existingUserType = ilikeUsers[0].user_type;
        console.log(`Found existing user with case-insensitive match: ${ilikeUsers[0].email} (${existingUserType})`);
      }
    }

    // 3. If still not found, try lowercase
    if (!emailExists) {
      const { data: lowerUsers, error: lowerError } = await supabaseAdmin
        .from('users')
        .select('email, user_type')
        .eq('email', email.toLowerCase());

      if (lowerError) {
        console.error('Error in lowercase email check:', lowerError);
      } else if (lowerUsers && lowerUsers.length > 0) {
        emailExists = true;
        existingUserType = lowerUsers[0].user_type;
        console.log(`Found existing user with lowercase match: ${lowerUsers[0].email} (${existingUserType})`);
      }
    }

    // Handle existing user case
    if (emailExists) {
      if (existingUserType === userType) {
        console.log(`Registration failed: Email already exists as ${userType}`);
        throw new Error(`An account with this email already exists as a ${userType}`);
      } else {
        console.log(`Registration failed: Email exists as different user type (${existingUserType})`);
        throw new Error(`This email is already registered as a ${existingUserType}. Please use a different email for ${userType} registration`);
      }
    } else {
      console.log(`Email ${email} is available for registration.`);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Prepare user data
    const userDataObj = {
      name,
      email,
      password: hashedPassword,
      user_type: userType,
      gender: gender || 'male', // Default to male if not provided
      phone: phone || null,
      email_verified: false,
      phone_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Add birthdate if provided
    if (birthdate) {
      userDataObj.birthdate = birthdate;
    }

    // Insert new user using supabaseAdmin to bypass RLS policies
    const { data: newUser, error: insertError } = await supabaseAdmin
      .from('users')
      .insert([userDataObj])
      .select()
      .single();

    if (insertError) {
      console.error('Error creating user:', insertError);

      // Check for duplicate email error
      if (insertError.code === '23505' && insertError.message.includes('users_email_key')) {
        throw new Error('An account with this email already exists. Please use a different email address.');
      }

      throw new Error('Failed to create account. Please try again.');
    }

    // Insert default user settings
    if (newUser) {
      try {
        const { error: settingsError } = await supabaseAdmin
          .from('user_settings')
          .insert([
            {
              user_id: newUser.id,
              theme: userData.theme || 'light',
              language: userData.language || 'en',
              notifications_enabled: true,
              other_settings: userData.otherSettings || {}
            }
          ]);
        if (settingsError) {
          console.error('Error creating user settings:', settingsError);
        }
      } catch (settingsErr) {
        console.error('Exception creating user settings:', settingsErr);
      }
    }

    // If user was created successfully, create verification entry
    if (newUser) {
      try {
        // Create verification record
        const { error: verificationError } = await supabaseAdmin
          .from('user_verification')
          .insert([{
            user_id: newUser.id,
            identity_verified: false,
            face_verified: false,
            verification_status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);

        if (verificationError) {
          console.error('Error creating verification record:', verificationError);
          // Continue with registration even if verification record creation fails
        }
      } catch (verificationErr) {
        console.error('Exception creating verification record:', verificationErr);
        // Continue with registration even if verification record creation fails
      }

      // Create profile based on user type
      if (userType === 'client') {
        const clientData = {
          user_id: newUser.id,
          company_name: companyName || '',
          full_name: fullName || name,
          phone_number: phone || '',
          address: address || '',
          country: country || '',
          preferred_languages: languages || []
        };

        const { error: clientError } = await supabaseAdmin
          .from('clients')
          .insert([clientData]);

        if (clientError) {
          console.error('Error creating client profile:', clientError);
          // We'll continue even if client profile creation fails
        } else {
          console.log('Client profile created successfully');
        }
      } else if (userType === 'translator') {
        const translatorData = {
          user_id: newUser.id,
          full_name: fullName || name,
          phone_number: phone || '',
          address: address || '',
          country: country || '',
          languages: languages || [],
          specializations: specializations || [],
          certification: certification || '',
          years_of_experience: yearsOfExperience || 0,
          hourly_rate: hourlyRate || 0
        };

        const { error: translatorError } = await supabaseAdmin
          .from('translators')
          .insert([translatorData]);

        if (translatorError) {
          console.error('Error creating translator profile:', translatorError);
          // We'll continue even if translator profile creation fails
        } else {
          console.log('Translator profile created successfully');
        }
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, userType: newUser.user_type },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        userType: newUser.user_type
      }
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Login user
const loginUser = async (email, password) => {
  try {
    console.log(`Login attempt for email: ${email}`);

    // Validate inputs
    if (!email || !password) {
      console.log('Login failed: Email or password missing');
      throw new Error('Email and password are required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Login failed: Invalid email format');
      throw new Error('Please provide a valid email address');
    }

    // Find user - try multiple approaches to ensure we find the user
    console.log(`Searching for user with email: ${email}`);

    // 1. Try exact match first
    let { data: users, error: queryError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email);

    if (queryError) {
      console.error('Error finding user with exact match:', queryError);
    }

    // 2. If no user found, try case-insensitive match
    if (!users || users.length === 0) {
      console.log(`No user found with exact match. Trying case-insensitive match...`);
      const { data: ilikeUsers, error: ilikeError } = await supabaseAdmin
        .from('users')
        .select('*')
        .ilike('email', email);

      if (ilikeError) {
        console.error('Error finding user with ilike:', ilikeError);
      } else if (ilikeUsers && ilikeUsers.length > 0) {
        console.log(`Found user with case-insensitive match: ${ilikeUsers[0].email}`);
        users = ilikeUsers;
      }
    }

    // 3. If still no user found, try lowercase
    if (!users || users.length === 0) {
      console.log(`No user found with case-insensitive match. Trying lowercase...`);
      const { data: lowerUsers, error: lowerError } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase());

      if (lowerError) {
        console.error('Error finding user with lowercase:', lowerError);
      } else if (lowerUsers && lowerUsers.length > 0) {
        console.log(`Found user with lowercase match: ${lowerUsers[0].email}`);
        users = lowerUsers;
      }
    }

    // Check if user exists after all attempts
    if (!users || users.length === 0) {
      console.log(`Login failed: No user found with email ${email} after all attempts`);
      // Use a generic error message for security
      throw new Error('Invalid email or password');
    }

    const user = users[0];
    console.log(`User found: ${user.name}, ${user.email}, ${user.user_type}`);

    // Check password
    try {
      console.log(`Comparing password with hash: ${user.password}`);
      const isMatch = await bcrypt.compare(password, user.password);
      console.log(`Password match result: ${isMatch}`);

      if (!isMatch) {
        console.log('Login failed: Password does not match');
        // Use a generic error message for security
        throw new Error('Invalid email or password');
      }
    } catch (bcryptError) {
      console.error('Error comparing passwords:', bcryptError);
      throw new Error('Error during login process');
    }

    // Log successful login
    console.log(`User logged in successfully: ${user.email} (${user.user_type})`);

    // Fetch profile data based on user type
    let profileData = null;

    if (user.user_type === 'client') {
      const { data: clientData, error: clientError } = await supabaseAdmin
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (clientError) {
        console.error('Error fetching client profile:', clientError);
      } else if (clientData) {
        profileData = clientData;
        console.log('Client profile data fetched successfully');
      }
    } else if (user.user_type === 'translator') {
      const { data: translatorData, error: translatorError } = await supabaseAdmin
        .from('translators')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (translatorError) {
        console.error('Error fetching translator profile:', translatorError);
      } else if (translatorData) {
        profileData = translatorData;
        console.log('Translator profile data fetched successfully');
      }
    }

    // Fetch user settings
    let userSettings = null;
    try {
      const { data: settingsData, error: settingsError } = await supabaseAdmin
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (settingsError) {
        console.error('Error fetching user settings:', settingsError);
      } else if (settingsData) {
        userSettings = settingsData;
      }
    } catch (settingsErr) {
      console.error('Exception fetching user settings:', settingsErr);
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, userType: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.user_type,
        profile: profileData,
        settings: userSettings
      }
    };
  } catch (error) {
    console.error('Login error:', error.message);
    throw error;
  }
};

// Get user by ID
const getUserById = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const { data: users, error: queryError } = await supabase
      .from('users')
      .select('id, name, email, user_type, created_at')
      .eq('id', userId);

    if (queryError) {
      console.error('Error fetching user:', queryError);
      throw new Error('Error retrieving user information');
    }

    if (!users || users.length === 0) {
      throw new Error('User not found');
    }

    const user = users[0];
    // Fetch user settings
    let userSettings = null;
    try {
      const { data: settingsData, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (settingsError) {
        console.error('Error fetching user settings:', settingsError);
      } else if (settingsData) {
        userSettings = settingsData;
      }
    } catch (settingsErr) {
      console.error('Exception fetching user settings:', settingsErr);
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      userType: user.user_type,
      createdAt: user.created_at,
      profile: profileData,
      settings: userSettings
    };
  } catch (error) {
    throw error;
  }
};

// Check if email exists
const checkEmailExists = async (email) => {
  try {
    if (!email) {
      throw new Error('Email is required');
    }

    const { data, error } = await supabase
      .from('users')
      .select('email')
      .eq('email', email);

    if (error) {
      console.error('Error checking email:', error);
      throw new Error('Error checking email availability');
    }

    return data && data.length > 0;
  } catch (error) {
    throw error;
  }
};

// Create clients table if it doesn't exist
const createClientsTable = async () => {
  try {
    const { error } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS clients (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          company_name VARCHAR(255),
          full_name VARCHAR(255) NOT NULL,
          phone_number VARCHAR(50),
          address TEXT,
          country VARCHAR(100),
          preferred_languages TEXT[],
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `
    });

    if (error) {
      console.error('Error creating clients table:', error);
      throw error;
    }

    console.log('Clients table created successfully');
  } catch (error) {
    console.error('Failed to create clients table:', error);
    throw error;
  }
};

// Create translators table if it doesn't exist
const createTranslatorsTable = async () => {
  try {
    const { error } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS translators (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          full_name VARCHAR(255) NOT NULL,
          phone_number VARCHAR(50),
          address TEXT,
          country VARCHAR(100),
          languages TEXT[],
          specializations TEXT[],
          certification TEXT,
          years_of_experience INTEGER,
          hourly_rate DECIMAL(10,2),
          availability_status VARCHAR(20) DEFAULT 'available',
          rating DECIMAL(3,2),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `
    });

    if (error) {
      console.error('Error creating translators table:', error);
      throw error;
    }

    console.log('Translators table created successfully');
  } catch (error) {
    console.error('Failed to create translators table:', error);
    throw error;
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  checkEmailExists,
  createClientsTable,
  createTranslatorsTable
};
