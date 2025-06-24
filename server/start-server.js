// Load environment variables explicitly
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
const envPath = path.resolve(__dirname, '.env');
console.log('Loading environment variables from:', envPath);

if (fs.existsSync(envPath)) {
  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  
  // Set environment variables
  for (const key in envConfig) {
    process.env[key] = envConfig[key];
  }
  
  console.log('Environment variables loaded successfully');
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
  console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY ? 'Loaded (value hidden)' : 'Not loaded');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Loaded (value hidden)' : 'Not loaded');
} else {
  console.error('.env file not found at:', envPath);
}

// Start the server
require('./server.js');
