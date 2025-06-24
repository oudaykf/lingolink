// Create test translation requests
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Use service role key to bypass RLS
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createTestRequests() {
  console.log('Creating test translation requests...');

  try {
    // First, get the client user
    const { data: clientUser, error: clientError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'client@test.com')
      .single();

    if (clientError || !clientUser) {
      console.error('Client user not found:', clientError);
      return;
    }

    console.log('Found client user:', clientUser.name);

    // Create test translation requests
    const testRequests = [
      {
        client_id: clientUser.id,
        title: 'Legal Document Translation',
        description: 'Need to translate a legal contract from English to French. The document contains standard business terms and conditions.',
        source_language: 'English',
        target_language: 'French',
        word_count: 1500,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        budget: 180.00,
        special_requirements: 'Certified translation required for legal purposes',
        urgency: 'normal',
        status: 'pending'
      },
      {
        client_id: clientUser.id,
        title: 'Medical Research Paper',
        description: 'Translation of a medical research paper from English to German. Requires expertise in medical terminology.',
        source_language: 'English',
        target_language: 'German',
        word_count: 3000,
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        budget: 450.00,
        special_requirements: 'Medical translation expertise required',
        urgency: 'normal',
        status: 'pending'
      },
      {
        client_id: clientUser.id,
        title: 'Technical Manual Translation',
        description: 'Translation of a software technical manual from English to Spanish.',
        source_language: 'English',
        target_language: 'Spanish',
        word_count: 2500,
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        budget: 300.00,
        special_requirements: 'Technical expertise in software documentation',
        urgency: 'normal',
        status: 'pending'
      },
      {
        client_id: clientUser.id,
        title: 'Marketing Content Translation',
        description: 'Translation of marketing materials from English to Italian for a product launch.',
        source_language: 'English',
        target_language: 'Italian',
        word_count: 800,
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        budget: 120.00,
        special_requirements: 'Creative translation with marketing focus',
        urgency: 'high',
        status: 'pending'
      },
      {
        client_id: clientUser.id,
        title: 'Business Proposal Translation',
        description: 'Translation of a business proposal from English to Arabic for international expansion.',
        source_language: 'English',
        target_language: 'Arabic',
        word_count: 2000,
        deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
        budget: 350.00,
        special_requirements: 'Business terminology expertise required',
        urgency: 'normal',
        status: 'pending'
      }
    ];

    console.log('Creating translation requests...');
    for (const request of testRequests) {
      const { data, error } = await supabase
        .from('translation_requests')
        .insert(request)
        .select()
        .single();
      
      if (error) {
        console.error(`Error creating request "${request.title}":`, error);
      } else {
        console.log(`✅ Created: ${request.title}`);
      }
    }

    // Also create a conversation between client and translator
    console.log('\nCreating test conversation...');
    
    const { data: translatorUser, error: translatorError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'translator@test.com')
      .single();

    if (translatorUser) {
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          participant1_id: clientUser.id,
          participant2_id: translatorUser.id
        })
        .select()
        .single();

      if (!convError && conversation) {
        console.log('✅ Created conversation between client and translator');

        // Add some test messages
        const testMessages = [
          {
            conversation_id: conversation.id,
            sender_id: clientUser.id,
            content: 'Hello! I saw your profile and I\'m interested in your translation services for a legal document.',
            is_read: true
          },
          {
            conversation_id: conversation.id,
            sender_id: translatorUser.id,
            content: 'Hello! Thank you for reaching out. I\'d be happy to help with your legal document translation. Could you provide more details about the document?',
            is_read: true
          },
          {
            conversation_id: conversation.id,
            sender_id: clientUser.id,
            content: 'It\'s a business contract that needs to be translated from English to French. About 1500 words. When would you be able to complete it?',
            is_read: false
          }
        ];

        for (const message of testMessages) {
          const { error: msgError } = await supabase
            .from('messages')
            .insert(message);
          
          if (msgError) {
            console.error('Error creating message:', msgError);
          }
        }
        console.log('✅ Created test messages');
      }
    }

    console.log('\n🎉 Test data creation completed!');

  } catch (error) {
    console.error('Error creating test data:', error);
  }
}

// Run the setup if this file is executed directly
if (require.main === module) {
  createTestRequests().then(() => {
    console.log('Setup complete');
    process.exit(0);
  }).catch(error => {
    console.error('Setup failed:', error);
    process.exit(1);
  });
}

module.exports = { createTestRequests };
