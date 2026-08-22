const fs = require('fs');
const file = 'c:/Users/kesha/.gemini/antigravity-ide/scratch/norway-smartlife/supabase/migrations/20260819000023_phase12_media_data.sql';
let sql = fs.readFileSync(file, 'utf8');
// Fix column names
sql = sql.replace(/url, alt_text, caption, attribution, display_order/g, 'media_url, alt_text, credits, sort_order');

// Fix VALUES/SELECT part which currently has 5 string/int values at the end:
// 'url', 'alt_text', 'caption', 'attribution', display_order
// It needs to be: 'url', 'alt_text', 'attribution', display_order
// Wait, the select is:
// SELECT gen_random_uuid(), 'table', id, 'MEDIA_TYPE', 'url', 'alt_text', 'caption', 'attribution', 1
// We need to drop the 7th column ('caption')
// Let's replace the header AND then do a regex to drop the caption string.
sql = sql.replace(/, '([^']*)', '([^']*)', '([^']*)', (\d+)\nFROM/g, (match, alt_text, caption, attribution, display_order) => {
    return `, '${alt_text}', '${attribution}', ${display_order}\nFROM`;
});

fs.writeFileSync(file, sql, 'utf8');
console.log('Fixed SQL file');
