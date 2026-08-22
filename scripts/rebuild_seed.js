const fs = require('fs');

const seedPath = 'supabase/seed.sql';
const phase12Path = 'scripts/seed_phase12.sql';

let seedContent = fs.readFileSync(seedPath, 'utf8');
const splitIndex = seedContent.indexOf('-- Phase 12 Seed Data');

if (splitIndex !== -1) {
    seedContent = seedContent.substring(0, splitIndex);
}

let phase12Content = fs.readFileSync(phase12Path, 'utf8');
const deleteStatements = `
-- Phase 12 Seed Data
DELETE FROM content_media WHERE entity_type = 'wildlife_species';
DELETE FROM foods WHERE true;
DELETE FROM wildlife_species WHERE true;
DELETE FROM restaurants WHERE true;
DELETE FROM accommodations WHERE true;
DELETE FROM activities WHERE true;
DELETE FROM trails WHERE true;
`;

// replace `-- Phase 12 Seed Data` with the delete statements in the phase 12 content
phase12Content = phase12Content.replace('-- Phase 12 Seed Data', deleteStatements);

fs.writeFileSync(seedPath, seedContent + phase12Content, 'utf8');
console.log('Successfully merged seed_phase12.sql with DELETE statements into supabase/seed.sql');
