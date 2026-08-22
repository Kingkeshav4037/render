import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in frontend/.env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runValidation() {
  console.log("=========================================");
  console.log("   DATA VALIDATION SCRIPT (Norway App)   ");
  console.log("=========================================\n");

  const tables = [
    'locations', 'foods', 'wildlife_species', 'restaurants', 
    'accommodations', 'activities', 'trails', 'ski_resorts', 
    'road_trips', 'aurora_destinations', 'events', 'deals', 'ev_chargers', 'content_media'
  ];

  let totalErrors = 0;
  let totalWarnings = 0;

  for (const table of tables) {
    console.log(`\n--- Validating ${table.toUpperCase()} ---`);
    
    const { data, error, count } = await supabase
      .from(table)
      .select('*', { count: 'exact' });

    if (error) {
      console.error(`❌ Failed to fetch ${table}:`, error.message);
      totalErrors++;
      continue;
    }

    console.log(`✅ Count: ${count} records`);

    if (!data || data.length === 0) continue;

    let missingName = 0;
    let missingSlug = 0;
    let missingDescription = 0;
    let missingImage = 0;
    let invalidCoords = 0;
    const slugs = new Set();
    let duplicateSlugs = 0;
    let missingLocation = 0;

    data.forEach((row: any) => {
      // Check Name (all entities should have some form of name/title except aurora which might just be location-based, but wait, aurora has location_id)
      if ('name' in row && (!row.name || row.name.trim() === '')) missingName++;
      if ('title' in row && (!row.title || row.title.trim() === '')) missingName++;
      
      // Check Slug
      if ('slug' in row) {
        if (!row.slug || row.slug.trim() === '') {
          missingSlug++;
        } else {
          if (slugs.has(row.slug)) duplicateSlugs++;
          slugs.add(row.slug);
        }
      }

      // Check Description
      if ('description' in row && (!row.description || row.description.trim() === '')) missingDescription++;

      // Check Image
      if ('image_url' in row && !row.image_url) missingImage++;
      if ('primary_image' in row && !row.primary_image) missingImage++;
      if ('url' in row && !row.url) missingImage++; // content_media

      // Check location
      if (['restaurants', 'accommodations', 'activities', 'aurora_destinations', 'events'].includes(table)) {
        if (!row.location_id) missingLocation++;
      }

      // Check coordinates
      let lat = null;
      let lng = null;
      if ('latitude' in row) { lat = row.latitude; lng = row.longitude; }
      else if ('lat' in row) { lat = row.lat; lng = row.lng; }

      if (lat !== null && lng !== null) {
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
          invalidCoords++;
        }
      }
    });

    if (missingName > 0) { console.log(`   ⚠️ Missing Name/Title: ${missingName}`); totalWarnings++; }
    if (missingSlug > 0) { console.log(`   ❌ Missing Slug: ${missingSlug}`); totalErrors++; }
    if (duplicateSlugs > 0) { console.log(`   ❌ Duplicate Slugs: ${duplicateSlugs}`); totalErrors++; }
    if (missingDescription > 0) { console.log(`   ⚠️ Missing Description: ${missingDescription}`); totalWarnings++; }
    if (missingImage > 0) { console.log(`   ⚠️ Missing Image URL: ${missingImage}`); totalWarnings++; }
    if (missingLocation > 0) { console.log(`   ❌ Missing Location ID: ${missingLocation}`); totalErrors++; }
    if (invalidCoords > 0) { console.log(`   ❌ Invalid Coordinates: ${invalidCoords}`); totalErrors++; }
  }
  
  // Check Content Relationships for orphans
  console.log(`\n--- Validating CONTENT_RELATIONSHIPS ---`);
  const { data: rels, error: relsErr, count: relsCount } = await supabase
    .from('content_relationships')
    .select('*', { count: 'exact' });
    
  if (relsErr) {
    console.error(`❌ Failed to fetch content_relationships:`, relsErr.message);
    totalErrors++;
  } else {
    console.log(`✅ Count: ${relsCount} records`);
    // Basic orphan check would require fetching all target ids. Too complex for simple script, 
    // but we can flag if any source_id or target_id is null
    let nullRefs = 0;
    rels?.forEach((r: any) => {
      if (!r.source_id || !r.target_id) nullRefs++;
    });
    if (nullRefs > 0) {
      console.log(`   ❌ Null References (Orphans): ${nullRefs}`);
      totalErrors++;
    }
  }

  console.log("\n=========================================");
  if (totalErrors === 0 && totalWarnings === 0) {
    console.log("🎉 ALL DATA IS VALID!");
  } else {
    console.log(`📊 Validation complete with ${totalErrors} Errors and ${totalWarnings} Warnings.`);
  }
  console.log("=========================================\n");
  
  if (totalErrors > 0) process.exit(1);
}

runValidation();
