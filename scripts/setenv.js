require('dotenv').config();
const fs = require('fs');
const targetPath = './src/environments/environment.ts';

// We provide fallback to "YOUR_..." so local builds don't break if .env isn't loaded by Node. 
// However, ideally locally you use dotenv or just leave environment.development.ts.
const envConfigFile = `export const environment = {
  production: true,
  firebase: {
    apiKey: "${process.env.FIREBASE_API_KEY || 'YOUR_API_KEY'}",
    authDomain: "${process.env.FIREBASE_AUTH_DOMAIN || 'YOUR_AUTH_DOMAIN'}",
    projectId: "${process.env.FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID'}",
    storageBucket: "${process.env.FIREBASE_STORAGE_BUCKET || 'YOUR_STORAGE_BUCKET'}",
    messagingSenderId: "${process.env.FIREBASE_MESSAGING_SENDER_ID || 'YOUR_MESSAGING_SENDER_ID'}",
    appId: "${process.env.FIREBASE_APP_ID || 'YOUR_APP_ID'}",
    measurementId: "${process.env.FIREBASE_MEASUREMENT_ID || 'YOUR_MEASUREMENT_ID'}"
  }
};
`;

fs.writeFileSync(targetPath, envConfigFile);
console.log(`Environment variables written to ${targetPath}`);
