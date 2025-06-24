-- Create missing tables for LingoLink platform
-- Run this script to create tables that might be missing

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Verification codes table for email/phone verification
CREATE TABLE IF NOT EXISTS verification_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code VARCHAR(10) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('email', 'phone')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    used_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, type, code)
);

-- User verification table for identity verification
CREATE TABLE IF NOT EXISTS user_verification (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    identity_document_type VARCHAR(50),
    identity_document_number VARCHAR(100),
    identity_document_expiry DATE,
    identity_document_country VARCHAR(100),
    identity_document_url TEXT,
    face_image_url TEXT,
    liveness_frames JSONB,
    birthdate DATE,
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'in-progress', 'approved', 'rejected')),
    identity_verified BOOLEAN DEFAULT FALSE,
    face_verified BOOLEAN DEFAULT FALSE,
    verification_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Translation requests table (if not exists)
CREATE TABLE IF NOT EXISTS translation_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    translator_id UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    source_language VARCHAR(100) NOT NULL,
    target_language VARCHAR(100) NOT NULL,
    word_count INTEGER NOT NULL,
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    budget DECIMAL(10,2) NOT NULL,
    special_requirements TEXT,
    urgency VARCHAR(50) DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'high', 'urgent')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_progress', 'completed', 'delivered', 'cancelled')),
    attachments JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Translation applications table
CREATE TABLE IF NOT EXISTS translation_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES translation_requests(id) ON DELETE CASCADE,
    translator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    cover_letter TEXT,
    proposed_rate DECIMAL(10,2),
    estimated_delivery TIMESTAMP WITH TIME ZONE,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(request_id, translator_id)
);

-- Conversations table for messaging
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    participant2_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(participant1_id, participant2_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    message_type VARCHAR(50) DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'system')),
    attachment_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table for translator ratings
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES translation_requests(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    translator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(request_id, client_id, translator_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error', 'message', 'request', 'payment')),
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Platform settings table
CREATE TABLE IF NOT EXISTS platform_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_verification_codes_user_id ON verification_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_codes_type ON verification_codes(type);
CREATE INDEX IF NOT EXISTS idx_verification_codes_expires_at ON verification_codes(expires_at);

CREATE INDEX IF NOT EXISTS idx_user_verification_user_id ON user_verification(user_id);
CREATE INDEX IF NOT EXISTS idx_user_verification_status ON user_verification(verification_status);

CREATE INDEX IF NOT EXISTS idx_translation_requests_client_id ON translation_requests(client_id);
CREATE INDEX IF NOT EXISTS idx_translation_requests_translator_id ON translation_requests(translator_id);
CREATE INDEX IF NOT EXISTS idx_translation_requests_status ON translation_requests(status);
CREATE INDEX IF NOT EXISTS idx_translation_requests_created_at ON translation_requests(created_at);

CREATE INDEX IF NOT EXISTS idx_translation_applications_request_id ON translation_applications(request_id);
CREATE INDEX IF NOT EXISTS idx_translation_applications_translator_id ON translation_applications(translator_id);

CREATE INDEX IF NOT EXISTS idx_conversations_participant1_id ON conversations(participant1_id);
CREATE INDEX IF NOT EXISTS idx_conversations_participant2_id ON conversations(participant2_id);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

CREATE INDEX IF NOT EXISTS idx_reviews_translator_id ON reviews(translator_id);
CREATE INDEX IF NOT EXISTS idx_reviews_client_id ON reviews(client_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Insert default platform settings
INSERT INTO platform_settings (key, value, description) VALUES
    ('platform_name', 'LingoLink', 'Name of the platform'),
    ('commission_rate', '10', 'Platform commission rate percentage'),
    ('default_currency', 'USD', 'Default currency for transactions'),
    ('max_file_size', '10485760', 'Maximum file upload size in bytes (10MB)'),
    ('supported_languages', '["English", "Arabic", "French", "Spanish", "German", "Italian", "Portuguese", "Russian", "Chinese", "Japanese"]', 'Supported languages for translation'),
    ('email_notifications', 'true', 'Enable email notifications'),
    ('sms_notifications', 'false', 'Enable SMS notifications')
ON CONFLICT (key) DO NOTHING;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
DROP TRIGGER IF EXISTS update_user_verification_updated_at ON user_verification;
CREATE TRIGGER update_user_verification_updated_at 
    BEFORE UPDATE ON user_verification 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_translation_requests_updated_at ON translation_requests;
CREATE TRIGGER update_translation_requests_updated_at 
    BEFORE UPDATE ON translation_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_conversations_updated_at ON conversations;
CREATE TRIGGER update_conversations_updated_at 
    BEFORE UPDATE ON conversations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_platform_settings_updated_at ON platform_settings;
CREATE TRIGGER update_platform_settings_updated_at 
    BEFORE UPDATE ON platform_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add missing columns to users table if they don't exist
DO $$ 
BEGIN
    -- Add email_verified column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'email_verified') THEN
        ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Add phone_verified column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'phone_verified') THEN
        ALTER TABLE users ADD COLUMN phone_verified BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Add is_verified column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'is_verified') THEN
        ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Add languages column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'languages') THEN
        ALTER TABLE users ADD COLUMN languages TEXT[];
    END IF;
    
    -- Add specialties column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'specialties') THEN
        ALTER TABLE users ADD COLUMN specialties TEXT[];
    END IF;
    
    -- Add rating column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'rating') THEN
        ALTER TABLE users ADD COLUMN rating DECIMAL(3,2) DEFAULT 0.0;
    END IF;
    
    -- Add review_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'review_count') THEN
        ALTER TABLE users ADD COLUMN review_count INTEGER DEFAULT 0;
    END IF;
    
    -- Add completed_projects column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'completed_projects') THEN
        ALTER TABLE users ADD COLUMN completed_projects INTEGER DEFAULT 0;
    END IF;
    
    -- Add on_time_percentage column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'on_time_percentage') THEN
        ALTER TABLE users ADD COLUMN on_time_percentage INTEGER DEFAULT 100;
    END IF;
END $$;
