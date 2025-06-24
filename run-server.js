// Simple script to run the server
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting server...');
const serverProcess = spawn('node', ['server.js'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit'
});

serverProcess.on('error', (error) => {
  console.error('Failed to start server:', error);
});

serverProcess.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});
