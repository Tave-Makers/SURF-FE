import fs from 'node:fs';
import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const themePath = path.resolve(__dirname, '../raw-data/image.json');
const theme = JSON.parse(fs.readFileSync(themePath, 'utf8'));

const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;

if (!SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_URL) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY and SUPABASE_URL must be set');
  process.exit(1);
}

async function main() {
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/update-theme`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(theme),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`❌ Error: HTTP ${res.status} - ${errorText}`);
      process.exit(1);
    }

    const data = await res.text();
    console.log('✅ Result:', data);
  } catch (error) {
    console.error('❌ Network or fetch error:', error);
    process.exit(1);
  }
}

void main();
