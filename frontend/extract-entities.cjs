const fs = require('fs');
const path = require('path');

const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql') && f.includes('phase12'));

let entities = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
  // Simple regex to find the VALUES block in our generated SQLs
  // Usually looks like: ('slug', 'Name', ...)
  
  if (file.includes('trails')) {
    const matches = [...content.matchAll(/\('([^']+)',\s*'([^']+)'/g)];
    matches.forEach(m => entities.push({ type: 'trail', slug: m[1], name: m[2] }));
  } else if (file.includes('skiresort')) {
    const matches = [...content.matchAll(/\('([^']+)',\s*'([^']+)'/g)];
    matches.forEach(m => entities.push({ type: 'ski_resort', slug: m[1], name: m[2] }));
  } else if (file.includes('roadtrip')) {
    const matches = [...content.matchAll(/\('([^']+)',\s*'([^']+)'/g)];
    matches.forEach(m => entities.push({ type: 'road_trip', slug: m[1], name: m[2] }));
  } else if (file.includes('aurora')) {
    // Look at loc insert
    const locMatches = [...content.matchAll(/\('([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*([\d.]+),\s*([\d.]+)\)/g)];
    locMatches.forEach(m => entities.push({ type: 'aurora_destination', slug: m[1], name: m[2] }));
  } else if (file.includes('transport')) {
    const matches = [...content.matchAll(/\('([^']+)',\s*'([^']+)'/g)];
    matches.forEach(m => entities.push({ type: 'transport_route', name: m[1] })); // no slug in transport
  } else if (file.includes('ev')) {
    // locs
    const evMatches = [...content.matchAll(/\('([^']+)',\s*'([^']+)',\s*'([^']+)',\s*([\d.]+),\s*([\d.]+)\)/g)];
    evMatches.forEach(m => entities.push({ type: 'ev_charger', slug: m[1], name: m[2] }));
  } else if (file.includes('events')) {
    const matches = [...content.matchAll(/\('([^']+)',\s*'([^']+)'/g)];
    matches.forEach(m => entities.push({ type: 'event', name: m[1] })); // name is first
  } else if (file.includes('deals')) {
    const matches = [...content.matchAll(/\('([^']+)',\s*'([^']+)'/g)];
    matches.forEach(m => entities.push({ type: 'deal', name: m[1] }));
  }
}

fs.writeFileSync('entities.json', JSON.stringify(entities, null, 2), 'utf8');
