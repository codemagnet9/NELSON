const { spawn } = require('child_process');

console.log('🚀 Building content collections...');

const buildProcess = spawn('npx', ['content-collections', 'build'], {
  stdio: 'inherit',
  shell: true
});

buildProcess.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Content collections built successfully!');
  } else {
    console.error(`❌ Content collections build failed with code ${code}`);
    process.exit(code);
  }
});