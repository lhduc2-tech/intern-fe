const fs = require('fs');
const dotenv = require('dotenv');

// Load .env file
dotenv.config();

const targetPath = './src/app/environments/environment.ts';
const prodTargetPath = './src/app/environments/environment.prod.ts';
const baseUrl = process.env.BASE_API_URL || 'http://localhost:8080/api';

const devEnvConfigFile = `export const environment = {
  production: false,
  apiUrl: '${baseUrl}/public/api/v1'
};
`;

const prodEnvConfigFile = `export const environment = {
  production: true,
  apiUrl: '${baseUrl}/public/api/v1'
};
`;

fs.writeFileSync(targetPath, devEnvConfigFile);
console.log(`Updated environment.ts with apiUrl: ${baseUrl}/public/api/v1`);

fs.writeFileSync(prodTargetPath, prodEnvConfigFile);
console.log(`Updated environment.prod.ts with apiUrl: ${baseUrl}/public/api/v1`);

