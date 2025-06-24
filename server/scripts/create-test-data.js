/**
 * Script to create test data in Supabase
 * This script creates test users, clients, and translators
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const bcrypt = require('bcryptjs');

// Manually set environment variables if they're not loaded from .env
if (!process.env.SUPABASE_URL) {
  process.env.SUPABASE_URL = 'https://tzvoplcsyxfjrsjfvfks.supabase.co';
  process.env.SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6dm9wbGNzeXhmanJzamZ2ZmtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NTU2NzIsImV4cCI6MjA1OTQzMTY3Mn0.Pj805bCcraF42LpWWuVPrfQys2RIw_YtOpbo2lG1IjQ';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6dm9wbGNzeXhmanJzamZ2ZmtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mzg1NTY3MiwiZXhwIjoyMDU5NDMxNjcyfQ.oGjgs5RpuFjlVCV9Sy3dgjSeOY90QOphZl2mLnCl4AM';
  process.env.JWT_SECRET = '+PRSBnUVTfads9HxNyCEBBLAqIkF//6PmGhN9lbi96BGwMFStiKYslVJcc6ILaDbKgkB/bkA+PWcAxpEljNRlQ==';
  console.log('Environment variables set manually');
}

const { createClient } = require('@supabase/supabase-js');

// Create Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

async function createTestData() {
  try {
    console.log('Creating test data in Supabase...');

    // Create test client user
    const clientEmail = `test-client-${Date.now()}@example.com`;
    const clientPassword = 'Password123';
    const hashedClientPassword = await bcrypt.hash(clientPassword, 10);

    // Insert client user
    const { data: clientUser, error: clientUserError } = await supabaseAdmin
      .from('users')
      .insert([{
        name: 'Test Client',
        email: clientEmail,
        password: hashedClientPassword,
        user_type: 'client',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (clientUserError) {
      console.error('Error creating client user:', clientUserError);
      return;
    }

    console.log('Client user created:', clientUser[0]);

    // Create client profile
    try {
      const { data: clientProfile, error: clientProfileError } = await supabaseAdmin
        .from('clients')
        .insert([{
          user_id: clientUser[0].id,
          company_name: 'Test Company',
          full_name: 'Test Client User',
          phone_number: '1234567890',
          address: '123 Test Street',
          country: 'Test Country',
          preferred_languages: ['English', 'French'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();

      if (clientProfileError) {
        console.error('Error creating client profile:', clientProfileError);

        // If the error is that the table doesn't exist, create it
        if (clientProfileError.code === '42P01') {
          console.log('Clients table does not exist. Please create it using the SQL script.');
        }
      } else {
        console.log('Client profile created:', clientProfile[0]);
      }
    } catch (error) {
      console.error('Error creating client profile:', error);
    }

    // Create test translator user
    const translatorEmail = `test-translator-${Date.now()}@example.com`;
    const translatorPassword = 'Password123';
    const hashedTranslatorPassword = await bcrypt.hash(translatorPassword, 10);

    // Insert translator user
    const { data: translatorUser, error: translatorUserError } = await supabaseAdmin
      .from('users')
      .insert([{
        name: 'Test Translator',
        email: translatorEmail,
        password: hashedTranslatorPassword,
        user_type: 'translator',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (translatorUserError) {
      console.error('Error creating translator user:', translatorUserError);
      return;
    }

    console.log('Translator user created:', translatorUser[0]);

    // Create translator profile
    try {
      const { data: translatorProfile, error: translatorProfileError } = await supabaseAdmin
        .from('translators')
        .insert([{
          user_id: translatorUser[0].id,
          full_name: 'Test Translator User',
          phone_number: '0987654321',
          address: '456 Translator Avenue',
          country: 'Translator Country',
          languages: ['English', 'Spanish', 'German'],
          specializations: ['Legal', 'Technical'],
          certification: 'Certified Professional Translator',
          years_of_experience: 5,
          hourly_rate: 25,
          rating: 4.8,
          review_count: 42,
          completed_projects: 78,
          on_time_percentage: 98,
          description: 'Professional translator with 5 years of experience in legal and technical translations.',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();

      if (translatorProfileError) {
        console.error('Error creating translator profile:', translatorProfileError);

        // If the error is that the table doesn't exist, create it
        if (translatorProfileError.code === '42P01') {
          console.log('Translators table does not exist. Please create it using the SQL script.');
        }
      } else {
        console.log('Translator profile created:', translatorProfile[0]);
      }
    } catch (error) {
      console.error('Error creating translator profile:', error);
    }

    console.log('\nTest data creation complete!');
    console.log('Client email:', clientEmail);
    console.log('Client password:', clientPassword);
    console.log('Translator email:', translatorEmail);
    console.log('Translator password:', translatorPassword);

  } catch (error) {
    console.error('Error creating test data:', error);
  }
}

// Run the script
createTestData();
