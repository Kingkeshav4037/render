const fs = require('fs');
const path = require('path');

const cities = [
  'Oslo', 'Bergen', 'Tromsø', 'Trondheim', 'Stavanger', 'Ålesund', 'Kristiansand', 
  'Bodø', 'Drammen', 'Lillehammer', 'Fredrikstad', 'Sandnes', 'Molde', 'Haugesund', 
  'Narvik', 'Alta', 'Kirkenes', 'Svolvær', 'Røros', 'Flåm', 'Geilo', 'Kongsberg', 
  'Hamar', 'Skien', 'Tønsberg', 'Arendal', 'Mosjøen', 'Harstad', 'Hammerfest', 'Longyearbyen', 'Honningsvåg'
];

const fjords = [
  'Geirangerfjord', 'Sognefjord', 'Hardangerfjord', 'Nærøyfjord', 'Lysefjord', 
  'Nordfjord', 'Aurlandsfjord', 'Romsdalsfjord', 'Oslofjord', 'Trondheimsfjord', 
  'Trollfjord', 'Hjørundfjord', 'Porsangerfjord', 'Varangerfjord', 'Boknafjord', 
  'Altafjord', 'Lyngen Fjord', 'Tysfjord', 'Vestfjord', 'Osterfjord'
];

const mountains = [
  { name: 'Trolltunga', type: 'VIEWPOINT' }, { name: 'Preikestolen', type: 'VIEWPOINT' }, { name: 'Kjerag', type: 'MOUNTAIN' },
  { name: 'Galdhøpiggen', type: 'MOUNTAIN' }, { name: 'Glittertind', type: 'MOUNTAIN' }, { name: 'Besseggen', type: 'TRAIL' },
  { name: 'Romsdalseggen', type: 'TRAIL' }, { name: 'Reinebringen', type: 'VIEWPOINT' }, { name: 'Fløyen', type: 'VIEWPOINT' },
  { name: 'Ulriken', type: 'MOUNTAIN' }, { name: 'Gaustatoppen', type: 'MOUNTAIN' }, { name: 'Slogen', type: 'MOUNTAIN' },
  { name: 'Romsdalshorn', type: 'MOUNTAIN' }, { name: 'Trollveggen', type: 'VIEWPOINT' }, { name: 'Skala', type: 'MOUNTAIN' },
  { name: 'Fannaråki', type: 'MOUNTAIN' }, { name: 'Snøhetta', type: 'MOUNTAIN' }, { name: 'Bitihorn', type: 'MOUNTAIN' },
  { name: 'Store Skagastølstind', type: 'MOUNTAIN' }, { name: 'Mount Hoven', type: 'VIEWPOINT' }, { name: 'Stetind', type: 'MOUNTAIN' },
  { name: 'Segla', type: 'MOUNTAIN' }, { name: 'Ryten', type: 'VIEWPOINT' }, { name: 'Festvågtind', type: 'MOUNTAIN' }, { name: 'Munken', type: 'MOUNTAIN' }
];

const parks = [
  'Jotunheimen', 'Rondane', 'Dovrefjell-Sunndalsfjella', 'Hardangervidda', 'Folgefonna',
  'Femundsmarka', 'Saltfjellet-Svartisen', 'Reisa', 'Varangerhalvøya', 'Jostedalsbreen',
  'Forlandet', 'Nordvest-Spitsbergen', 'Sør-Spitsbergen', 'Lofotodden', 'Ytre Hvaler'
];

const others = [
  { name: 'Lofoten Islands', type: 'ISLAND' }, { name: 'Senja', type: 'ISLAND' }, { name: 'Svalbard', type: 'ISLAND' },
  { name: 'Sommarøy', type: 'ISLAND' }, { name: 'Karmøy', type: 'ISLAND' },
  { name: 'Geiranger', type: 'VILLAGE' }, { name: 'Undredal', type: 'VILLAGE' }, { name: 'Reine', type: 'VILLAGE' },
  { name: 'Nusfjord', type: 'VILLAGE' }, { name: 'Henningsvær', type: 'VILLAGE' },
  { name: 'Haukland Beach', type: 'BEACH' }, { name: 'Kvalvika Beach', type: 'BEACH' }, { name: 'Sola Beach', type: 'BEACH' },
  { name: 'Viking Ship Museum', type: 'MUSEUM' }, { name: 'Munch Museum', type: 'MUSEUM' }, { name: 'Fram Museum', type: 'MUSEUM' },
  { name: 'Nidaros Cathedral', type: 'ATTRACTION' }, { name: 'Bryggen', type: 'ATTRACTION' }, { name: 'Vigeland Park', type: 'ATTRACTION' },
  { name: 'Atlantic Ocean Road', type: 'COAST' }, { name: 'Nordkapp', type: 'COAST' }, { name: 'Lindesnes Lighthouse', type: 'COAST' }
];

