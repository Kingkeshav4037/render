const fs = require('fs');
const file = 'c:/Users/kesha/.gemini/antigravity-ide/scratch/norway-smartlife/supabase/migrations/20260819000023_phase12_media_data.sql';
let sql = fs.readFileSync(file, 'utf8');

// Fix the ambiguous "id" and FROM clause for ski_resorts
const regex = /SELECT gen_random_uuid\(\),\s*'public\.ski_resorts',\s*id,\s*([\s\S]*?)FROM public\.ski_resorts WHERE name = '([^']+)'/g;

sql = sql.replace(regex, (match, selectRest, name) => {
    return `SELECT gen_random_uuid(), 'ski_resorts', s.id, ${selectRest}FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = '${name}'`;
});

// Also fix public. prefixes for other entity types just to be clean
sql = sql.replace(/'public\.road_trips'/g, "'road_trips'");
sql = sql.replace(/'public\.locations'/g, "'locations'");
sql = sql.replace(/'public\.transport_routes'/g, "'transport_routes'");
sql = sql.replace(/'public\.events'/g, "'events'");
sql = sql.replace(/'public\.deals'/g, "'deals'");
sql = sql.replace(/'public\.trails'/g, "'trails'");

fs.writeFileSync(file, sql, 'utf8');
console.log('Fixed ski_resorts FROM clause and entity_type prefixes using /s flag equivalent.');
