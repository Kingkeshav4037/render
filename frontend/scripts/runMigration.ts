import fs from 'fs';
import path from 'path';
import postgres from 'postgres';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const sqlString = fs.readFileSync(path.join(__dirname, '../../supabase/migrations/20260819000028_phase16_cleanup_and_activities.sql'), 'utf-8');
  
  // Connect to local supabase DB
  const sql = postgres('postgresql://postgres:postgres@127.0.0.1:54322/postgres');
  
  console.log('Running migration...');
  try {
    await sql.unsafe(sqlString);
    console.log('Migration applied successfully!');
  } catch (error) {
    console.error('Error applying migration:', error);
  } finally {
    await sql.end();
  }
}

main();
