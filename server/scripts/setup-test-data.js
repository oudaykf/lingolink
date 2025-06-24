const { supabase } = require('../config/supabase');
const bcrypt = require('bcryptjs');

async function setupTestData() {
  console.log('Setting up test data for LingoLink platform...');

  try {
    // Create test users with basic fields only
    const testUsers = [
      {
        name: 'Test Client',
        email: 'client@test.com',
        password: await bcrypt.hash('29613676', 10),
        user_type: 'client'
      },
      {
        name: 'Test Translator',
        email: 'translator@test.com',
        password: await bcrypt.hash('29613676', 10),
        user_type: 'translator'
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.translator@test.com',
        password: await bcrypt.hash('29613676', 10),
        user_type: 'translator'
      },
      {
        name: 'Admin User',
        email: 'admin@test.com',
        password: await bcrypt.hash('29613676', 10),
        user_type: 'admin'
      }
    ];

    console.log('Creating test users...');
    for (const user of testUsers) {
      const { data, error } = await supabase
        .from('users')
        .upsert(user, { onConflict: 'email' });
      
      if (error) {
        console.error(`Error creating user ${user.email}:`, error);
      } else {
        console.log(`✓ Created user: ${user.email} (${user.user_type})`);
      }
    }

    // Get the created users for creating test data
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .in('email', testUsers.map(u => u.email));

    if (usersError) {
      console.error('Error fetching created users:', usersError);
      return;
    }

    const client = users.find(u => u.user_type === 'client');
    const translator1 = users.find(u => u.email === 'translator@test.com');
    const translator2 = users.find(u => u.email === 'sarah.translator@test.com');

    if (!client || !translator1 || !translator2) {
      console.error('Could not find created test users');
      return;
    }

    // Create test translation requests
    const testRequests = [
      {
        client_id: client.id,
        title: 'Legal Document Translation',
        description: 'Need to translate a legal contract from English to French. The document contains standard business terms and conditions.',
        source_language: 'English',
        target_language: 'French',
        word_count: 1500,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        budget: 180.00,
        special_requirements: 'Certified translation required for legal purposes',
        urgency: 'normal',
        status: 'pending'
      },
      {
        client_id: client.id,
        title: 'Medical Research Paper',
        description: 'Translation of a medical research paper from English to German. Requires expertise in medical terminology.',
        source_language: 'English',
        target_language: 'German',
        word_count: 3000,
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
        budget: 450.00,
        special_requirements: 'Medical translation expertise required',
        urgency: 'normal',
        status: 'pending'
      },
      {
        client_id: client.id,
        translator_id: translator1.id,
        title: 'Technical Manual Translation',
        description: 'Translation of a software technical manual from English to Spanish.',
        source_language: 'English',
        target_language: 'Spanish',
        word_count: 2500,
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
        budget: 300.00,
        special_requirements: 'Technical expertise in software documentation',
        urgency: 'normal',
        status: 'assigned'
      }
    ];

    console.log('Creating test translation requests...');
    for (const request of testRequests) {
      const { data, error } = await supabase
        .from('translation_requests')
        .insert(request);
      
      if (error) {
        console.error('Error creating translation request:', error);
      } else {
        console.log(`✓ Created translation request: ${request.title}`);
      }
    }

    // Create a test conversation
    console.log('Creating test conversation...');
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .insert({
        participant1_id: client.id,
        participant2_id: translator1.id
      })
      .select()
      .single();

    if (convError) {
      console.error('Error creating conversation:', convError);
    } else {
      console.log('✓ Created test conversation');

      // Add some test messages
      const testMessages = [
        {
          conversation_id: conversation.id,
          sender_id: client.id,
          content: 'Hello! I saw your profile and I\'m interested in your translation services for a legal document.',
          is_read: true
        },
        {
          conversation_id: conversation.id,
          sender_id: translator1.id,
          content: 'Hello! Thank you for reaching out. I\'d be happy to help with your legal document translation. Could you provide more details about the document?',
          is_read: true
        },
        {
          conversation_id: conversation.id,
          sender_id: client.id,
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
      console.log('✓ Created test messages');
    }

    // Create test reviews
    console.log('Creating test reviews...');
    const { data: completedRequest, error: reqError } = await supabase
      .from('translation_requests')
      .insert({
        client_id: client.id,
        translator_id: translator2.id,
        title: 'Completed Medical Translation',
        description: 'Medical document translation - completed project',
        source_language: 'English',
        target_language: 'German',
        word_count: 2000,
        deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        budget: 300.00,
        status: 'completed'
      })
      .select()
      .single();

    if (!reqError && completedRequest) {
      const { error: reviewError } = await supabase
        .from('reviews')
        .insert({
          request_id: completedRequest.id,
          client_id: client.id,
          translator_id: translator2.id,
          rating: 5,
          content: 'Excellent work! The translation was accurate and delivered on time. Sarah is very professional and I would definitely work with her again.'
        });

      if (reviewError) {
        console.error('Error creating review:', reviewError);
      } else {
        console.log('✓ Created test review');
      }
    }

    console.log('\n🎉 Test data setup completed successfully!');
    console.log('\nTest Accounts Created:');
    console.log('📧 Client: client@test.com (password: 29613676)');
    console.log('🌐 Translator 1: translator@test.com (password: 29613676)');
    console.log('🌐 Translator 2: sarah.translator@test.com (password: 29613676)');
    console.log('👑 Admin: admin@test.com (password: 29613676)');
    console.log('\nYou can now test the platform with these accounts!');

  } catch (error) {
    console.error('Error setting up test data:', error);
  }
}

// Run the setup if this file is executed directly
if (require.main === module) {
  setupTestData().then(() => {
    console.log('Setup complete');
    process.exit(0);
  }).catch(error => {
    console.error('Setup failed:', error);
    process.exit(1);
  });
}

module.exports = { setupTestData };
