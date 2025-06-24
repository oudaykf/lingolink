// This script can be used to execute the SQL commands in Supabase
// You can run this script manually in the Supabase SQL Editor

const fs = require('fs');
const path = require('path');

// Read the SQL file
const sqlFilePath = path.join(__dirname, 'create_tables.sql');
const sqlCommands = fs.readFileSync(sqlFilePath, 'utf8');

console.log('SQL commands to execute in Supabase SQL Editor:');
console.log('----------------------------------------------');
console.log(sqlCommands);
console.log('----------------------------------------------');
console.log('Copy the above SQL commands and execute them in the Supabase SQL Editor');
console.log('Go to https://tzvoplcsyxfjrsjfvfks.supabase.co/project/sql');
console.log('Paste the commands and click "Run"');
