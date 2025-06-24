/**
 * Script to output SQL statements for creating tables
 */

const fs = require('fs');
const path = require('path');

// Read the SQL file
const sqlFilePath = path.join(__dirname, 'create-tables.sql');
const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

// Output the SQL content
console.log('=== SQL STATEMENTS TO CREATE TABLES ===');
console.log('Copy and paste the following SQL statements into the Supabase SQL Editor:');
console.log('\n' + sqlContent);
console.log('=== END OF SQL STATEMENTS ===');

// Output instructions
console.log('\nInstructions:');
console.log('1. Log in to the Supabase dashboard at https://tzvoplcsyxfjrsjfvfks.supabase.co');
console.log('2. Navigate to the SQL Editor');
console.log('3. Copy and paste the SQL statements above');
console.log('4. Click "Run" to execute the statements');
console.log('5. After executing the SQL statements, run the following command to create test data:');
console.log('   node scripts/create-test-data.js');
