const fs = require('fs');
const path = require('path');

const migrationsDir = path.join(__dirname, 'supabase', 'migrations');
const files = fs.readdirSync(migrationsDir)
  .filter(f => f.endsWith('.sql'))
  .sort();

let combined = '';

for (const file of files) {
  const content = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
  
  // To avoid duplicate table errors when running as a single transaction in Supabase SQL editor:
  let modifiedContent = content;
  
  if (file.includes('phase_f_intelligence_schema')) {
    modifiedContent = `
DROP TABLE IF EXISTS public.weather_observations CASCADE;
DROP TABLE IF EXISTS public.aurora_forecasts CASCADE;
DROP TABLE IF EXISTS public.environmental_observations CASCADE;

` + modifiedContent;
  }
  
  if (file.includes('phase_g_trip_planner')) {
    // No drops needed here, phase_g doesn't recreate trips
  }
  
  combined += `-- =========================================\n`;
  combined += `-- File: ${file}\n`;
  combined += `-- =========================================\n\n`;
  combined += modifiedContent + '\n\n';
}

fs.writeFileSync(path.join(__dirname, 'final_schema.sql'), combined, 'utf8');
console.log('Created final_schema.sql successfully!');
