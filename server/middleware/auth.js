const jwt = require('jsonwebtoken');
const { supabaseAdmin } = require('../config/supabase');

const auth = async (req, res, next) => {
  try {
    console.log(`Auth middleware called for ${req.method} ${req.originalUrl}`);
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    console.log('Token received, attempting to verify...');
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);
    } catch (tokenError) {
      console.error('Token verification failed:', tokenError.message);
      return res.status(401).json({ message: `Invalid token: ${tokenError.message}` });
    }

    // Get user from Supabase - handle both userId and id formats
    const userId = decoded.userId || decoded.id;
    if (!userId) {
      console.error('No user ID found in token:', decoded);
      return res.status(401).json({ message: 'Invalid token format' });
    }

    console.log(`Looking for user with ID: ${userId}`);

    // First check if user exists at all
    const { data: allUsers, error: allError } = await supabaseAdmin
      .from('users')
      .select('id, name, email, user_type, created_at')
      .eq('id', userId);

    console.log(`Found ${allUsers?.length || 0} users with ID ${userId}`);
    if (allUsers && allUsers.length > 0) {
      console.log('Users found:', allUsers.map(u => `${u.name} (${u.email})`));
    }

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, name, email, user_type, created_at')
      .eq('id', userId)
      .single();

    // Special handling for verification routes - allow demo mode
    if ((error || !user) && req.originalUrl.includes('/api/verification')) {
      console.log('User not found but allowing access to verification routes in demo mode');

      // Create a mock user for demo purposes
      req.user = {
        id: userId,
        name: 'Demo User',
        email: 'demo@example.com',
        userType: decoded.userType || 'client',
        createdAt: new Date().toISOString(),
        isDemo: true // Flag to indicate this is a demo user
      };
      req.token = token;
      return next();
    }

    if (error) {
      console.error('Supabase error when fetching user:', error);
      return res.status(401).json({ message: 'Error fetching user data', error: error.message });
    }

    if (!user) {
      console.error('User not found for ID:', userId);
      return res.status(401).json({ message: 'User not found' });
    }

    console.log(`User found: ${user.name} (${user.user_type})`);

    // Transform to camelCase for consistency
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      userType: user.user_type,
      createdAt: user.created_at
    };
    req.token = token;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }
    res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = auth;