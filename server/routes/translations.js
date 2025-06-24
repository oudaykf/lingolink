const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getUserTranslations,
  getTranslationById,
  createTranslation,
  updateTranslation,
  deleteTranslation
} = require('../services/translationService');

// Get all translations for a user
router.get('/', auth, async (req, res) => {
  try {
    const translations = await getUserTranslations(req.user.id);
    res.json(translations);
  } catch (error) {
    console.error('Error fetching translations:', error);
    res.status(500).json({ message: 'Error fetching translations', error: error.message });
  }
});

// Get a specific translation
router.get('/:id', auth, async (req, res) => {
  try {
    const translation = await getTranslationById(req.params.id, req.user.id);
    res.json(translation);
  } catch (error) {
    console.error('Error fetching translation:', error);
    const statusCode = error.message === 'Translation not found' ? 404 : 500;
    res.status(statusCode).json({ message: error.message });
  }
});

// Create a new translation
router.post('/', auth, async (req, res) => {
  try {
    const translation = await createTranslation(req.body, req.user.id);
    res.status(201).json(translation);
  } catch (error) {
    console.error('Error creating translation:', error);
    res.status(500).json({ message: 'Error creating translation', error: error.message });
  }
});

// Update a translation
router.put('/:id', auth, async (req, res) => {
  try {
    const translation = await updateTranslation(req.params.id, req.body, req.user.id);
    res.json(translation);
  } catch (error) {
    console.error('Error updating translation:', error);
    const statusCode = error.message === 'Translation not found' ? 404 : 500;
    res.status(statusCode).json({ message: error.message });
  }
});

// Delete a translation
router.delete('/:id', auth, async (req, res) => {
  try {
    await deleteTranslation(req.params.id, req.user.id);
    res.json({ message: 'Translation deleted successfully' });
  } catch (error) {
    console.error('Error deleting translation:', error);
    const statusCode = error.message === 'Translation not found' ? 404 : 500;
    res.status(statusCode).json({ message: error.message });
  }
});

module.exports = router;