const { execSync } = require('child_process');

try {
  console.log('👀 Watching content collections...');
  execSync('npx content-collections watch', {
    stdio: 'inherit'
  });
} catch (error) {
  console.error('Error watching content collections:', error.message);
  process.exit(1);
}