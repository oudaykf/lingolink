const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const auth = require('../middleware/auth');

// Get translation requests for clients (my requests)
router.get('/my-requests', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    let query = supabaseAdmin
      .from('translation_requests')
      .select(`
        *,
        client:users!translation_requests_client_id_fkey(id, name, email),
        translator:users!translation_requests_translator_id_fkey(id, name, email)
      `)
      .eq('client_id', userId)
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: requests, error } = await query;

    if (error) {
      console.error('Error fetching client requests:', error);
      return res.status(500).json({ message: 'Failed to fetch requests' });
    }

    res.json(requests);
  } catch (error) {
    console.error('Error in /my-requests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get available translation requests for translators
router.get('/available', auth, async (req, res) => {
  try {
    const { status } = req.query;

    let query = supabaseAdmin
      .from('translation_requests')
      .select(`
        *,
        client:users!translation_requests_client_id_fkey(id, name, email)
      `)
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    } else {
      // By default, show only pending requests for translators
      query = query.eq('status', 'pending');
    }

    const { data: requests, error } = await query;

    if (error) {
      console.error('Error fetching available requests:', error);
      return res.status(500).json({ message: 'Failed to fetch requests' });
    }

    res.json(requests);
  } catch (error) {
    console.error('Error in /available:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new translation request
router.post('/', auth, async (req, res) => {
  try {
    const clientId = req.user.id;
    const {
      title,
      description,
      sourceLanguage,
      targetLanguage,
      wordCount,
      deadline,
      budget,
      specialRequirements,
      urgency
    } = req.body;

    // Validate required fields
    if (!sourceLanguage || !targetLanguage || !wordCount || !deadline || !budget) {
      return res.status(400).json({ 
        message: 'Source language, target language, word count, deadline, and budget are required' 
      });
    }

    const { data: request, error } = await supabaseAdmin
      .from('translation_requests')
      .insert([
        {
          client_id: clientId,
          title: title || `${sourceLanguage} to ${targetLanguage} Translation`,
          description,
          source_language: sourceLanguage,
          target_language: targetLanguage,
          word_count: parseInt(wordCount),
          deadline: new Date(deadline).toISOString(),
          budget: parseFloat(budget),
          special_requirements: specialRequirements,
          urgency: urgency || 'normal',
          status: 'pending'
        }
      ])
      .select(`
        *,
        client:users!translation_requests_client_id_fkey(id, name, email)
      `)
      .single();

    if (error) {
      console.error('Error creating translation request:', error);
      return res.status(500).json({ message: 'Failed to create translation request' });
    }

    res.status(201).json(request);
  } catch (error) {
    console.error('Error in POST /translation-requests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a specific translation request
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { data: request, error } = await supabaseAdmin
      .from('translation_requests')
      .select(`
        *,
        client:users!translation_requests_client_id_fkey(id, name, email),
        translator:users!translation_requests_translator_id_fkey(id, name, email)
      `)
      .eq('id', id)
      .single();

    if (error || !request) {
      return res.status(404).json({ message: 'Translation request not found' });
    }

    // Check if user has permission to view this request
    if (request.client_id !== userId && request.translator_id !== userId && req.user.user_type !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(request);
  } catch (error) {
    console.error('Error in GET /translation-requests/:id:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Apply for a translation job (translator)
router.post('/:id/apply', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const translatorId = req.user.id;

    if (req.user.user_type !== 'translator') {
      return res.status(403).json({ message: 'Only translators can apply for jobs' });
    }

    // Check if request exists and is pending
    const { data: request, error: fetchError } = await supabaseAdmin
      .from('translation_requests')
      .select('*')
      .eq('id', id)
      .eq('status', 'pending')
      .single();

    if (fetchError || !request) {
      return res.status(404).json({ message: 'Translation request not found or not available' });
    }

    // Check if translator already applied
    const { data: existingApplication, error: appError } = await supabaseAdmin
      .from('translation_applications')
      .select('*')
      .eq('request_id', id)
      .eq('translator_id', translatorId)
      .single();

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Create application
    const { data: application, error } = await supabaseAdmin
      .from('translation_applications')
      .insert([
        {
          request_id: id,
          translator_id: translatorId,
          status: 'pending',
          applied_at: new Date().toISOString()
        }
      ])
      .select('*')
      .single();

    if (error) {
      console.error('Error creating application:', error);
      return res.status(500).json({ message: 'Failed to apply for job' });
    }

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    console.error('Error in POST /translation-requests/:id/apply:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Cancel a translation request (client)
router.post('/:id/cancel', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if request exists and belongs to the user
    const { data: request, error: fetchError } = await supabaseAdmin
      .from('translation_requests')
      .select('*')
      .eq('id', id)
      .eq('client_id', userId)
      .single();

    if (fetchError || !request) {
      return res.status(404).json({ message: 'Translation request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending requests can be cancelled' });
    }

    // Update request status
    const { data: updatedRequest, error } = await supabaseAdmin
      .from('translation_requests')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error cancelling request:', error);
      return res.status(500).json({ message: 'Failed to cancel request' });
    }

    res.json({ message: 'Request cancelled successfully', request: updatedRequest });
  } catch (error) {
    console.error('Error in POST /translation-requests/:id/cancel:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Assign translator to request (client)
router.post('/:id/assign', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { translatorId } = req.body;
    const userId = req.user.id;

    if (!translatorId) {
      return res.status(400).json({ message: 'Translator ID is required' });
    }

    // Check if request exists and belongs to the user
    const { data: request, error: fetchError } = await supabaseAdmin
      .from('translation_requests')
      .select('*')
      .eq('id', id)
      .eq('client_id', userId)
      .single();

    if (fetchError || !request) {
      return res.status(404).json({ message: 'Translation request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending requests can be assigned' });
    }

    // Verify translator exists and applied
    const { data: application, error: appError } = await supabaseAdmin
      .from('translation_applications')
      .select('*')
      .eq('request_id', id)
      .eq('translator_id', translatorId)
      .single();

    if (appError || !application) {
      return res.status(404).json({ message: 'Translator application not found' });
    }

    // Update request with assigned translator
    const { data: updatedRequest, error } = await supabaseAdmin
      .from('translation_requests')
      .update({
        translator_id: translatorId,
        status: 'assigned',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        client:users!translation_requests_client_id_fkey(id, name, email),
        translator:users!translation_requests_translator_id_fkey(id, name, email)
      `)
      .single();

    if (error) {
      console.error('Error assigning translator:', error);
      return res.status(500).json({ message: 'Failed to assign translator' });
    }

    // Update application status
    await supabaseAdmin
      .from('translation_applications')
      .update({ status: 'accepted' })
      .eq('id', application.id);

    // Reject other applications
    await supabaseAdmin
      .from('translation_applications')
      .update({ status: 'rejected' })
      .eq('request_id', id)
      .neq('translator_id', translatorId);

    res.json({ message: 'Translator assigned successfully', request: updatedRequest });
  } catch (error) {
    console.error('Error in POST /translation-requests/:id/assign:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
