// Check database schema and create missing tables
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Use service role key to bypass RLS
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkDatabaseSchema() {
  console.log('Checking database schema...');

  try {
    // Check if conversations table exists
    console.log('\n1. Checking conversations table...');
    const { data: conversations, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .limit(1);

    if (convError) {
      console.log('❌ Conversations table error:', convError.message);
      if (convError.message.includes('does not exist')) {
        await createConversationsTable();
      }
    } else {
      console.log('✅ Conversations table exists');
    }

    // Check if messages table exists
    console.log('\n2. Checking messages table...');
    const { data: messages, error: msgError } = await supabase
      .from('messages')
      .select('*')
      .limit(1);

    if (msgError) {
      console.log('❌ Messages table error:', msgError.message);
      if (msgError.message.includes('does not exist')) {
        await createMessagesTable();
      }
    } else {
      console.log('✅ Messages table exists');
    }

    // Check if translation_requests table exists
    console.log('\n3. Checking translation_requests table...');
    const { data: requests, error: reqError } = await supabase
      .from('translation_requests')
      .select('*')
      .limit(1);

    if (reqError) {
      console.log('❌ Translation requests table error:', reqError.message);
      if (reqError.message.includes('does not exist')) {
        await createTranslationRequestsTable();
      }
    } else {
      console.log('✅ Translation requests table exists');
    }

    // Check if translation_applications table exists
    console.log('\n4. Checking translation_applications table...');
    const { data: applications, error: appError } = await supabase
      .from('translation_applications')
      .select('*')
      .limit(1);

    if (appError) {
      console.log('❌ Translation applications table error:', appError.message);
      if (appError.message.includes('does not exist')) {
        await createTranslationApplicationsTable();
      }
    } else {
      console.log('✅ Translation applications table exists');
    }

    console.log('\n🎉 Database schema check completed!');

  } catch (error) {
    console.error('Error checking database schema:', error);
  }
}

async function createConversationsTable() {
  console.log('Creating conversations table...');
  
  // Note: We can't create tables via the Supabase client
  // This would need to be done via SQL in the Supabase dashboard
  console.log('⚠️  Please create the conversations table in Supabase dashboard with this SQL:');
  console.log(`
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant1_id UUID REFERENCES users(id) ON DELETE CASCADE,
  participant2_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Create policy for users to see their own conversations
CREATE POLICY "Users can view their own conversations" ON conversations
  FOR SELECT USING (
    auth.uid() = participant1_id OR auth.uid() = participant2_id
  );

-- Create policy for users to create conversations
CREATE POLICY "Users can create conversations" ON conversations
  FOR INSERT WITH CHECK (
    auth.uid() = participant1_id OR auth.uid() = participant2_id
  );
  `);
}

async function createMessagesTable() {
  console.log('Creating messages table...');
  
  console.log('⚠️  Please create the messages table in Supabase dashboard with this SQL:');
  console.log(`
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policy for users to see messages in their conversations
CREATE POLICY "Users can view messages in their conversations" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND (conversations.participant1_id = auth.uid() OR conversations.participant2_id = auth.uid())
    )
  );

-- Create policy for users to send messages
CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND (conversations.participant1_id = auth.uid() OR conversations.participant2_id = auth.uid())
    )
  );
  `);
}

async function createTranslationRequestsTable() {
  console.log('Creating translation_requests table...');
  
  console.log('⚠️  Please create the translation_requests table in Supabase dashboard with this SQL:');
  console.log(`
CREATE TABLE translation_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES users(id) ON DELETE CASCADE,
  translator_id UUID REFERENCES users(id) ON DELETE SET NULL,
  title TEXT,
  description TEXT,
  source_language TEXT NOT NULL,
  target_language TEXT NOT NULL,
  word_count INTEGER NOT NULL,
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  budget DECIMAL(10,2) NOT NULL,
  special_requirements TEXT,
  urgency TEXT DEFAULT 'normal',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE translation_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Clients can view their own requests" ON translation_requests
  FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "Translators can view pending requests" ON translation_requests
  FOR SELECT USING (status = 'pending' OR auth.uid() = translator_id);

CREATE POLICY "Clients can create requests" ON translation_requests
  FOR INSERT WITH CHECK (auth.uid() = client_id);
  `);
}

async function createTranslationApplicationsTable() {
  console.log('Creating translation_applications table...');
  
  console.log('⚠️  Please create the translation_applications table in Supabase dashboard with this SQL:');
  console.log(`
CREATE TABLE translation_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES translation_requests(id) ON DELETE CASCADE,
  translator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  message TEXT
);

-- Enable RLS
ALTER TABLE translation_applications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Translators can view their own applications" ON translation_applications
  FOR SELECT USING (auth.uid() = translator_id);

CREATE POLICY "Clients can view applications for their requests" ON translation_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM translation_requests 
      WHERE translation_requests.id = translation_applications.request_id 
      AND translation_requests.client_id = auth.uid()
    )
  );

CREATE POLICY "Translators can create applications" ON translation_applications
  FOR INSERT WITH CHECK (auth.uid() = translator_id);
  `);
}

// Run the check if this file is executed directly
if (require.main === module) {
  checkDatabaseSchema().then(() => {
    console.log('Database schema check complete');
    process.exit(0);
  }).catch(error => {
    console.error('Database schema check failed:', error);
    process.exit(1);
  });
}

module.exports = { checkDatabaseSchema };
