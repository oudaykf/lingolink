require('dotenv').config({ path: './server/.env' });
const { createClient } = require('@supabase/supabase-js');

async function checkAllUsers() {
  console.log('Checking all users in the database...');
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    // Get all users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (usersError) {
      console.error('Error fetching users:', usersError);
      return;
    }
    
    console.log(`\nTotal users found: ${users.length}`);
    console.log('\n=== ALL USERS ===');
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user.id}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Type: ${user.user_type}`);
      console.log(`   Created: ${user.created_at}`);
      console.log(`   Updated: ${user.updated_at}`);
      console.log('   ---');
    });
    
    // Check for duplicate emails
    const emailCounts = {};
    users.forEach(user => {
      emailCounts[user.email] = (emailCounts[user.email] || 0) + 1;
    });
    
    const duplicates = Object.entries(emailCounts).filter(([email, count]) => count > 1);
    
    if (duplicates.length > 0) {
      console.log('\n=== DUPLICATE EMAILS FOUND ===');
      duplicates.forEach(([email, count]) => {
        console.log(`Email: ${email} appears ${count} times`);
        const duplicateUsers = users.filter(user => user.email === email);
        duplicateUsers.forEach(user => {
          console.log(`  - ID: ${user.id}, Name: ${user.name}, Created: ${user.created_at}`);
        });
      });
    } else {
      console.log('\n✅ No duplicate emails found');
    }
    
    // Check for test users
    const testUsers = users.filter(user => 
      user.name.toLowerCase().includes('test') || 
      user.name.toLowerCase().includes('debug') ||
      user.email.toLowerCase().includes('test') ||
      user.email.toLowerCase().includes('debug')
    );
    
    if (testUsers.length > 0) {
      console.log('\n=== TEST/DEBUG USERS FOUND ===');
      testUsers.forEach(user => {
        console.log(`- ID: ${user.id}`);
        console.log(`  Name: ${user.name}`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Created: ${user.created_at}`);
        console.log('  ---');
      });
      
      console.log(`\n⚠️  Found ${testUsers.length} test/debug users that might need cleanup`);
    } else {
      console.log('\n✅ No test/debug users found');
    }
    
    // Get all clients
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (clientsError) {
      console.error('Error fetching clients:', clientsError);
    } else {
      console.log(`\n=== ALL CLIENTS ===`);
      console.log(`Total clients found: ${clients.length}`);
      
      clients.forEach((client, index) => {
        console.log(`${index + 1}. ID: ${client.id}`);
        console.log(`   User ID: ${client.user_id}`);
        console.log(`   Full Name: ${client.full_name}`);
        console.log(`   Created: ${client.created_at}`);
        console.log('   ---');
      });
    }
    
    // Get all translators
    const { data: translators, error: translatorsError } = await supabase
      .from('translators')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (translatorsError) {
      console.error('Error fetching translators:', translatorsError);
    } else {
      console.log(`\n=== ALL TRANSLATORS ===`);
      console.log(`Total translators found: ${translators.length}`);
      
      translators.forEach((translator, index) => {
        console.log(`${index + 1}. ID: ${translator.id}`);
        console.log(`   User ID: ${translator.user_id}`);
        console.log(`   Full Name: ${translator.full_name}`);
        console.log(`   Created: ${translator.created_at}`);
        console.log('   ---');
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkAllUsers();