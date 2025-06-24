/**
 * Script to create tables directly using SQL queries
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const fs = require('fs');

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

async function createTables() {
  try {
    console.log('Creating tables in the database...');
    
    // Create clients table
    console.log('Creating clients table...');
    const { data: clientsData, error: clientsError } = await supabaseAdmin
      .from('clients')
      .insert([
        {
          user_id: '1101ad07-3702-4361-b0b8-f1568866417b', // Test Client user ID
          company_name: 'Test Company',
          full_name: 'Test Client',
          phone_number: '1234567890',
          address: '123 Test Street',
          country: 'Test Country',
          preferred_languages: ['English', 'French']
        }
      ])
      .select();
      
    if (clientsError) {
      if (clientsError.code === '42P01') {
        console.log('Clients table does not exist. Creating it...');
        
        // Create the clients table
        const createClientsTableQuery = `
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
        `;
        
        // Execute the query using the REST API
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceRoleKey}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            query: createClientsTableQuery
          })
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error creating clients table:', errorText);
        } else {
          console.log('Clients table created successfully');
          
          // Try inserting the test client again
          const { data: retryData, error: retryError } = await supabaseAdmin
            .from('clients')
            .insert([
              {
                user_id: '1101ad07-3702-4361-b0b8-f1568866417b', // Test Client user ID
                company_name: 'Test Company',
                full_name: 'Test Client',
                phone_number: '1234567890',
                address: '123 Test Street',
                country: 'Test Country',
                preferred_languages: ['English', 'French']
              }
            ])
            .select();
            
          if (retryError) {
            console.error('Error inserting test client after table creation:', retryError);
          } else {
            console.log('Test client inserted successfully:', retryData);
          }
        }
      } else {
        console.error('Error inserting test client:', clientsError);
      }
    } else {
      console.log('Test client inserted successfully:', clientsData);
    }
    
    // Create translators table
    console.log('\nCreating translators table...');
    const { data: translatorsData, error: translatorsError } = await supabaseAdmin
      .from('translators')
      .insert([
        {
          user_id: '3a5b92a2-ed8c-4baf-8d7f-d302215520b7', // Test Translator user ID
          full_name: 'Test Translator',
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
          description: 'Professional translator with 5 years of experience in legal and technical translations.'
        }
      ])
      .select();
      
    if (translatorsError) {
      if (translatorsError.code === '42P01') {
        console.log('Translators table does not exist. Creating it...');
        
        // Create the translators table
        const createTranslatorsTableQuery = `
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
        `;
        
        // Execute the query using the REST API
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceRoleKey}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            query: createTranslatorsTableQuery
          })
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error creating translators table:', errorText);
        } else {
          console.log('Translators table created successfully');
          
          // Try inserting the test translator again
          const { data: retryData, error: retryError } = await supabaseAdmin
            .from('translators')
            .insert([
              {
                user_id: '3a5b92a2-ed8c-4baf-8d7f-d302215520b7', // Test Translator user ID
                full_name: 'Test Translator',
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
                description: 'Professional translator with 5 years of experience in legal and technical translations.'
              }
            ])
            .select();
            
          if (retryError) {
            console.error('Error inserting test translator after table creation:', retryError);
          } else {
            console.log('Test translator inserted successfully:', retryData);
          }
        }
      } else {
        console.error('Error inserting test translator:', translatorsError);
      }
    } else {
      console.log('Test translator inserted successfully:', translatorsData);
    }
    
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

// Run the script
createTables();
