const { supabase } = require('../config/supabase');

// Get all translations for a user
const getUserTranslations = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('translations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(error.message);
    }
    
    // Transform data to match the expected format
    return data.map(item => ({
      id: item.id,
      userId: item.user_id,
      sourceLanguage: item.source_language,
      targetLanguage: item.target_language,
      originalText: item.original_text,
      translatedText: item.translated_text || '',
      status: item.status,
      wordCount: item.word_count,
      createdAt: item.created_at,
      completedAt: item.completed_at
    }));
  } catch (error) {
    throw error;
  }
};

// Get a specific translation
const getTranslationById = async (translationId, userId) => {
  try {
    const { data, error } = await supabase
      .from('translations')
      .select('*')
      .eq('id', translationId)
      .eq('user_id', userId)
      .single();
    
    if (error) {
      throw new Error('Translation not found');
    }
    
    return {
      id: data.id,
      userId: data.user_id,
      sourceLanguage: data.source_language,
      targetLanguage: data.target_language,
      originalText: data.original_text,
      translatedText: data.translated_text || '',
      status: data.status,
      wordCount: data.word_count,
      createdAt: data.created_at,
      completedAt: data.completed_at
    };
  } catch (error) {
    throw error;
  }
};

// Create a new translation
const createTranslation = async (translationData, userId) => {
  try {
    const { sourceLanguage, targetLanguage, originalText } = translationData;
    
    // Simple word count calculation
    const wordCount = originalText.split(/\\s+/).filter(Boolean).length;
    
    const { data, error } = await supabase
      .from('translations')
      .insert([
        {
          user_id: userId,
          source_language: sourceLanguage,
          target_language: targetLanguage,
          original_text: originalText,
          translated_text: '',
          status: 'pending',
          word_count: wordCount,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return {
      id: data.id,
      userId: data.user_id,
      sourceLanguage: data.source_language,
      targetLanguage: data.target_language,
      originalText: data.original_text,
      translatedText: data.translated_text || '',
      status: data.status,
      wordCount: data.word_count,
      createdAt: data.created_at
    };
  } catch (error) {
    throw error;
  }
};

// Update a translation
const updateTranslation = async (translationId, updateData, userId) => {
  try {
    // First check if translation exists and belongs to user
    const { data: existingTranslation, error: checkError } = await supabase
      .from('translations')
      .select('*')
      .eq('id', translationId)
      .eq('user_id', userId)
      .single();
    
    if (checkError) {
      throw new Error('Translation not found');
    }
    
    // Prepare update data
    const updateFields = {};
    
    if (updateData.translatedText !== undefined) {
      updateFields.translated_text = updateData.translatedText;
    }
    
    if (updateData.status !== undefined) {
      updateFields.status = updateData.status;
      
      if (updateData.status === 'completed' && !existingTranslation.completed_at) {
        updateFields.completed_at = new Date().toISOString();
      }
    }
    
    // Update the translation
    const { data, error } = await supabase
      .from('translations')
      .update(updateFields)
      .eq('id', translationId)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return {
      id: data.id,
      userId: data.user_id,
      sourceLanguage: data.source_language,
      targetLanguage: data.target_language,
      originalText: data.original_text,
      translatedText: data.translated_text || '',
      status: data.status,
      wordCount: data.word_count,
      createdAt: data.created_at,
      completedAt: data.completed_at
    };
  } catch (error) {
    throw error;
  }
};

// Delete a translation
const deleteTranslation = async (translationId, userId) => {
  try {
    const { error } = await supabase
      .from('translations')
      .delete()
      .eq('id', translationId)
      .eq('user_id', userId);
    
    if (error) {
      throw new Error(error.message);
    }
    
    return { success: true };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getUserTranslations,
  getTranslationById,
  createTranslation,
  updateTranslation,
  deleteTranslation
};
