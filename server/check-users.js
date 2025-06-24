// Check for duplicate users and clean up
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Use service role key to bypass RLS
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkUsers() {
  console.log('Checking users in database...');

  try {
    // Get all users
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching users:', error);
      return;
    }

    console.log(`Found ${users.length} users:`);
    
    // Group users by email to find duplicates
    const usersByEmail = {};
    users.forEach(user => {
      if (!usersByEmail[user.email]) {
        usersByEmail[user.email] = [];
      }
      usersByEmail[user.email].push(user);
    });

    // Check for duplicates
    let duplicatesFound = false;
    for (const [email, userList] of Object.entries(usersByEmail)) {
      if (userList.length > 1) {
        console.log(`\n⚠️  Duplicate users found for ${email}:`);
        userList.forEach((user, index) => {
          console.log(`  ${index + 1}. ID: ${user.id}, Name: ${user.name}, Created: ${user.created_at}`);
        });
        duplicatesFound = true;

        // Keep the first user, delete the rest
        const keepUser = userList[0];
        const deleteUsers = userList.slice(1);
        
        console.log(`  Keeping user: ${keepUser.id} (${keepUser.name})`);
        
        for (const deleteUser of deleteUsers) {
          console.log(`  Deleting duplicate: ${deleteUser.id}`);
          
          // Delete from related tables first
          await supabase.from('clients').delete().eq('user_id', deleteUser.id);
          await supabase.from('translators').delete().eq('user_id', deleteUser.id);
          
          // Delete the user
          const { error: deleteError } = await supabase
            .from('users')
            .delete()
            .eq('id', deleteUser.id);
          
          if (deleteError) {
            console.error(`    Error deleting user ${deleteUser.id}:`, deleteError);
          } else {
            console.log(`    ✅ Deleted user ${deleteUser.id}`);
          }
        }
      } else {
        console.log(`✅ ${email}: ${userList[0].name} (${userList[0].user_type})`);
      }
    }

    if (!duplicatesFound) {
      console.log('\n✅ No duplicate users found');
    } else {
      console.log('\n🧹 Duplicate cleanup completed');
    }

    // Test a specific user lookup
    console.log('\nTesting user lookup for translator@test.com...');
    const { data: testUser, error: testError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'translator@test.com')
      .single();

    if (testError) {
      console.error('Error looking up test user:', testError);
    } else {
      console.log('✅ Test user found:', testUser.name, testUser.id);
    }

  } catch (error) {
    console.error('Error checking users:', error);
  }
}

// Run the check if this file is executed directly
if (require.main === module) {
  checkUsers().then(() => {
    console.log('User check complete');
    process.exit(0);
  }).catch(error => {
    console.error('User check failed:', error);
    process.exit(1);
  });
}

module.exports = { checkUsers };
