import fs from 'node:fs';
import 'dotenv/config';

const theme = JSON.parse(fs.readFileSync('./raw-data/image.json', 'utf8'));

const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;

async function main() {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/update-theme`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(theme, null, 2),
  });

  const data = await res.text();
  console.log('✅ Result:', data);
}

void main();
