const { supabase, supabaseAdmin } = require('../config/supabase');

// Helper function to generate languages based on translator name
const getLanguagesForTranslator = (name) => {
  // Default language is always English
  const languages = ['English'];

  // Add languages based on name patterns (this is just for demo purposes)
  const lowerName = name.toLowerCase();

  if (lowerName.includes('kefi') || lowerName.includes('ouday')) {
    languages.push('Arabic', 'French');
  } else if (lowerName.includes('rodriguez') || lowerName.includes('garcia') || lowerName.includes('martinez')) {
    languages.push('Spanish');
  } else if (lowerName.includes('kim') || lowerName.includes('park') || lowerName.includes('lee')) {
    languages.push('Korean');
  } else if (lowerName.includes('wang') || lowerName.includes('zhang') || lowerName.includes('li')) {
    languages.push('Chinese');
  } else if (lowerName.includes('tanaka') || lowerName.includes('suzuki') || lowerName.includes('sato')) {
    languages.push('Japanese');
  } else if (lowerName.includes('mueller') || lowerName.includes('schmidt') || lowerName.includes('schneider')) {
    languages.push('German');
  } else if (lowerName.includes('dubois') || lowerName.includes('lefebvre') || lowerName.includes('moreau')) {
    languages.push('French');
  } else if (lowerName.includes('rossi') || lowerName.includes('ferrari') || lowerName.includes('esposito')) {
    languages.push('Italian');
  } else if (lowerName.includes('ivanov') || lowerName.includes('petrov') || lowerName.includes('smirnov')) {
    languages.push('Russian');
  } else {
    // Add a random second language if none matched
    const randomLanguages = ['Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Arabic'];
    languages.push(randomLanguages[Math.floor(Math.random() * randomLanguages.length)]);
  }

  return languages;
};

// Helper function to generate specialties based on translator name
const getSpecialtiesForTranslator = (name) => {
  // Generate 1-3 random specialties
  const allSpecialties = [
    'Legal', 'Medical', 'Technical', 'Financial', 'Marketing',
    'Literary', 'Academic', 'Scientific', 'Business', 'IT'
  ];

  const numSpecialties = 1 + Math.floor(Math.random() * 3); // 1-3 specialties
  const specialties = [];

  // Ensure Ouday Kefi has specific specialties
  if (name.toLowerCase().includes('kefi') || name.toLowerCase().includes('ouday')) {
    specialties.push('Technical', 'IT');
    if (numSpecialties > 2) {
      specialties.push('Business');
    }
    return specialties;
  }

  // For other translators, pick random specialties
  while (specialties.length < numSpecialties) {
    const specialty = allSpecialties[Math.floor(Math.random() * allSpecialties.length)];
    if (!specialties.includes(specialty)) {
      specialties.push(specialty);
    }
  }

  return specialties;
};

// Helper function to generate description based on translator name, languages and specialties
const getDescriptionForTranslator = (name, languages, specialties) => {
  // Special description for Ouday Kefi
  if (name.toLowerCase().includes('kefi') || name.toLowerCase().includes('ouday')) {
    return `Professional translator specializing in ${specialties.join(' and ')} translations. Fluent in ${languages.join(', ')} with extensive experience in software localization and technical documentation.`;
  }

  // Generate description based on languages and specialties
  const experienceYears = 2 + Math.floor(Math.random() * 15); // 2-17 years of experience
  const languagePhrase = languages.length > 1
    ? `Fluent in ${languages.join(' and ')}`
    : `Native ${languages[0]} speaker`;

  const specialtyPhrase = specialties.length > 1
    ? `specializing in ${specialties.join(' and ')} translations`
    : `with expertise in ${specialties[0]} translation`;

  return `${languagePhrase} ${specialtyPhrase}. ${experienceYears} years of professional translation experience with a focus on quality and accuracy.`;
};

