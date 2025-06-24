-- Test Data for LingoLink Platform
-- Run this AFTER creating tables and setting up RLS policies

-- First, let's check what users already exist and only insert missing ones
DO $$
BEGIN
    -- Insert test users only if they don't exist

    -- Test Client 1
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'client@test.com') THEN
        INSERT INTO users (id, name, email, password, user_type, phone, bio, location, languages, specialties, years_of_experience, hourly_rate, is_verified, email_verified)
        VALUES ('11111111-1111-1111-1111-111111111111', 'John Client', 'client@test.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'client', '+1234567890', 'Professional client looking for quality translations', 'New York, USA', ARRAY['English'], ARRAY['Business'], NULL, NULL, true, true);
    END IF;

    -- Test Translator 1
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'translator@test.com') THEN
        INSERT INTO users (id, name, email, password, user_type, phone, bio, location, languages, specialties, years_of_experience, hourly_rate, is_verified, email_verified)
        VALUES ('22222222-2222-2222-2222-222222222222', 'Maria Translator', 'translator@test.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'translator', '+1987654321', 'Professional translator with 5 years of experience', 'Madrid, Spain', ARRAY['English', 'Spanish', 'French'], ARRAY['Legal', 'Medical', 'Technical'], 5, 25.00, true, true);
    END IF;

    -- Test Translator 2
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'translator2@test.com') THEN
        INSERT INTO users (id, name, email, password, user_type, phone, bio, location, languages, specialties, years_of_experience, hourly_rate, is_verified, email_verified)
        VALUES ('33333333-3333-3333-3333-333333333333', 'Ahmed Translator', 'translator2@test.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'translator', '+201234567890', 'Experienced Arabic-English translator', 'Cairo, Egypt', ARRAY['Arabic', 'English'], ARRAY['Legal', 'Business'], 8, 30.00, true, true);
    END IF;

    -- Test Client 2
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'client2@test.com') THEN
        INSERT INTO users (id, name, email, password, user_type, phone, bio, location, languages, specialties, years_of_experience, hourly_rate, is_verified, email_verified)
        VALUES ('44444cd /path/to/your/project
        npm start#!/bin/bash
        
        # Change into the project directory
        cd /path/to/your/project
        
        # Install dependencies
        npm install
        
        # Start the development server
        npm start444-4444-4444-4444-444444444444', 'Sarah Business', 'client2@test.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'client', '+33123456789', 'Business owner needing document translations', 'Paris, France', ARRAY['French'], ARRAY['Business'], NULL, NULL, true, true);
    END IF;

    -- Admin User (update existing if it exists, insert if it doesn't)
    IF EXISTS (SELECT 1 FROM users WHERE email = 'ouday.kefi@gmail.com') THEN
        UPDATE users SET
            user_type = 'admin',
            phone = '+216123456789',
            bio = 'Platform administrator',
            location = 'Tunis, Tunisia',
            languages = ARRAY['English', 'Arabic', 'French'],
            specialties = ARRAY['Administration'],
            is_verified = true,
            email_verified = true
        WHERE email = 'ouday.kefi@gmail.com';
    ELSE
        INSERT INTO users (id, name, email, password, user_type, phone, bio, location, languages, specialties, years_of_experience, hourly_rate, is_verified, email_verified)
        VALUES ('55555555-5555-5555-5555-555555555555', 'Admin User', 'ouday.kefi@gmail.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', '+216123456789', 'Platform administrator', 'Tunis, Tunisia', ARRAY['English', 'Arabic', 'French'], ARRAY['Administration'], NULL, NULL, true, true);
    END IF;

END $$;

-- Insert test translation requests
INSERT INTO translation_requests (id, client_id, title, description, source_language, target_language, word_count, deadline, budget, urgency, status) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Legal Contract Translation', 'Need to translate a business contract from English to Spanish', 'English', 'Spanish', 1500, NOW() + INTERVAL '7 days', 150.00, 'normal', 'pending'),

('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 'Medical Report Translation', 'Urgent medical report translation from French to English', 'French', 'English', 800, NOW() + INTERVAL '2 days', 120.00, 'urgent', 'pending'),

('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'Technical Manual Translation', 'Software manual translation from English to Arabic', 'English', 'Arabic', 2000, NOW() + INTERVAL '10 days', 200.00, 'normal', 'assigned'),

('dddddddd-dddd-dddd-dddd-dddddddddddd', '44444444-4444-4444-4444-444444444444', 'Website Content Translation', 'E-commerce website content translation', 'French', 'Spanish', 1200, NOW() + INTERVAL '5 days', 100.00, 'high', 'pending')

ON CONFLICT (id) DO NOTHING;

-- Update one request to be assigned to a translator
UPDATE translation_requests 
SET translator_id = '33333333-3333-3333-3333-333333333333', status = 'assigned'
WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

-- Insert test translation applications
INSERT INTO translation_applications (request_id, translator_id, status, cover_letter, proposed_rate, estimated_delivery) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'pending', 'I have extensive experience in legal translations and can deliver high-quality work within your timeline.', 25.00, NOW() + INTERVAL '6 days'),

('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'pending', 'I specialize in medical translations and can handle urgent requests with accuracy.', 30.00, NOW() + INTERVAL '1 day'),

('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 'pending', 'I can translate your website content maintaining the marketing tone and cultural adaptation.', 20.00, NOW() + INTERVAL '4 days'),

('dddddddd-dddd-dddd-dddd-dddddddddddd', '33333333-3333-3333-3333-333333333333', 'pending', 'Experienced in website localization with cultural sensitivity.', 22.00, NOW() + INTERVAL '4 days')

ON CONFLICT (request_id, translator_id) DO NOTHING;

-- Insert test conversations
INSERT INTO conversations (id, participant1_id, participant2_id) VALUES
('conv1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222'),
('conv2222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333'),
('conv3333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333')

ON CONFLICT (participant1_id, participant2_id) DO NOTHING;

-- Insert test messages
INSERT INTO messages (conversation_id, sender_id, content, is_read) VALUES
-- Conversation 1: Client and Translator 1
('conv1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Hello! I saw your application for my legal contract translation. Can you tell me more about your experience with legal documents?', true),
('conv1111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Hello! I have over 5 years of experience translating legal documents, including contracts, agreements, and court documents. I ensure accuracy and maintain legal terminology consistency.', true),
('conv1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'That sounds great! What is your typical turnaround time for a 1500-word contract?', false),

-- Conversation 2: Client 2 and Translator 2
('conv2222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 'Hi Ahmed! I need urgent translation for a medical report. Can you handle it within 2 days?', true),
('conv2222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'Hello Sarah! Yes, I can definitely handle urgent medical translations. I have experience with medical terminology and can deliver within your timeline.', false),

-- Conversation 3: Client and Translator 2
('conv3333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Thank you for accepting my technical manual project. When can we start?', true),
('conv3333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'Thank you for choosing me! I can start immediately. I will send you the first draft within 3 days.', true),
('conv3333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Perfect! Please let me know if you need any clarifications about the technical terms.', false);

-- Insert test notifications
INSERT INTO notifications (user_id, title, content, type, is_read) VALUES
('22222222-2222-2222-2222-222222222222', 'New Translation Request', 'You have a new translation request for Legal Contract Translation', 'request', false),
('22222222-2222-2222-2222-222222222222', 'Message Received', 'You have a new message from John Client', 'message', false),
('11111111-1111-1111-1111-111111111111', 'Application Received', 'Maria Translator applied to your Legal Contract Translation request', 'info', true),
('33333333-3333-3333-3333-333333333333', 'Project Assigned', 'You have been assigned to Technical Manual Translation project', 'success', true),
('44444444-4444-4444-4444-444444444444', 'New Message', 'You have a new message from Ahmed Translator', 'message', false);

-- Insert test reviews
INSERT INTO reviews (request_id, client_id, translator_id, rating, content) VALUES
('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 5, 'Excellent work! Ahmed delivered high-quality translation on time with great attention to detail.');

-- Update user ratings based on reviews
UPDATE users SET 
    hourly_rate = CASE 
        WHEN id = '22222222-2222-2222-2222-222222222222' THEN 25.00
        WHEN id = '33333333-3333-3333-3333-333333333333' THEN 30.00
        ELSE hourly_rate
    END,
    years_of_experience = CASE 
        WHEN id = '22222222-2222-2222-2222-222222222222' THEN 5
        WHEN id = '33333333-3333-3333-3333-333333333333' THEN 8
        ELSE years_of_experience
    END
WHERE user_type = 'translator';
