require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log(`MongoDB URI: ${process.env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('='.repeat(50));
    console.log('MongoDB Connection Test: SUCCESS');
    console.log('='.repeat(50));
    console.log(`Connected to: ${conn.connection.host}`);
    console.log(`Database name: ${conn.connection.name}`);
    
    // List all collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('\nAvailable collections:');
    if (collections.length === 0) {
      console.log('No collections found. Database is empty.');
    } else {
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
    }
    
    // Close the connection
    await mongoose.connection.close();
    console.log('\nConnection closed successfully.');
    
    return true;
  } catch (error) {
    console.log('='.repeat(50));
    console.log('MongoDB Connection Test: FAILED');
    console.log('='.repeat(50));
    console.error(`Error: ${error.message}`);
    
    if (error.name === 'MongoServerSelectionError') {
      console.log('\nPossible causes:');
      console.log('1. MongoDB server is not running');
      console.log('2. Network connectivity issues');
      console.log('3. Incorrect connection string');
      console.log('4. IP address not whitelisted in MongoDB Atlas');
    }
    
    return false;
  }
};

// Run the test
testConnection()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });
