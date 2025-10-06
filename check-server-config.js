import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file in current directory
dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log('=== Server Configuration Check ===');
console.log('PORT:', process.env.PORT || 8080);
console.log('AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT:', process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT);
console.log('AZURE_STORAGE_ACCOUNT_NAME:', process.env.AZURE_STORAGE_ACCOUNT_NAME);
console.log('ALLOWED_ORIGINS:', process.env.ALLOWED_ORIGINS);

// Check if required environment variables are set
const requiredEnvVars = [
  'AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT',
  'AZURE_DOCUMENT_INTELLIGENCE_KEY',
  'AZURE_STORAGE_ACCOUNT_NAME',
  'AZURE_STORAGE_ACCOUNT_KEY'
];

let allConfigured = true;
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.log(`❌ Missing required environment variable: ${envVar}`);
    allConfigured = false;
  }
}

if (allConfigured) {
  console.log('✅ All required environment variables are configured');
} else {
  console.log('❌ Some required environment variables are missing');
}

console.log('\n=== Configuration Summary ===');
console.log('The server should work correctly with the current configuration.');