// Get all translators
const getAllTranslators = async () => {
  try {
    console.log('Fetching all translators from database');

    // First try with supabaseAdmin to bypass RLS policies
    let usersData, usersError;
    let translatorsData = [];

    try {
      console.log('Trying to fetch translators with supabaseAdmin');
      // First get all users who are translators
      const usersResult = await supabaseAdmin
        .from('users')
        .select('id, name, email, user_type, created_at')
        .eq('user_type', 'translator')
        .order('created_at', { ascending: false });

      usersData = usersResult.data;
      usersError = usersResult.error;

      if (usersError) {
        console.error('Error fetching users with supabaseAdmin:', usersError);
        throw usersError;
      }

      // Now get translator profiles for these users
      if (usersData && usersData.length > 0) {
        console.log(`Found ${usersData.length} translator users, fetching their profiles...`);

        // Get all translator profiles in one query
        const translatorIds = usersData.map(user => user.id);
        const translatorsResult = await supabaseAdmin
          .from('translators')
          .select('*')
          .in('user_id', translatorIds);

        if (translatorsResult.error) {
          console.error('Error fetching translator profiles:', translatorsResult.error);
        } else if (translatorsResult.data) {
          translatorsData = translatorsResult.data;
          console.log(`Found ${translatorsData.length} translator profiles`);
        }
      }
    } catch (adminError) {
      console.error('Failed to fetch with supabaseAdmin, trying regular supabase client:', adminError);

      // Fallback to regular supabase client
      const usersResult = await supabase
        .from('users')
        .select('id, name, email, user_type, created_at')
        .eq('user_type', 'translator')
        .order('created_at', { ascending: false });

      usersData = usersResult.data;
      usersError = usersResult.error;

      if (usersError) {
        console.error('Supabase error fetching translators:', usersError);
        throw new Error(`Error retrieving translators: ${usersError.message}`);
      }

      // Now get translator profiles for these users
      if (usersData && usersData.length > 0) {
        console.log(`Found ${usersData.length} translator users, fetching their profiles...`);

        // Get all translator profiles in one query
        const translatorIds = usersData.map(user => user.id);
        const translatorsResult = await supabase
          .from('translators')
          .select('*')
          .in('user_id', translatorIds);

        if (translatorsResult.error) {
          console.error('Error fetching translator profiles:', translatorsResult.error);
        } else if (translatorsResult.data) {
          translatorsData = translatorsResult.data;
          console.log(`Found ${translatorsData.length} translator profiles`);
        }
      }
    }

    if (!usersData || usersData.length === 0) {
      console.log('No translators found in database');
      return [];
    }

    console.log(`Raw translator data from database: ${usersData.length} users and ${translatorsData.length} profiles found`);

    // Map users to their profiles
    return usersData.map(user => {
      // Find the matching translator profile
      const profile = translatorsData.find(t => t.user_id === user.id);

      // If we have a profile, use its data, otherwise generate mock data
      let languages, specialties, description, rating, hourlyRate;

      if (profile) {
        languages = profile.languages || [];
        specialties = profile.specializations || [];
        rating = profile.rating;
        hourlyRate = profile.hourly_rate;
      } else {
        // Generate mock data if no profile exists
        languages = getLanguagesForTranslator(user.name);
        specialties = getSpecialtiesForTranslator(user.name);
        rating = Math.floor(Math.random() * 5) + 3; // Random rating between 3-5
        hourlyRate = (0.08 + Math.random() * 0.07).toFixed(2); // Random rate between 0.08-0.15
      }

      // Generate description if not available
      description = profile?.description || getDescriptionForTranslator(user.name, languages, specialties);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.user_type,
        createdAt: user.created_at,
        languages: languages,
        specialties: specialties,
        description: description,
        rating: rating,
        reviewCount: profile?.review_count || Math.floor(Math.random() * 50),
        completedProjects: profile?.completed_projects || Math.floor(Math.random() * 100),
        onTimePercentage: profile?.on_time_percentage || (90 + Math.floor(Math.random() * 10)),
        ratePerWord: profile?.hourly_rate ? (profile.hourly_rate / 1000).toFixed(2) : hourlyRate,
        profile: profile
      };
    });
  } catch (error) {
    console.error('Error in getAllTranslators:', error);
    throw error;
  }
};

// Get translator by ID
const getTranslatorById = async (translatorId) => {
  try {
    if (!translatorId) {
      throw new Error('Translator ID is required');
    }

    // Get user data
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, name, email, user_type, created_at')
      .eq('id', translatorId)
      .eq('user_type', 'translator')
      .single();

    if (userError) {
      console.error('Error fetching translator user:', userError);
      throw new Error('Translator not found');
    }

    // Get translator profile data
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('translators')
      .select('*')
      .eq('user_id', translatorId)
      .single();

    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error fetching translator profile:', profileError);
      // Continue even if profile not found
    }

    // If we have a profile, use its data, otherwise generate mock data
    let languages, specialties, description, rating, hourlyRate;

    if (profileData) {
      languages = profileData.languages || [];
      specialties = profileData.specializations || [];
      rating = profileData.rating;
      hourlyRate = profileData.hourly_rate;
      description = profileData.description;
    } else {
      // Generate mock data if no profile exists
      languages = getLanguagesForTranslator(userData.name);
      specialties = getSpecialtiesForTranslator(userData.name);
      rating = Math.floor(Math.random() * 5) + 3; // Random rating between 3-5
      hourlyRate = (0.08 + Math.random() * 0.07).toFixed(2); // Random rate between 0.08-0.15
      description = getDescriptionForTranslator(userData.name, languages, specialties);
    }

    return {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      userType: userData.user_type,
      createdAt: userData.created_at,
      languages: languages,
      specialties: specialties,
      description: description || getDescriptionForTranslator(userData.name, languages, specialties),
      rating: rating,
      reviewCount: profileData?.review_count || Math.floor(Math.random() * 50),
      completedProjects: profileData?.completed_projects || Math.floor(Math.random() * 100),
      onTimePercentage: profileData?.on_time_percentage || (90 + Math.floor(Math.random() * 10)),
      ratePerWord: profileData?.hourly_rate ? (profileData.hourly_rate / 1000).toFixed(2) : hourlyRate,
      profile: profileData
    };
  } catch (error) {
    console.error('Error in getTranslatorById:', error);
    throw error;
  }
};

module.exports = {
  getAllTranslators,
  getTranslatorById
};
