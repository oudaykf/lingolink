const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { supabase, supabaseAdmin } = require('../config/supabase');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await req.user;
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// Update user's phone number
router.post('/update-phone', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // Validate phone number format
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Please provide a valid phone number' });
    }

    // Update user's phone number
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        phone,
        phone_verified: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating phone number:', updateError);
      return res.status(500).json({ message: 'Error updating phone number' });
    }

    res.json({ message: 'Phone number updated successfully' });
  } catch (error) {
    console.error('Error in update-phone endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user settings
router.post('/settings', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { theme, language, notifications_enabled, other_settings } = req.body;
    // Upsert user settings
    const { data, error } = await supabaseAdmin
      .from('user_settings')
      .upsert([
        {
          user_id: userId,
          theme,
          language,
          notifications_enabled,
          other_settings,
          updated_at: new Date().toISOString()
        }
      ], { onConflict: ['user_id'] })
      .select()
      .single();
    if (error) {
      console.error('Error updating user settings:', error);
      return res.status(500).json({ message: 'Error updating user settings' });
    }
    res.json({ message: 'Settings updated', settings: data });
  } catch (error) {
    console.error('Error in settings endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;