// Simple script to run the client
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting client...');
const clientProcess = spawn('npx', ['react-scripts', 'start'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit',
  env: { ...process.env, PORT: '3000' }
});

clientProcess.on('error', (error) => {
  console.error('Failed to start client:', error);
});

clientProcess.on('close', (code) => {
  console.log(`Client process exited with code ${code}`);
});
