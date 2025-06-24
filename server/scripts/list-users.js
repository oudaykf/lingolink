/**
 * Script to list all users in the database
 * This script displays all users and their profiles from the database
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

const { supabase, supabaseAdmin } = require('../config/supabase');

async function listUsers() {
  console.log('Listing all users in the database...');

  try {
    // Get all users
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return;
    }

    if (!users || users.length === 0) {
      console.log('No users found in the database');
      return;
    }

    console.log(`Found ${users.length} users in the database`);

    // Get all clients
    const { data: clients, error: clientsError } = await supabaseAdmin
      .from('clients')
      .select('*');

    if (clientsError) {
      console.error('Error fetching clients:', clientsError);
    }

    // Get all translators
    const { data: translators, error: translatorsError } = await supabaseAdmin
      .from('translators')
      .select('*');

    if (translatorsError) {
      console.error('Error fetching translators:', translatorsError);
    }

    // Display users with their profiles
    console.log('\n=== USERS IN DATABASE ===');
    for (const user of users) {
      console.log(`\n--- User ID: ${user.id} ---`);
      console.log(`Name: ${user.name}`);
      console.log(`Email: ${user.email}`);
      console.log(`User Type: ${user.user_type}`);
      console.log(`Created At: ${new Date(user.created_at).toLocaleString()}`);

      // Display profile information
      if (user.user_type === 'client') {
        const clientProfile = clients?.find(c => c.user_id === user.id);
        if (clientProfile) {
          console.log('\nClient Profile:');
          console.log(`  Full Name: ${clientProfile.full_name}`);
          console.log(`  Company: ${clientProfile.company_name || 'N/A'}`);
          console.log(`  Phone: ${clientProfile.phone_number || 'N/A'}`);
          console.log(`  Country: ${clientProfile.country || 'N/A'}`);
          console.log(`  Languages: ${clientProfile.preferred_languages ? JSON.stringify(clientProfile.preferred_languages) : 'N/A'}`);
        } else {
          console.log('\nNo client profile found for this user');
        }
      } else if (user.user_type === 'translator') {
        const translatorProfile = translators?.find(t => t.user_id === user.id);
        if (translatorProfile) {
          console.log('\nTranslator Profile:');
          console.log(`  Full Name: ${translatorProfile.full_name}`);
          console.log(`  Phone: ${translatorProfile.phone_number || 'N/A'}`);
          console.log(`  Country: ${translatorProfile.country || 'N/A'}`);
          console.log(`  Languages: ${translatorProfile.languages ? JSON.stringify(translatorProfile.languages) : 'N/A'}`);
          console.log(`  Specializations: ${translatorProfile.specializations ? JSON.stringify(translatorProfile.specializations) : 'N/A'}`);
          console.log(`  Certification: ${translatorProfile.certification || 'N/A'}`);
          console.log(`  Experience: ${translatorProfile.years_of_experience || 0} years`);
          console.log(`  Hourly Rate: $${translatorProfile.hourly_rate || 0}`);
          console.log(`  Rating: ${translatorProfile.rating || 'N/A'}`);
        } else {
          console.log('\nNo translator profile found for this user');
        }
      }
    }

    console.log('\n=== END OF USER LIST ===');

  } catch (error) {
    console.error('Error listing users:', error);
  }
}

// Run the script
listUsers();
