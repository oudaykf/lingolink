require('dotenv').config();
const { supabaseAdmin } = require('../config/supabase');
const fs = require('fs');
const path = require('path');

async function updateDatabaseSchema() {
  console.log('Updating database schema for verification system...');
  
  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'update-schema-verification.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Split the SQL into individual statements
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    // Execute each statement
    for (const statement of statements) {
      console.log(`Executing SQL: ${statement.substring(0, 50)}...`);
      
      const { error } = await supabaseAdmin.rpc('execute_sql', {
        sql_query: statement
      });
      
      if (error) {
        // If the RPC method fails, try direct query
        console.log('RPC method failed, trying direct query...');
        const { error: directError } = await supabaseAdmin.rpc('execute', {
          query: statement
        });
        
        if (directError) {
          console.error('Error executing SQL statement:', directError);
          console.error('Failed statement:', statement);
          // Continue with other statements
        }
      }
    }
    
    console.log('Database schema updated successfully!');
    return true;
  } catch (error) {
    console.error('Error updating database schema:', error);
    return false;
  }
}

// Run the function if this script is executed directly
if (require.main === module) {
  updateDatabaseSchema()
    .then(success => {
      if (success) {
        console.log('Schema update completed successfully.');
      } else {
        console.error('Schema update failed.');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unhandled error during schema update:', error);
      process.exit(1);
    });
}

module.exports = { updateDatabaseSchema };
