console.log('Testing Content Collections generation...');

async function test() {
  try {
    // Try to import the built content
    const content = await import('./.content-collections/index.js');
    console.log('✅ Content Collections generated successfully!');
    console.log('Available exports:', Object.keys(content));
  } catch (error) {
    console.error('❌ Content Collections not generated:', error.message);
    console.log('Trying to build manually...');
    
    // Try to build manually
    const { build } = await import('@content-collections/core');
    await build();
    console.log('✅ Manual build completed!');
  }
}

test();