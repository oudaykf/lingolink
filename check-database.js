require('dotenv').config({ path: './server/.env' });
const { createClient } = require('@supabase/supabase-js');

async function checkDatabase() {
  try {
    console.log('Checking database for registered users...');
    
    // Initialize Supabase client directly
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials in .env file');
      return;
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Check users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (usersError) {
      console.error('Error fetching users:', usersError);
    } else {
      console.log('\nRecent users in database:');
      console.log('Total users found:', users.length);
      users.forEach(user => {
        console.log(`- ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Type: ${user.user_type}, Created: ${user.created_at}`);
      });
    }
    
    // Check clients table
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .select('*')
      .order('user_id', { ascending: false })
      .limit(5);
    
    if (clientsError) {
      console.error('Error fetching clients:', clientsError);
    } else {
      console.log('\nRecent clients in database:');
      console.log('Total clients found:', clients.length);
      clients.forEach(client => {
        console.log(`- User ID: ${client.user_id}, Full Name: ${client.full_name}, Company: ${client.company_name}`);
      });
    }
    
    // Check specific user we just created
    const testUserId = '8b973780-a627-4f52-b409-c39390f6577a';
    const { data: specificUser, error: specificError } = await supabase
      .from('users')
      .select('*')
      .eq('id', testUserId)
      .single();
    
    if (specificError) {
      console.error('\nError fetching specific test user:', specificError);
    } else {
      console.log('\nSpecific test user found:');
      console.log(specificUser);
    }
    
    // Check if client profile exists for test user
    const { data: specificClient, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', testUserId)
      .single();
    
    if (clientError) {
      console.error('\nError fetching specific client profile:', clientError);
    } else {
      console.log('\nSpecific client profile found:');
      console.log(specificClient);
    }
    
  } catch (error) {
    console.error('Database check failed:', error);
  }
}

checkDatabase();