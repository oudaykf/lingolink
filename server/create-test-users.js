// Create test users for messaging and translation requests
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

// Use service role key to bypass RLS
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createTestUsers() {
  console.log('Creating test users...');

  try {
    const hashedPassword = await bcrypt.hash('29613676', 10);

    // Create test client
    const clientData = {
      name: 'Test Client',
      email: 'client@test.com',
      password: hashedPassword,
      user_type: 'client'
    };

    console.log('Creating client user...');
    const { data: client, error: clientError } = await supabase
      .from('users')
      .upsert(clientData, { onConflict: 'email' })
      .select()
      .single();

    if (clientError) {
      console.error('Error creating client:', clientError);
    } else {
      console.log('✅ Created client user:', client.name);

      // Create client profile
      const { error: clientProfileError } = await supabase
        .from('clients')
        .upsert({
          user_id: client.id,
          company_name: 'Test Company Inc.',
          full_name: 'Test Client',
          phone_number: '+1234567890',
          address: '123 Test Street',
          country: 'United States',
          preferred_languages: ['English', 'French']
        }, { onConflict: 'user_id' });

      if (clientProfileError) {
        console.error('Error creating client profile:', clientProfileError);
      } else {
        console.log('✅ Created client profile');
      }
    }

    // Create test translator
    const translatorData = {
      name: 'Test Translator',
      email: 'translator@test.com',
      password: hashedPassword,
      user_type: 'translator'
    };

    console.log('Creating translator user...');
    const { data: translator, error: translatorError } = await supabase
      .from('users')
      .upsert(translatorData, { onConflict: 'email' })
      .select()
      .single();

    if (translatorError) {
      console.error('Error creating translator:', translatorError);
    } else {
      console.log('✅ Created translator user:', translator.name);

      // Create translator profile
      const { error: translatorProfileError } = await supabase
        .from('translators')
        .upsert({
          user_id: translator.id,
          full_name: 'Test Translator',
          phone_number: '+1234567891',
          address: '456 Translator Avenue',
          country: 'Canada',
          languages: ['English', 'French', 'Spanish'],
          specializations: ['Legal', 'Medical', 'Technical'],
          experience_years: 5,
          rate_per_word: 0.12,
          bio: 'Professional translator with 5 years of experience in legal and medical translations.',
          certifications: ['Certified Legal Translator', 'Medical Translation Certificate'],
          portfolio_links: ['https://example.com/portfolio'],
          availability_status: 'available'
        }, { onConflict: 'user_id' });

      if (translatorProfileError) {
        console.error('Error creating translator profile:', translatorProfileError);
      } else {
        console.log('✅ Created translator profile');
      }
    }

    // Create another translator for variety
    const translator2Data = {
      name: 'Maria Rodriguez',
      email: 'maria@translator.com',
      password: hashedPassword,
      user_type: 'translator'
    };

    console.log('Creating second translator user...');
    const { data: translator2, error: translator2Error } = await supabase
      .from('users')
      .upsert(translator2Data, { onConflict: 'email' })
      .select()
      .single();

    if (translator2Error) {
      console.error('Error creating second translator:', translator2Error);
    } else {
      console.log('✅ Created second translator user:', translator2.name);

      // Create second translator profile
      const { error: translator2ProfileError } = await supabase
        .from('translators')
        .upsert({
          user_id: translator2.id,
          full_name: 'Maria Rodriguez',
          phone_number: '+1234567892',
          address: '789 Language Street',
          country: 'Spain',
          languages: ['Spanish', 'English', 'Italian'],
          specializations: ['Marketing', 'Business', 'Literary'],
          experience_years: 8,
          rate_per_word: 0.15,
          bio: 'Experienced translator specializing in marketing and business content with native Spanish fluency.',
          certifications: ['Business Translation Certificate', 'Marketing Localization Expert'],
          portfolio_links: ['https://example.com/maria-portfolio'],
          availability_status: 'available'
        }, { onConflict: 'user_id' });

      if (translator2ProfileError) {
        console.error('Error creating second translator profile:', translator2ProfileError);
      } else {
        console.log('✅ Created second translator profile');
      }
    }

    console.log('\n🎉 Test users creation completed!');

  } catch (error) {
    console.error('Error creating test users:', error);
  }
}

// Run the setup if this file is executed directly
if (require.main === module) {
  createTestUsers().then(() => {
    console.log('User setup complete');
    process.exit(0);
  }).catch(error => {
    console.error('User setup failed:', error);
    process.exit(1);
  });
}

module.exports = { createTestUsers };
