const fs = require('fs');
const path = require('path');
const https = require('https');

const entitiesPath = path.join(__dirname, 'entities.json');
const entities = JSON.parse(fs.readFileSync(entitiesPath, 'utf8'));

// Deduplicate entities by name
const uniqueEntitiesMap = new Map();
for (const e of entities) {
  if (e.name) {
    uniqueEntitiesMap.set(e.name, e);
  }
}
const uniqueEntities = Array.from(uniqueEntitiesMap.values());

console.log(`Processing ${uniqueEntities.length} unique entities...`);

const fallbacks = [
  'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080',
  'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080',
  'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080',
  'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080'
];

async function fetchWikiImage(name) {
  return new Promise((resolve) => {
    const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(name + ' Norway')}&gsrlimit=1&prop=pageimages&format=json&pithumbsize=1000`;
    https.get(url, { headers: { 'User-Agent': 'SmartLifeBot/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.query && parsed.query.pages) {
            const pages = Object.values(parsed.query.pages);
            if (pages.length > 0 && pages[0].thumbnail) {
              resolve(pages[0].thumbnail.source);
              return;
            }
          }
          resolve(null);
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function run() {
  let sql = `-- Phase 12: Content Media Mappings\n\n`;
  let totalMapped = 0;

  for (let i = 0; i < uniqueEntities.length; i++) {
    const entity = uniqueEntities[i];
    let imgUrl = await fetchWikiImage(entity.name);
    let attribution = 'Wikimedia Commons';
    
    if (!imgUrl) {
      imgUrl = fallbacks[i % fallbacks.length];
      attribution = 'Unsplash Fallback';
    } else {
      totalMapped++;
    }

    // Determine the target table and match condition
    let targetTable = '';
    let matchCol = 'name';
    let matchVal = entity.name.replace(/'/g, "''");
    
    if (entity.type === 'trail') targetTable = 'public.trails';
    else if (entity.type === 'ski_resort') targetTable = 'public.ski_resorts';
    else if (entity.type === 'road_trip') targetTable = 'public.road_trips';
    else if (entity.type === 'aurora_destination' || entity.type === 'ev_charger') targetTable = 'public.locations';
    else if (entity.type === 'transport_route') targetTable = 'public.transport_routes';
    else if (entity.type === 'event') targetTable = 'public.events';
    else if (entity.type === 'deal') targetTable = 'public.deals';
    
    if (entity.type === 'aurora_destination' || entity.type === 'ev_charger') {
       matchCol = 'slug';
       matchVal = entity.slug;
    }

    // Insert HERO
    sql += `
INSERT INTO public.content_media (id, entity_type, entity_id, media_type, url, alt_text, caption, attribution, display_order)
SELECT gen_random_uuid(), '${targetTable}', id, 'HERO', '${imgUrl}', '${entity.name.replace(/'/g, "''")} Hero', '${entity.name.replace(/'/g, "''")}', '${attribution}', 1
FROM ${targetTable} WHERE ${matchCol} = '${matchVal}';
`;

    // Insert THUMBNAIL
    sql += `
INSERT INTO public.content_media (id, entity_type, entity_id, media_type, url, alt_text, caption, attribution, display_order)
SELECT gen_random_uuid(), '${targetTable}', id, 'THUMBNAIL', '${imgUrl}', '${entity.name.replace(/'/g, "''")} Thumbnail', '${entity.name.replace(/'/g, "''")}', '${attribution}', 2
FROM ${targetTable} WHERE ${matchCol} = '${matchVal}';
`;

    // Insert GALLERY
    sql += `
INSERT INTO public.content_media (id, entity_type, entity_id, media_type, url, alt_text, caption, attribution, display_order)
SELECT gen_random_uuid(), '${targetTable}', id, 'GALLERY', '${imgUrl}', '${entity.name.replace(/'/g, "''")} Gallery Image', '${entity.name.replace(/'/g, "''")}', '${attribution}', 3
FROM ${targetTable} WHERE ${matchCol} = '${matchVal}';
`;
  }

  const outPath = path.join(__dirname, '..', 'supabase', 'migrations', '20260819000023_phase12_media_data.sql');
  fs.writeFileSync(outPath, sql, 'utf8');
  console.log(`Generated media migration at ${outPath} (${totalMapped} matched via Wikipedia)`);
}

run();
