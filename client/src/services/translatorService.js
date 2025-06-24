import { API_URL } from '../config';
import { supabase } from '../supabase';

// Get all translators
export const getAllTranslators = async () => {
  try {
    console.log('Fetching translators from Supabase...');

    // Fetch translators directly from Supabase
    const { data: supabaseTranslators, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_type', 'translator');

    if (error) {
      console.error('Error fetching translators from Supabase:', error);
      return [];
    }

    if (!supabaseTranslators || supabaseTranslators.length === 0) {
      console.log('No translators found in Supabase');
      return [];
    }

    console.log(`Found ${supabaseTranslators.length} translators in Supabase`);

    // Transform the data to match the expected format
    const formattedTranslators = supabaseTranslators.map(translator => ({
      id: translator.id,
      name: translator.name || translator.email.split('@')[0],
      email: translator.email,
      userType: translator.user_type,
      languages: translator.languages || ['English'],
      specialties: translator.specialties || ['General'],
      rating: translator.rating || 4.0,
      reviewCount: translator.review_count || 0,
      completedProjects: translator.completed_projects || 0,
      onTimePercentage: translator.on_time_percentage || 100,
      ratePerWord: translator.hourly_rate || 0.10,
      description: translator.bio || `Professional translator with expertise in multiple languages and domains.`,
      profileImage: translator.profile_image,
      location: translator.location,
      yearsOfExperience: translator.years_of_experience || 0,
      certifications: translator.certifications,
      education: translator.education,
      isVerified: translator.is_verified || false
    }));

    return formattedTranslators;
  } catch (error) {
    console.error('Error in getAllTranslators:', error);
    return [];
  }
};

// Get translator by ID
export const getTranslatorById = async (translatorId) => {
  try {
    console.log(`Fetching translator with ID: ${translatorId}`);

    // Fetch translator directly from Supabase
    const { data: translator, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', translatorId)
      .eq('user_type', 'translator')
      .single();

    if (error) {
      console.error('Error fetching translator from Supabase:', error);
      throw new Error('Translator not found');
    }

    if (!translator) {
      throw new Error('Translator not found');
    }

    // Transform the data to match the expected format
    const formattedTranslator = {
      id: translator.id,
      name: translator.name || translator.email.split('@')[0],
      email: translator.email,
      userType: translator.user_type,
      languages: translator.languages || ['English'],
      specialties: translator.specialties || ['General'],
      rating: translator.rating || 4.0,
      reviewCount: translator.review_count || 0,
      completedProjects: translator.completed_projects || 0,
      onTimePercentage: translator.on_time_percentage || 100,
      ratePerWord: translator.hourly_rate || 0.10,
      description: translator.bio || `Professional translator with expertise in multiple languages and domains.`,
      profileImage: translator.profile_image,
      location: translator.location,
      yearsOfExperience: translator.years_of_experience || 0,
      certifications: translator.certifications,
      education: translator.education,
      isVerified: translator.is_verified || false
    };

    console.log('Successfully fetched translator:', formattedTranslator.name);
    return formattedTranslator;
  } catch (error) {
    console.error('Error in getTranslatorById:', error);
    throw error;
  }
};
