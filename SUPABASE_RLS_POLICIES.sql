-- Row Level Security (RLS) Policies for LingoLink
-- Run this AFTER creating the tables

-- Enable Row Level Security (RLS) for better security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE translation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE translation_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies first
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert" ON users;
DROP POLICY IF EXISTS "Public can view translators" ON users;

-- Users policies
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view translators" ON users FOR SELECT USING (user_type = 'translator');

-- Translation requests policies
DROP POLICY IF EXISTS "Clients can view own requests" ON translation_requests;
DROP POLICY IF EXISTS "Translators can view assigned requests" ON translation_requests;
DROP POLICY IF EXISTS "Public can view pending requests" ON translation_requests;
DROP POLICY IF EXISTS "Clients can create requests" ON translation_requests;
DROP POLICY IF EXISTS "Clients can update own requests" ON translation_requests;

CREATE POLICY "Clients can view own requests" ON translation_requests FOR SELECT USING (client_id = auth.uid());
CREATE POLICY "Translators can view assigned requests" ON translation_requests FOR SELECT USING (translator_id = auth.uid());
CREATE POLICY "Public can view pending requests" ON translation_requests FOR SELECT USING (status = 'pending');
CREATE POLICY "Clients can create requests" ON translation_requests FOR INSERT WITH CHECK (client_id = auth.uid());
CREATE POLICY "Clients can update own requests" ON translation_requests FOR UPDATE USING (client_id = auth.uid());

-- Translation applications policies
DROP POLICY IF EXISTS "Translators can view own applications" ON translation_applications;
DROP POLICY IF EXISTS "Clients can view applications for their requests" ON translation_applications;
DROP POLICY IF EXISTS "Translators can create applications" ON translation_applications;

CREATE POLICY "Translators can view own applications" ON translation_applications FOR SELECT USING (translator_id = auth.uid());
CREATE POLICY "Clients can view applications for their requests" ON translation_applications FOR SELECT USING (
    request_id IN (SELECT id FROM translation_requests WHERE client_id = auth.uid())
);
CREATE POLICY "Translators can create applications" ON translation_applications FOR INSERT WITH CHECK (translator_id = auth.uid());

-- Conversations policies
DROP POLICY IF EXISTS "Users can view own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON conversations;

CREATE POLICY "Users can view own conversations" ON conversations FOR SELECT USING (
    participant1_id = auth.uid() OR participant2_id = auth.uid()
);
CREATE POLICY "Users can create conversations" ON conversations FOR INSERT WITH CHECK (
    participant1_id = auth.uid() OR participant2_id = auth.uid()
);

-- Messages policies
DROP POLICY IF EXISTS "Users can view own messages" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Users can update own messages" ON messages;

CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (
    sender_id = auth.uid() OR 
    conversation_id IN (
        SELECT id FROM conversations 
        WHERE participant1_id = auth.uid() OR participant2_id = auth.uid()
    )
);

CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    conversation_id IN (
        SELECT id FROM conversations 
        WHERE participant1_id = auth.uid() OR participant2_id = auth.uid()
    )
);

CREATE POLICY "Users can update own messages" ON messages FOR UPDATE USING (
    conversation_id IN (
        SELECT id FROM conversations 
        WHERE participant1_id = auth.uid() OR participant2_id = auth.uid()
    )
);

-- Reviews policies
DROP POLICY IF EXISTS "Users can view reviews" ON reviews;
DROP POLICY IF EXISTS "Clients can create reviews" ON reviews;

CREATE POLICY "Users can view reviews" ON reviews FOR SELECT USING (
    client_id = auth.uid() OR translator_id = auth.uid()
);
CREATE POLICY "Clients can create reviews" ON reviews FOR INSERT WITH CHECK (client_id = auth.uid());

-- Notifications policies
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;

CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());

-- File uploads policies
DROP POLICY IF EXISTS "Users can view own files" ON file_uploads;
DROP POLICY IF EXISTS "Users can upload files" ON file_uploads;

CREATE POLICY "Users can view own files" ON file_uploads FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can upload files" ON file_uploads FOR INSERT WITH CHECK (user_id = auth.uid());

-- Payment transactions policies
DROP POLICY IF EXISTS "Users can view own transactions" ON payment_transactions;

CREATE POLICY "Users can view own transactions" ON payment_transactions FOR SELECT USING (
    client_id = auth.uid() OR translator_id = auth.uid()
);

-- Create health_check table for connection testing if it doesn't exist
CREATE TABLE IF NOT EXISTS health_check (
  id SERIAL PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'ok',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert a record into health_check for connection testing
INSERT INTO health_check (status) VALUES ('ok') ON CONFLICT DO NOTHING;

-- Grant permissions to the anon role for registration
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON public.users TO anon;
GRANT ALL ON public.translation_requests TO anon;
GRANT ALL ON public.translation_applications TO anon;
GRANT ALL ON public.conversations TO anon;
GRANT ALL ON public.messages TO anon;
GRANT ALL ON public.reviews TO anon;
GRANT ALL ON public.notifications TO anon;
GRANT ALL ON public.file_uploads TO anon;
GRANT ALL ON public.payment_transactions TO anon;
GRANT ALL ON public.platform_settings TO anon;
GRANT ALL ON public.health_check TO anon;
