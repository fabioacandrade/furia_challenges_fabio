import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from project root
dotenv.config({ path: resolve(__dirname, '../.env') });

export const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
  },
}; 