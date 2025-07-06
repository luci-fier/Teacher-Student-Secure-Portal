const fs = require('fs');
const path = require('path');

// Function to test encryption
async function testEncryption() {
  const testFile = 'test.txt';
  const testContent = 'This is a test file to verify encryption';
  
  // Write test file
  fs.writeFileSync(testFile, testContent);
  
  // Create form data
  const formData = new FormData();
  formData.append('file', fs.createReadStream(testFile));
  
  // Upload file
  console.log('Uploading file...');
  const uploadResponse = await fetch('http://localhost:3000/api/upload', {
    method: 'POST',
    body: formData
  });
  
  const uploadResult = await uploadResponse.json();
  console.log('Upload result:', uploadResult);
  
  // Check encrypted file
  const encryptedPath = path.join('uploads', uploadResult.filename);
  const encryptedContent = fs.readFileSync(encryptedPath);
  
  console.log('\nComparison:');
  console.log('Original content:', testContent);
  console.log('Encrypted content (hex):', encryptedContent.toString('hex').substring(0, 50) + '...');
  
  // Clean up
  fs.unlinkSync(testFile);
}

testEncryption().catch(console.error); 