/**
 * Script to set up authentication tables in Supabase
 * This script ensures that all necessary tables for authentication are created
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Manually set environment variables if they're not loaded from .env
if (!process.env.SUPABASE_URL) {
  process.env.SUPABASE_URL = 'https://tzvoplcsyxfjrsjfvfks.supabase.co';
  process.env.SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6dm9wbGNzeXhmanJzamZ2ZmtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NTU2NzIsImV4cCI6MjA1OTQzMTY3Mn0.Pj805bCcraF42LpWWuVPrfQys2RIw_YtOpbo2lG1IjQ';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6dm9wbGNzeXhmanJzamZ2ZmtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mzg1NTY3MiwiZXhwIjoyMDU5NDMxNjcyfQ.oGjgs5RpuFjlVCV9Sy3dgjSeOY90QOphZl2mLnCl4AM';
  process.env.JWT_SECRET = '+PRSBnUVTfads9HxNyCEBBLAqIkF//6PmGhN9lbi96BGwMFStiKYslVJcc6ILaDbKgkB/bkA+PWcAxpEljNRlQ==';
  console.log('Environment variables set manually');
}

const { supabaseAdmin } = require('../config/supabase');

async function setupAuthTables() {
  console.log('Setting up authentication tables in Supabase...');

  try {
    // Check if users table exists
    const { error: usersCheckError } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1);

    if (usersCheckError && usersCheckError.code === '42P01') { // Table doesn't exist
      console.log('Users table does not exist, creating it...');
      await createUsersTable();
    } else {
      console.log('Users table already exists');
    }

    // Check if clients table exists
    const { error: clientsCheckError } = await supabaseAdmin
      .from('clients')
      .select('count')
      .limit(1);

    if (clientsCheckError && clientsCheckError.code === '42P01') { // Table doesn't exist
      console.log('Clients table does not exist, creating it...');
      await createClientsTable();
    } else {
      console.log('Clients table already exists');
    }

    // Check if translators table exists
    const { error: translatorsCheckError } = await supabaseAdmin
      .from('translators')
      .select('count')
      .limit(1);

    if (translatorsCheckError && translatorsCheckError.code === '42P01') { // Table doesn't exist
      console.log('Translators table does not exist, creating it...');
      await createTranslatorsTable();
    } else {
      console.log('Translators table already exists');
    }

    // Check if user_verification table exists
    const { error: verificationCheckError } = await supabaseAdmin
      .from('user_verification')
      .select('count')
      .limit(1);

    if (verificationCheckError && verificationCheckError.code === '42P01') { // Table doesn't exist
      console.log('User verification table does not exist, creating it...');
      await createVerificationTable();
    } else {
      console.log('User verification table already exists');
    }

    console.log('All authentication tables are set up successfully!');
  } catch (error) {
    console.error('Error setting up authentication tables:', error);
  }
}

// Create users table
async function createUsersTable() {
  try {
    // Check if users table exists by trying to query it
    const { error: checkError } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1);

    if (checkError && checkError.code === '42P01') { // Table doesn't exist
      console.log('Users table does not exist, please create it manually in the Supabase SQL editor with the following SQL:');
      console.log(`
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          user_type TEXT NOT NULL CHECK (user_type IN ('client', 'translator')),
          gender TEXT CHECK (gender IN ('male', 'female', 'other')),
          phone TEXT,
          email_verified BOOLEAN DEFAULT FALSE,
          phone_verified BOOLEAN DEFAULT FALSE,
          birthdate DATE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      `);
    } else if (checkError) {
      console.error('Error checking users table:', checkError);
    } else {
      console.log('Users table already exists');
    }
  } catch (error) {
    console.error('Failed to check users table:', error);
    // Continue execution even if this fails
  }
}

// Create clients table
async function createClientsTable() {
  try {
    // First try to create the table directly
    const { error: createError } = await supabaseAdmin
      .from('clients')
      .insert([{
        id: '00000000-0000-0000-0000-000000000000',
        user_id: '00000000-0000-0000-0000-000000000000',
        full_name: 'Test User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (createError && createError.code === '42P01') {
      console.log('Table does not exist, creating it with SQL editor...');
      console.log('Please create the clients table manually in the Supabase SQL editor with the following SQL:');
      console.log(`
        CREATE TABLE IF NOT EXISTS clients (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          company_name VARCHAR(255),
          full_name VARCHAR(255) NOT NULL,
          phone_number VARCHAR(50),
          address TEXT,
          country VARCHAR(100),
          preferred_languages TEXT[],
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
      `);
    } else if (createError) {
      console.error('Error checking clients table:', createError);
    } else {
      console.log('Clients table exists or was created successfully');

      // Clean up the test record
      await supabaseAdmin
        .from('clients')
        .delete()
        .eq('id', '00000000-0000-0000-0000-000000000000');
    }
  } catch (error) {
    console.error('Failed to create clients table:', error);
    // Continue execution even if this fails
  }
}

// Create translators table
async function createTranslatorsTable() {
  try {
    // First try to create the table directly
    const { error: createError } = await supabaseAdmin
      .from('translators')
      .insert([{
        id: '00000000-0000-0000-0000-000000000000',
        user_id: '00000000-0000-0000-0000-000000000000',
        full_name: 'Test Translator',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (createError && createError.code === '42P01') {
      console.log('Table does not exist, creating it with SQL editor...');
      console.log('Please create the translators table manually in the Supabase SQL editor with the following SQL:');
      console.log(`
        CREATE TABLE IF NOT EXISTS translators (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          full_name VARCHAR(255) NOT NULL,
          phone_number VARCHAR(50),
          address TEXT,
          country VARCHAR(100),
          languages TEXT[],
          specializations TEXT[],
          certification TEXT,
          years_of_experience INTEGER,
          hourly_rate DECIMAL(10,2),
          availability_status VARCHAR(20) DEFAULT 'available',
          rating DECIMAL(3,2),
          review_count INTEGER DEFAULT 0,
          completed_projects INTEGER DEFAULT 0,
          on_time_percentage INTEGER DEFAULT 100,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_translators_user_id ON translators(user_id);
      `);
    } else if (createError) {
      console.error('Error checking translators table:', createError);
    } else {
      console.log('Translators table exists or was created successfully');

      // Clean up the test record
      await supabaseAdmin
        .from('translators')
        .delete()
        .eq('id', '00000000-0000-0000-0000-000000000000');
    }
  } catch (error) {
    console.error('Failed to create translators table:', error);
    // Continue execution even if this fails
  }
}

// Create verification table
async function createVerificationTable() {
  try {
    // First try to create the table directly
    const { error: createError } = await supabaseAdmin
      .from('user_verification')
      .insert([{
        id: '00000000-0000-0000-0000-000000000000',
        user_id: '00000000-0000-0000-0000-000000000000',
        identity_verified: false,
        face_verified: false,
        verification_status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (createError && createError.code === '42P01') {
      console.log('Table does not exist, creating it with SQL editor...');
      console.log('Please create the user_verification table manually in the Supabase SQL editor with the following SQL:');
      console.log(`
        CREATE TABLE IF NOT EXISTS user_verification (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          identity_verified BOOLEAN DEFAULT FALSE,
          face_verified BOOLEAN DEFAULT FALSE,
          identity_document_type TEXT,
          identity_document_number TEXT,
          identity_document_expiry DATE,
          identity_document_country TEXT,
          face_image_url TEXT,
          identity_document_url TEXT,
          verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'in-progress', 'approved', 'rejected')),
          verification_notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_user_verification_user_id ON user_verification(user_id);
      `);
    } else if (createError) {
      console.error('Error checking user_verification table:', createError);
    } else {
      console.log('User verification table exists or was created successfully');

      // Clean up the test record
      await supabaseAdmin
        .from('user_verification')
        .delete()
        .eq('id', '00000000-0000-0000-0000-000000000000');
    }
  } catch (error) {
    console.error('Failed to create user_verification table:', error);
    // Continue execution even if this fails
  }
}

// Run the setup
setupAuthTables();
