const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const auth = require('../middleware/auth');

// Middleware to check admin access
const adminAuth = (req, res, next) => {
  // For demo purposes, allow any authenticated user to access admin functions
  // In production, you would check for actual admin privileges
  if (!req.user) {
    return res.status(403).json({ message: 'Authentication required' });
  }
  next();
};

// Get platform statistics
router.get('/stats', auth, adminAuth, async (req, res) => {
  try {
    // Get total users count
    const { count: totalUsers, error: usersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Get translators count
    const { count: totalTranslators, error: translatorsError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('user_type', 'translator');

    // Get clients count
    const { count: totalClients, error: clientsError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('user_type', 'client');

    // Get total translation requests
    const { count: totalRequests, error: requestsError } = await supabase
      .from('translation_requests')
      .select('*', { count: 'exact', head: true });

    // Get completed requests
    const { count: completedRequests, error: completedError } = await supabase
      .from('translation_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    // Calculate total revenue (sum of completed request budgets)
    const { data: revenueData, error: revenueError } = await supabase
      .from('translation_requests')
      .select('budget')
      .eq('status', 'completed');

    const totalRevenue = revenueData?.reduce((sum, req) => sum + (req.budget || 0), 0) || 0;

    if (usersError || translatorsError || clientsError || requestsError || completedError || revenueError) {
      console.error('Error fetching stats:', { usersError, translatorsError, clientsError, requestsError, completedError, revenueError });
      return res.status(500).json({ message: 'Failed to fetch statistics' });
    }

    res.json({
      totalUsers: totalUsers || 0,
      totalTranslators: totalTranslators || 0,
      totalClients: totalClients || 0,
      totalRequests: totalRequests || 0,
      completedRequests: completedRequests || 0,
      totalRevenue: totalRevenue.toFixed(2)
    });
  } catch (error) {
    console.error('Error in /admin/stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all users for admin management
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 50, userType, status } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('users')
      .select('id, name, email, user_type, status, created_at, updated_at')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (userType && userType !== 'all') {
      query = query.eq('user_type', userType);
    }

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: users, error } = await query;

    if (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ message: 'Failed to fetch users' });
    }

    res.json(users);
  } catch (error) {
    console.error('Error in /admin/users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all translation requests for admin
router.get('/requests', auth, adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 50, status } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('translation_requests')
      .select(`
        *,
        client:users!translation_requests_client_id_fkey(id, name, email),
        translator:users!translation_requests_translator_id_fkey(id, name, email)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: requests, error } = await query;

    if (error) {
      console.error('Error fetching requests:', error);
      return res.status(500).json({ message: 'Failed to fetch requests' });
    }

    // Format the response
    const formattedRequests = requests.map(req => ({
      id: req.id,
      title: req.title,
      sourceLanguage: req.source_language,
      targetLanguage: req.target_language,
      wordCount: req.word_count,
      budget: req.budget,
      status: req.status,
      createdAt: req.created_at,
      deadline: req.deadline,
      clientName: req.client?.name || 'Unknown',
      translatorName: req.translator?.name || null
    }));

    res.json(formattedRequests);
  } catch (error) {
    console.error('Error in /admin/requests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Suspend a user
router.post('/users/:userId/suspend', auth, adminAuth, async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user.id) {
      return res.status(400).json({ message: 'Cannot suspend yourself' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .update({ 
        status: 'suspended',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select('id, name, email, status')
      .single();

    if (error) {
      console.error('Error suspending user:', error);
      return res.status(500).json({ message: 'Failed to suspend user' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User suspended successfully', user });
  } catch (error) {
    console.error('Error in /admin/users/:userId/suspend:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Activate a user
router.post('/users/:userId/activate', auth, adminAuth, async (req, res) => {
  try {
    const { userId } = req.params;

    const { data: user, error } = await supabase
      .from('users')
      .update({ 
        status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select('id, name, email, status')
      .single();

    if (error) {
      console.error('Error activating user:', error);
      return res.status(500).json({ message: 'Failed to activate user' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User activated successfully', user });
  } catch (error) {
    console.error('Error in /admin/users/:userId/activate:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user details
router.post('/users/:userId/view', auth, adminAuth, async (req, res) => {
  try {
    const { userId } = req.params;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user details:', error);
      return res.status(500).json({ message: 'Failed to fetch user details' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove sensitive information
    const { password, ...userDetails } = user;

    res.json(userDetails);
  } catch (error) {
    console.error('Error in /admin/users/:userId/view:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get platform settings
router.get('/settings', auth, adminAuth, async (req, res) => {
  try {
    const { data: settings, error } = await supabase
      .from('platform_settings')
      .select('*')
      .order('key');

    if (error) {
      console.error('Error fetching settings:', error);
      return res.status(500).json({ message: 'Failed to fetch settings' });
    }

    // Convert array to object for easier use
    const settingsObj = {};
    settings?.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });

    res.json(settingsObj);
  } catch (error) {
    console.error('Error in /admin/settings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update platform settings
router.post('/settings', auth, adminAuth, async (req, res) => {
  try {
    const settings = req.body;

    // Update each setting
    const updates = Object.entries(settings).map(async ([key, value]) => {
      const { error } = await supabase
        .from('platform_settings')
        .upsert({ 
          key, 
          value: value.toString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error(`Error updating setting ${key}:`, error);
        throw error;
      }
    });

    await Promise.all(updates);

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error in /admin/settings POST:', error);
    res.status(500).json({ message: 'Failed to update settings' });
  }
});

// Get recent activity
router.get('/activity', auth, adminAuth, async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    // Get recent user registrations
    const { data: recentUsers, error: usersError } = await supabase
      .from('users')
      .select('id, name, email, user_type, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    // Get recent translation requests
    const { data: recentRequests, error: requestsError } = await supabase
      .from('translation_requests')
      .select(`
        id, title, status, created_at,
        client:users!translation_requests_client_id_fkey(name)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (usersError || requestsError) {
      console.error('Error fetching activity:', { usersError, requestsError });
      return res.status(500).json({ message: 'Failed to fetch activity' });
    }

    res.json({
      recentUsers: recentUsers || [],
      recentRequests: recentRequests || []
    });
  } catch (error) {
    console.error('Error in /admin/activity:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all users for admin (without auth restrictions)
router.get('/all-users', async (req, res) => {
  try {
    const { page = 1, limit = 100 } = req.query;
    const offset = (page - 1) * limit;

    // Fetch all users directly from Supabase without RLS restrictions
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email, user_type, created_at, updated_at')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching all users:', error);
      return res.status(500).json({ message: 'Failed to fetch users' });
    }

    res.json(users || []);
  } catch (error) {
    console.error('Error in /admin/all-users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user
router.put('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, user_type } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .update({
        name,
        email,
        user_type,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select('id, name, email, user_type')
      .single();

    if (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ message: 'Failed to update user' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error in PUT /admin/users/:userId:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete user
router.delete('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ message: 'Failed to delete user' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /admin/users/:userId:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
