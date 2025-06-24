// Create a simple test conversation
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Use service role key to bypass RLS
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createTestConversation() {
  console.log('Creating test conversation...');

  try {
    // Get client and translator users
    const { data: clientUser, error: clientError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'client@test.com')
      .single();

    if (clientError || !clientUser) {
      console.error('Client user not found:', clientError);
      return;
    }

    const { data: translatorUser, error: translatorError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'translator@test.com')
      .single();

    if (translatorError || !translatorUser) {
      console.error('Translator user not found:', translatorError);
      return;
    }

    console.log('Found users:');
    console.log('  Client:', clientUser.name, clientUser.id);
    console.log('  Translator:', translatorUser.name, translatorUser.id);

    // Check if conversation already exists
    const { data: existingConv, error: existingError } = await supabase
      .from('conversations')
      .select('*')
      .or(`and(participant1_id.eq.${clientUser.id},participant2_id.eq.${translatorUser.id}),and(participant1_id.eq.${translatorUser.id},participant2_id.eq.${clientUser.id})`)
      .single();

    let conversation;
    if (existingConv) {
      console.log('Conversation already exists:', existingConv.id);
      conversation = existingConv;
    } else {
      // Create new conversation
      const { data: newConv, error: convError } = await supabase
        .from('conversations')
        .insert({
          participant1_id: clientUser.id,
          participant2_id: translatorUser.id
        })
        .select()
        .single();

      if (convError) {
        console.error('Error creating conversation:', convError);
        return;
      }

      console.log('✅ Created conversation:', newConv.id);
      conversation = newConv;
    }

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
      },
      {
        conversation_id: conversation.id,
        sender_id: translatorUser.id,
        content: 'I can complete a 1500-word business contract translation within 3-4 business days. My rate is $0.12 per word for legal documents. Would you like me to send you a formal quote?',
        is_read: false
      }
    ];

    console.log('Adding test messages...');
    for (const message of testMessages) {
      const { data, error: msgError } = await supabase
        .from('messages')
        .insert(message)
        .select()
        .single();
      
      if (msgError) {
        console.error('Error creating message:', msgError);
      } else {
        console.log(`✅ Created message: ${message.content.substring(0, 50)}...`);
      }
    }

    console.log('\n🎉 Test conversation created successfully!');

    // Now test the messaging API
    console.log('\nTesting messaging API...');
    await testMessagingAPI(translatorUser.id);

  } catch (error) {
    console.error('Error creating test conversation:', error);
  }
}

async function testMessagingAPI(userId) {
  try {
    // Test the conversations endpoint directly
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select(`
        *,
        participant1:users!conversations_participant1_id_fkey(id, name, email, user_type),
        participant2:users!conversations_participant2_id_fkey(id, name, email, user_type)
      `)
      .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('❌ Database query error:', error);
    } else {
      console.log(`✅ Found ${conversations.length} conversations for user ${userId}`);
      conversations.forEach(conv => {
        const otherUser = conv.participant1_id === userId ? conv.participant2 : conv.participant1;
        console.log(`  - Conversation with ${otherUser.name} (${otherUser.email})`);
      });
    }
  } catch (error) {
    console.error('Error testing messaging API:', error);
  }
}

// Run the setup if this file is executed directly
if (require.main === module) {
  createTestConversation().then(() => {
    console.log('Test conversation setup complete');
    process.exit(0);
  }).catch(error => {
    console.error('Test conversation setup failed:', error);
    process.exit(1);
  });
}

module.exports = { createTestConversation };
