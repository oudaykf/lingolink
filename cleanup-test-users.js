require('dotenv').config({ path: './server/.env' });
const { createClient } = require('@supabase/supabase-js');

async function cleanupTestUsers() {
  console.log('Cleaning up test and debug users...');
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    // Find test/debug users
    const { data: testUsers, error: findError } = await supabase
      .from('users')
      .select('*')
      .or('name.ilike.%test%,name.ilike.%debug%,email.ilike.%test%,email.ilike.%debug%');
    
    if (findError) {
      console.error('Error finding test users:', findError);
      return;
    }
    
    if (testUsers.length === 0) {
      console.log('✅ No test/debug users found to clean up');
      return;
    }
    
    console.log(`Found ${testUsers.length} test/debug users to remove:`);
    testUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - ID: ${user.id}`);
    });
    
    // Ask for confirmation (in a real scenario, you'd want user input)
    console.log('\nProceeding with cleanup...');
    
    for (const user of testUsers) {
      console.log(`\nRemoving user: ${user.name} (${user.email})`);
      
      // Remove from clients table if exists
      if (user.user_type === 'client') {
        const { error: clientError } = await supabase
          .from('clients')
          .delete()
          .eq('user_id', user.id);
        
        if (clientError) {
          console.error(`Error removing client profile for ${user.email}:`, clientError);
        } else {
          console.log(`✅ Removed client profile for ${user.email}`);
        }
      }
      
      // Remove from translators table if exists
      if (user.user_type === 'translator') {
        const { error: translatorError } = await supabase
          .from('translators')
          .delete()
          .eq('user_id', user.id);
        
        if (translatorError) {
          console.error(`Error removing translator profile for ${user.email}:`, translatorError);
        } else {
          console.log(`✅ Removed translator profile for ${user.email}`);
        }
      }
      
      // Remove from users table
      const { error: userError } = await supabase
        .from('users')
        .delete()
        .eq('id', user.id);
      
      if (userError) {
        console.error(`Error removing user ${user.email}:`, userError);
      } else {
        console.log(`✅ Removed user ${user.email}`);
      }
    }
    
    console.log('\n🎉 Cleanup completed!');
    
    // Verify cleanup
    const { data: remainingTestUsers, error: verifyError } = await supabase
      .from('users')
      .select('*')
      .or('name.ilike.%test%,name.ilike.%debug%,email.ilike.%test%,email.ilike.%debug%');
    
    if (verifyError) {
      console.error('Error verifying cleanup:', verifyError);
    } else {
      console.log(`\nVerification: ${remainingTestUsers.length} test/debug users remaining`);
      if (remainingTestUsers.length > 0) {
        remainingTestUsers.forEach(user => {
          console.log(`- ${user.name} (${user.email})`);
        });
      }
    }
    
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}

cleanupTestUsers();