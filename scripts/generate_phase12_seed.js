const fs = require('fs');
const https = require('https');
const crypto = require('crypto');

function uuid() {
    return crypto.randomUUID();
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const escapeSql = (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/'/g, "''");
};

const fetchImageFromWiki = (query) => {
    return new Promise((resolve) => {
        const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${encodeURIComponent(query)}&pithumbsize=800&format=json`;
        https.get(url, { headers: { 'User-Agent': 'SmartLifeBot/1.0 (test@example.com)' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    const pages = json.query.pages;
                    const pageId = Object.keys(pages)[0];
                    if (pages[pageId].thumbnail && pages[pageId].thumbnail.source) {
                        resolve(pages[pageId].thumbnail.source);
                    } else {
                        resolve(`https://loremflickr.com/800/600/${encodeURIComponent(query)}?lock=${rand(1,1000)}`);
                    }
                } catch(e) {
                    resolve(`https://loremflickr.com/800/600/${encodeURIComponent(query)}?lock=${rand(1,1000)}`);
                }
            });
        }).on('error', () => resolve(`https://loremflickr.com/800/600/norway?lock=${rand(1,1000)}`));
    });
};

const locationSql = fs.readFileSync('supabase/migrations/20260819000012_phase12_location_data.sql', 'utf8');
const locationMatches = [...locationSql.matchAll(/\('([0-9a-fA-F\-]{36})',\s*'([^']+)'/g)];
const locations = locationMatches.map(m => ({ id: m[1], name: m[2] }));

if (locations.length === 0) {
    console.error("Failed to parse locations from migration!");
    process.exit(1);
}

async function generateSeed() {
    let sql = `-- Phase 12 Seed Data\n\n`;

    // 1. Food (30+)
    const foods = [
        "Fårikål", "Kjøttkaker", "Lutefisk", "Smalahove", "Pinnekjøtt", "Rakfisk", "Raspeballer", "Lefse",
        "Brunost", "Krumkake", "Rømmegrøt", "Svele", "Multekrem", "Kransekake", 
        "Gravlaks", "Tørrfisk", "Sild", "Skolebrød", "Kvikk Lunsj", "Fenalår", "Bløtkake", "Vaffel",
        "Sodd", "Fiskesuppe", "Reinsdyrstek", "Tyttebærsyltetøy", "Finnbiff", "Lapskaus", "Gjetost", "Kaviar"
    ];

    sql += `-- Foods\nINSERT INTO foods (id, name, slug, description, image_url, status) VALUES\n`;
    const foodRows = [];
    for (let i = 0; i < foods.length; i++) {
        const f = foods[i];
        const img = await fetchImageFromWiki(f);
        let slug = f.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        let desc = escapeSql(`Traditional Norwegian ${f}, a must-try culinary experience.`);
        foodRows.push(`('${uuid()}', '${escapeSql(f)}', '${slug}', '${desc}', '${img}', 'PUBLISHED')`);
    }
    sql += foodRows.join(',\n') + '\nON CONFLICT (slug) DO NOTHING;\n';

    // 2. Wildlife (35+)
    const wildlife = [
        "Reindeer", "Moose", "Arctic Fox", "Puffin", "Polar Bear", "Walrus", "Svalbard Reindeer", 
        "White-tailed Eagle", "Sea Eagle", "Killer Whale", "Humpback Whale", "Sperm Whale", "Minke Whale",
        "Lynx", "Wolverine", "Brown Bear", "Wolf", "Musk Ox", "Beaver", "Otter", "Lemming", "Ptarmigan",
        "Capercaillie", "Black Grouse", "Golden Eagle", "Gyrfalcon", "Snowy Owl", "Eider Duck", "Guillemot",
        "Kittiwake", "Gannet", "Cormorant", "Harbor Seal", "Grey Seal", "Ringed Seal", "Bearded Seal"
    ];

    sql += `\n-- Wildlife\nINSERT INTO wildlife_species (id, common_name, slug, scientific_name, description, conservation_status, behavior, facts, source_type) VALUES\n`;
    const wildlifeRows = [];
    const mediaRows = [];
    for (let i = 0; i < wildlife.length; i++) {
        const w = wildlife[i];
        const wId = uuid();
        const img = await fetchImageFromWiki(w);
        let slug = w.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        let desc = escapeSql(`The magnificent ${w} found in its natural Norwegian habitat.`);
        wildlifeRows.push(`('${wId}', '${escapeSql(w)}', '${slug}', 'Native Species', '${desc}', 'Least Concern', 'Natural behavior.', ARRAY['Category: Mammals'], 'editorial')`);
        mediaRows.push(`('${uuid()}', 'wildlife_species', '${wId}', 'GALLERY', '${img}', '${escapeSql(w)}', 0)`);
    }
    sql += wildlifeRows.join(',\n') + '\nON CONFLICT (slug) DO NOTHING;\n\n';

    sql += `INSERT INTO content_media (id, entity_type, entity_id, media_type, media_url, alt_text, sort_order) VALUES\n`;
    sql += mediaRows.join(',\n') + '\nON CONFLICT DO NOTHING;\n';

    // 3. Restaurants (50+)
    sql += `\n-- Restaurants\nINSERT INTO restaurants (id, location_id, name, type, description, price_range, rating, image_url, status) VALUES\n`;
    const restRows = [];
    for (let i = 0; i < 50; i++) {
        const loc = randElement(locations);
        const type = randElement(['FINE_DINING', 'CASUAL', 'CAFE', 'STREET_FOOD', 'PUB', 'BAKERY', 'FOOD_EXPERIENCE']);
        const name = `${loc.name} ${type.replace(/_/g, ' ')} House ${i + 1}`;
        const img = await fetchImageFromWiki(`${loc.name} restaurant`);
        let desc = escapeSql(`Experience the best ${type.toLowerCase().replace(/_/g, ' ')} in the heart of ${loc.name}.`);
        restRows.push(`('${uuid()}', '${loc.id}', '${escapeSql(name)}', '${type}', '${desc}', '${rand(2,4)}', ${rand(35,50)/10}, '${img}', 'PUBLISHED')`);
    }
    sql += restRows.join(',\n') + '\nON CONFLICT DO NOTHING;\n';

    // 4. Accommodations (50+)
    sql += `\n-- Accommodations\nINSERT INTO accommodations (id, location_id, name, type, description, price_per_night, rating, image_url, status) VALUES\n`;
    const accommRows = [];
    for (let i = 0; i < 50; i++) {
        const loc = randElement(locations);
        const type = randElement(['HOTEL', 'CABIN', 'LODGE', 'RESORT', 'ECO_STAY', 'UNIQUE_STAY']);
        const name = `${loc.name} Arctic ${type.replace(/_/g, ' ')} ${i + 1}`;
        const img = await fetchImageFromWiki(`${loc.name} hotel`);
        let desc = escapeSql(`A beautiful ${type.toLowerCase().replace(/_/g, ' ')} located in ${loc.name}, offering spectacular views.`);
        accommRows.push(`('${uuid()}', '${loc.id}', '${escapeSql(name)}', '${type}', '${desc}', ${rand(1500,5000)}, ${rand(38,50)/10}, '${img}', 'PUBLISHED')`);
    }
    sql += accommRows.join(',\n') + '\nON CONFLICT DO NOTHING;\n';

    // 5. Activities (100+)
    sql += `\n-- Activities\nINSERT INTO activities (id, location_id, name, type, description, price, difficulty_level, image_url, status) VALUES\n`;
    const actRows = [];
    for (let i = 0; i < 100; i++) {
        const loc = randElement(locations);
        const type = randElement(['HIKING', 'SKIING', 'SIGHTSEEING', 'CULTURE', 'WATER_SPORTS', 'NATURE', 'ADVENTURE', 'WINTER', 'WILDLIFE']);
        const name = `${loc.name} ${type.replace(/_/g, ' ')} Adventure ${i + 1}`;
        const img = await fetchImageFromWiki(`${loc.name} ${type.toLowerCase().replace(/_/g, ' ')}`);
        let desc = escapeSql(`Join our expert guides for an unforgettable ${type.toLowerCase().replace(/_/g, ' ')} experience in ${loc.name}.`);
        actRows.push(`('${uuid()}', '${loc.id}', '${escapeSql(name)}', '${type}', '${desc}', ${rand(500,2500)}, '${randElement(['Easy', 'Moderate', 'Hard'])}', '${img}', 'PUBLISHED')`);
    }
    sql += actRows.join(',\n') + '\nON CONFLICT DO NOTHING;\n';

    // 6. Trails (40+)
    sql += `\n-- Trails\nINSERT INTO trails (id, location_id, name, description, difficulty, distance_km, status) VALUES\n`;
    const trailRows = [];
    for (let i = 0; i < 40; i++) {
        const loc = randElement(locations);
        const name = `${loc.name} Ridge Trail ${i + 1}`;
        let desc = escapeSql(`A scenic hiking route offering breathtaking panoramas of ${loc.name} and surrounding fjords.`);
        trailRows.push(`('${uuid()}', '${loc.id}', '${escapeSql(name)}', '${desc}', '${randElement(['Easy', 'Moderate', 'Hard'])}', ${rand(3,25)}, 'PUBLISHED')`);
    }
    sql += trailRows.join(',\n') + '\nON CONFLICT DO NOTHING;\n';

    fs.writeFileSync('scripts/seed_phase12.sql', sql, 'utf8');
    console.log('Phase 12 seed script written to scripts/seed_phase12.sql');
}

generateSeed();
