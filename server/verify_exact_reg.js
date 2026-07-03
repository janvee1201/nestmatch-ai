import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

async function verify() {
  console.log('Connecting to database...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Deleting existing user with email: janvee@test.com...');
  await mongoose.connection.db.collection('users').deleteOne({ email: 'janvee@test.com' });
  await mongoose.disconnect();
  console.log('Sending exact registration request...');

  const res = await fetch('http://localhost:5000/api/v1/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fullName: 'Janvee Sahu',
      email: 'janvee@test.com',
      password: 'Janvee123',
      role: 'TENANT'
    })
  });

  console.log('Response Status:', res.status);
  const data = await res.json();
  console.log('Response Body:', JSON.stringify(data, null, 2));

  if (res.status === 201) {
    console.log('✓ EXACT REGISTRATION VERIFICATION PASSED!');
    process.exit(0);
  } else {
    console.log('❌ EXACT REGISTRATION VERIFICATION FAILED!');
    process.exit(1);
  }
}

verify().catch(console.error);