let sql = `-- Phase 12: Location Data Expansion\n\n`;

function generateId(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash << 5) - hash + str.charCodeAt(i);
  const hex = Math.abs(hash).toString(16).padStart(12, '0');
  return '10c47100-0000-4000-8000-' + hex.substring(0, 12);
}

const allLocations = [];

cities.forEach(name => {
  allLocations.push({
    id: generateId(name + '_city'),
    name: name,
    slug: name.toLowerCase().replace(/æ/g, 'ae').replace(/ø/g, 'o').replace(/å/g, 'a').replace(/ /g, '-'),
    type: 'CITY',
    description: "The vibrant city of " + name + ", rich in Norwegian culture and history.",
    lat: (58 + Math.random() * 12).toFixed(4),
    lng: (5 + Math.random() * 25).toFixed(4)
  });
});

fjords.forEach(name => {
  allLocations.push({
    id: generateId(name + '_fjord'),
    name: name,
    slug: name.toLowerCase().replace(/æ/g, 'ae').replace(/ø/g, 'o').replace(/å/g, 'a').replace(/ /g, '-'),
    type: 'FJORD',
    description: "The majestic " + name + ", one of Norway's iconic glacial valleys.",
    lat: (59 + Math.random() * 10).toFixed(4),
    lng: (5 + Math.random() * 10).toFixed(4)
  });
});

mountains.forEach(item => {
  allLocations.push({
    id: generateId(item.name + '_mountain'),
    name: item.name,
    slug: item.name.toLowerCase().replace(/æ/g, 'ae').replace(/ø/g, 'o').replace(/å/g, 'a').replace(/ /g, '-'),
    type: item.type,
    description: "Stunning views from " + item.name + ", a premier outdoor destination.",
    lat: (58 + Math.random() * 11).toFixed(4),
    lng: (5 + Math.random() * 12).toFixed(4)
  });
});

parks.forEach(name => {
  allLocations.push({
    id: generateId(name + '_park'),
    name: name + ' National Park',
    slug: (name + ' National Park').toLowerCase().replace(/æ/g, 'ae').replace(/ø/g, 'o').replace(/å/g, 'a').replace(/ /g, '-'),
    type: 'NATIONAL_PARK',
    description: "Vast wilderness in " + name + " National Park, home to diverse Norwegian wildlife.",
    lat: (60 + Math.random() * 10).toFixed(4),
    lng: (6 + Math.random() * 15).toFixed(4)
  });
});

others.forEach(item => {
  allLocations.push({
    id: generateId(item.name + '_other'),
    name: item.name,
    slug: item.name.toLowerCase().replace(/æ/g, 'ae').replace(/ø/g, 'o').replace(/å/g, 'a').replace(/ /g, '-'),
    type: item.type,
    description: "Experience the unique beauty and culture of " + item.name + ".",
    lat: (58 + Math.random() * 13).toFixed(4),
    lng: (5 + Math.random() * 20).toFixed(4)
  });
});

// Avoid duplicate IDs (rare but possible in simple hash)
const uniqueLocs = Array.from(new Map(allLocations.map(item => [item.id, item])).values());

for (let i = 0; i < uniqueLocs.length; i += 20) {
  const chunk = uniqueLocs.slice(i, i + 20);
  sql += "INSERT INTO public.locations (id, name, slug, description, type, status, lat, lng)\nVALUES\n";
  const values = chunk.map(loc => {
    return "  ('" + loc.id + "', '" + loc.name.replace(/'/g, "''") + "', '" + loc.slug + "', '" + loc.description.replace(/'/g, "''") + "', '" + loc.type + "', 'PUBLISHED', " + loc.lat + ", " + loc.lng + ")";
  });
  sql += values.join(',\n') + "\nON CONFLICT (slug) DO NOTHING;\n\n";
}

const outPath = path.join(__dirname, '..', 'supabase', 'migrations', '20260819000012_phase12_location_data.sql');
fs.writeFileSync(outPath, sql, 'utf8');
console.log('Migration generated at ' + outPath);
