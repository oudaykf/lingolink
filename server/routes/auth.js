const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const auth = require('../middleware/auth');
const { supabase } = require('../config/supabase');
const { registerUser, loginUser, getUserById, checkEmailExists } = require('../services/userService');
const emailService = require('../services/emailService');

// Register route
router.post('/register', async (req, res) => {
  try {
    console.log('Registration request received:', { ...req.body, password: '[REDACTED]' });
    const result = await registerUser(req.body);
    console.log('Registration successful for:', result.user.email);

    // Send welcome email (don't wait for it to complete)
    emailService.sendWelcomeEmail(
      result.user.email,
      result.user.name,
      result.user.userType
    ).catch(error => {
      console.error('Failed to send welcome email:', error);
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Registration error:', error);
    const statusCode = error.message === 'User already exists' ? 400 : 500;
    res.status(statusCode).json({ message: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt for:', req.body.email);
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    console.log('Login successful for:', email);
    res.json(result);
  } catch (error) {
    console.error('Login error:', error);
    const statusCode = error.message === 'Invalid credentials' ? 401 : 500;
    res.status(statusCode).json({ message: error.message });
  }
});

// Get current user route
router.get('/me', auth, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// Check if email exists
router.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const exists = await checkEmailExists(email);
    res.json({ exists });
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({ message: error.message });
  }
});

// Check if email exists with specific user type
router.post('/check-email-type', async (req, res) => {
  try {
    const { email, userType } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    if (!userType || (userType !== 'client' && userType !== 'translator')) {
      return res.status(400).json({ message: 'Valid user type is required' });
    }

    // Check if user exists with this email
    const { data, error } = await supabase
      .from('users')
      .select('user_type')
      .eq('email', email);

    if (error) {
      console.error('Error checking email type:', error);
      throw new Error('Error checking email');
    }

    if (!data || data.length === 0) {
      // Email doesn't exist at all
      return res.json({ exists: false, conflictingType: null });
    }

    // Email exists, check if it's the same type
    const existingUserType = data[0].user_type;
    const exists = existingUserType === userType;
    const conflictingType = exists ? null : existingUserType;

    res.json({ exists, conflictingType });
  } catch (error) {
    console.error('Error checking email type:', error);
    res.status(500).json({ message: error.message });
  }
});

// Admin login endpoint
router.post('/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    console.log('Admin login attempt:', email);

    // Specific administrator credentials
    const ADMIN_EMAIL = 'ouday.kefi@gmail.com';
    const ADMIN_PASSWORD = 'Ouday.12345';

    // Validate admin credentials
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      console.log('Invalid admin credentials for:', email);
      return res.status(401).json({ message: 'Invalid administrator credentials' });
    }

    // Create admin user object
    const adminUser = {
      id: 'admin-ouday-kefi',
      name: 'Ouday Kefi',
      email: ADMIN_EMAIL,
      userType: 'admin'
    };

    // Generate admin token
    const token = jwt.sign(
      {
        id: adminUser.id,
        email: adminUser.email,
        userType: 'admin'
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log('✅ Admin login successful for:', email);

    res.json({
      message: 'Admin login successful',
      user: adminUser,
      token
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !user) {
      // Don't reveal if email exists or not for security
      return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Store reset token in database
    const { error: updateError } = await supabase
      .from('users')
      .update({
        reset_token: resetToken,
        reset_token_expiry: resetTokenExpiry.toISOString()
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error storing reset token:', updateError);
      return res.status(500).json({ message: 'Failed to process password reset request' });
    }

    // Send reset email
    const resetResult = await emailService.sendPasswordResetEmail(email, user.name, resetToken);
    
    if (!resetResult.success) {
      console.error('Failed to send reset email:', resetResult.error);
      return res.status(500).json({ message: 'Failed to send reset email' });
    }

    res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Reset Password Route
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Find user with valid reset token
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('reset_token', token)
      .gt('reset_token_expiry', new Date().toISOString())
      .single();

    if (userError || !user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password and clear reset token
    const { error: updateError } = await supabase
      .from('users')
      .update({
        password: hashedPassword,
        reset_token: null,
        reset_token_expiry: null
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating password:', updateError);
      return res.status(500).json({ message: 'Failed to reset password' });
    }

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;