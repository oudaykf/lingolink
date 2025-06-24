require('dotenv').config();
const { supabase, testConnection } = require('../config/supabase');

const runTest = async () => {
  try {
    console.log('='.repeat(50));
    console.log('Supabase Connection Test');
    console.log('='.repeat(50));
    console.log(`Supabase URL: ${process.env.SUPABASE_URL}`);
    console.log(`Supabase Key: ${process.env.SUPABASE_KEY ? '***' + process.env.SUPABASE_KEY.slice(-4) : 'Not provided'}`);
    
    const success = await testConnection();
    
    if (success) {
      console.log('\nConnection test successful!');
      
      // List all tables
      console.log('\nAttempting to list tables...');
      const { data: tables, error: tablesError } = await supabase.rpc('get_tables');
      
      if (tablesError) {
        console.error('Error listing tables:', tablesError.message);
      } else if (tables && tables.length > 0) {
        console.log('\nAvailable tables:');
        tables.forEach(table => {
          console.log(`- ${table.name}`);
        });
      } else {
        console.log('No tables found or insufficient permissions to list tables.');
      }
    } else {
      console.log('\nConnection test failed!');
      console.log('\nPossible issues:');
      console.log('1. Invalid Supabase URL or API key');
      console.log('2. Network connectivity issues');
      console.log('3. Supabase service is down');
      console.log('4. The "health_check" table does not exist');
    }
  } catch (error) {
    console.error('\nUnexpected error during test:', error.message);
  }
};

runTest()
  .then(() => {
    console.log('\nTest completed.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
