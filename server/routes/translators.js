const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAllTranslators, getTranslatorById } = require('../services/translatorService');

// Get all translators (only accessible to clients)
router.get('/', auth, async (req, res) => {
  try {
    console.log('GET /api/translators - Fetching all translators');
    console.log('User type:', req.user.userType);

    // Check if the user is a client
    if (req.user.userType !== 'client') {
      console.log('Access denied: User is not a client');
      return res.status(403).json({ message: 'Access denied. Only clients can view translators.' });
    }

    console.log('User is a client, proceeding to fetch translators');

    try {
      const translators = await getAllTranslators();
      console.log(`Found ${translators.length} translators`);

      // Log the first translator for debugging
      if (translators.length > 0) {
        console.log('First translator:', {
          id: translators[0].id,
          name: translators[0].name,
          email: translators[0].email,
          userType: translators[0].userType,
          languages: translators[0].languages
        });
      }

      // Return empty array instead of 404 if no translators found
      res.json(translators);
    } catch (serviceError) {
      console.error('Error in translator service:', serviceError);
      res.status(500).json({
        message: 'Error fetching translators from database',
        error: serviceError.message
      });
    }
  } catch (error) {
    console.error('Error in translator route:', error);
    res.status(500).json({
      message: 'Error processing translator request',
      error: error.message
    });
  }
});

// Get a specific translator (accessible to clients)
router.get('/:id', auth, async (req, res) => {
  try {
    // Check if the user is a client
    if (req.user.userType !== 'client') {
      return res.status(403).json({ message: 'Access denied. Only clients can view translator details.' });
    }

    const translator = await getTranslatorById(req.params.id);
    res.json(translator);
  } catch (error) {
    console.error('Error fetching translator:', error);
    const statusCode = error.message === 'Translator not found' ? 404 : 500;
    res.status(statusCode).json({ message: error.message });
  }
});

module.exports = router;
