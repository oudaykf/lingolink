-- Simple Test Data for LingoLink Platform
-- This script uses existing users and creates sample data

-- First, let's see what users we have and create some basic test data
-- We'll use the first few users from your existing users table

-- Create some test translation requests using existing user IDs
-- We'll get the actual user IDs from your database
DO $$
DECLARE
    client_user_id UUID;
    translator_user_id UUID;
    admin_user_id UUID;
BEGIN
    -- Get the first client user
    SELECT id INTO client_user_id FROM users WHERE user_type = 'client' LIMIT 1;
    
    -- Get the first translator user  
    SELECT id INTO translator_user_id FROM users WHERE user_type = 'translator' LIMIT 1;
    
    -- Get admin user or any user if admin doesn't exist
    SELECT id INTO admin_user_id FROM users WHERE email = 'ouday.kefi@gmail.com' 
    UNION ALL 
    SELECT id FROM users LIMIT 1;
    
    -- Only proceed if we have at least one user
    IF client_user_id IS NOT NULL OR translator_user_id IS NOT NULL THEN
        
        -- Use any available user ID if specific types don't exist
        IF client_user_id IS NULL THEN
            SELECT id INTO client_user_id FROM users LIMIT 1;
        END IF;
        
        IF translator_user_id IS NULL THEN
            SELECT id INTO translator_user_id FROM users OFFSET 1 LIMIT 1;
            IF translator_user_id IS NULL THEN
                SELECT id INTO translator_user_id FROM users LIMIT 1;
            END IF;
        END IF;
        
        -- Insert test translation requests
        INSERT INTO translation_requests (id, client_id, title, description, source_language, target_language, word_count, deadline, budget, urgency, status) VALUES
        ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', client_user_id, 'Legal Contract Translation', 'Need to translate a business contract from English to Spanish', 'English', 'Spanish', 1500, NOW() + INTERVAL '7 days', 150.00, 'normal', 'pending'),
        ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', client_user_id, 'Medical Report Translation', 'Urgent medical report translation from French to English', 'French', 'English', 800, NOW() + INTERVAL '2 days', 120.00, 'urgent', 'pending')
        ON CONFLICT (id) DO NOTHING;
        
        -- Insert test conversations between users
        IF client_user_id != translator_user_id AND translator_user_id IS NOT NULL THEN
            INSERT INTO conversations (id, participant1_id, participant2_id) VALUES
            ('conv1111-1111-1111-1111-111111111111', client_user_id, translator_user_id)
            ON CONFLICT (participant1_id, participant2_id) DO NOTHING;
            
            -- Insert test messages
            INSERT INTO messages (conversation_id, sender_id, content, is_read) VALUES
            ('conv1111-1111-1111-1111-111111111111', client_user_id, 'Hello! I have a translation project that might interest you.', true),
            ('conv1111-1111-1111-1111-111111111111', translator_user_id, 'Hello! I would be happy to help with your translation needs. What type of document do you need translated?', true),
            ('conv1111-1111-1111-1111-111111111111', client_user_id, 'It is a legal contract that needs to be translated from English to Spanish. About 1500 words.', false);
        END IF;
        
        -- Insert test notifications
        INSERT INTO notifications (user_id, title, content, type, is_read) VALUES
        (client_user_id, 'Welcome to LingoLink', 'Welcome to our translation platform! You can now post translation requests.', 'info', false);
        
        IF translator_user_id IS NOT NULL AND translator_user_id != client_user_id THEN
            INSERT INTO notifications (user_id, title, content, type, is_read) VALUES
            (translator_user_id, 'New Translation Opportunity', 'There are new translation requests available that match your skills.', 'request', false);
        END IF;
        
        -- Insert translation applications if we have both client and translator
        IF client_user_id != translator_user_id AND translator_user_id IS NOT NULL THEN
            INSERT INTO translation_applications (request_id, translator_id, status, cover_letter, proposed_rate, estimated_delivery) VALUES
            ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', translator_user_id, 'pending', 'I have experience in legal translations and can deliver high-quality work within your timeline.', 25.00, NOW() + INTERVAL '6 days')
            ON CONFLICT (request_id, translator_id) DO NOTHING;
        END IF;
        
    END IF;
    
END $$;

-- Create some additional test users if needed
INSERT INTO users (name, email, password, user_type, phone, bio, location, is_verified, email_verified) VALUES
('Test Client', 'testclient@lingolink.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'client', '+1234567890', 'Test client for demo purposes', 'New York, USA', true, true),
('Test Translator', 'testtranslator@lingolink.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'translator', '+1987654321', 'Professional translator for testing', 'Madrid, Spain', true, true)
ON CONFLICT (email) DO NOTHING;

-- Update existing admin user if it exists
UPDATE users SET 
    user_type = 'admin',
    bio = 'Platform administrator',
    is_verified = true,
    email_verified = true
WHERE email = 'ouday.kefi@gmail.com';

-- Add some sample platform settings
INSERT INTO platform_settings (key, value, description) VALUES
    ('platform_name', 'LingoLink', 'Name of the platform'),
    ('commission_rate', '10', 'Platform commission rate percentage'),
    ('default_currency', 'USD', 'Default currency for transactions')
ON CONFLICT (key) DO NOTHING;
