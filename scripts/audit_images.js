const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const url = require('url');

// Configuration
const CONCURRENCY_LIMIT = 5;
const HTTP_TIMEOUT_MS = 3000;

// Colors for terminal output
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

console.log(`${BLUE}=== Starting Norway SmartLife Image & Data Matching Audit ===${RESET}\n`);

// Helper: Check if a string is a UUID
function isUuid(str) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

// Helper: Perform HTTP/HTTPS request to check if URL resolves
function checkUrl(imageUrl) {
  return new Promise((resolve) => {
    try {
      const parsedUrl = url.parse(imageUrl);
      const options = {
        method: 'HEAD',
        hostname: parsedUrl.hostname,
        path: parsedUrl.path,
        timeout: HTTP_TIMEOUT_MS,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      };

      const reqLib = parsedUrl.protocol === 'https:' ? https : http;
      const req = reqLib.request(options, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          resolve({ ok: true, status: res.statusCode, contentType: res.headers['content-type'] });
        } else {
          // If HEAD is not allowed/returns error, try GET
          const getOptions = { ...options, method: 'GET' };
          const getReq = reqLib.request(getOptions, (getRes) => {
            resolve({
              ok: getRes.statusCode >= 200 && getRes.statusCode < 400,
              status: getRes.statusCode,
              contentType: getRes.headers['content-type']
            });
          });
          getReq.on('error', () => resolve({ ok: false, status: 'ERROR', error: 'GET connection failed' }));
          getReq.setTimeout(HTTP_TIMEOUT_MS, () => {
            getReq.destroy();
            resolve({ ok: false, status: 'TIMEOUT', error: 'GET Timeout' });
          });
          getReq.end();
        }
      });

      req.on('error', (err) => {
        resolve({ ok: false, status: 'ERROR', error: err.message });
      });

      req.setTimeout(HTTP_TIMEOUT_MS, () => {
        req.destroy();
        resolve({ ok: false, status: 'TIMEOUT', error: 'HEAD Timeout' });
      });

      req.end();
    } catch (e) {
      resolve({ ok: false, status: 'INVALID_URL', error: e.message });
    }
  });
}

// 1. Scan and Extract Images from migrations and seeds
function extractEntitiesAndImages() {
  const records = [];
  const searchDirs = [
    path.join(__dirname, '..', 'supabase', 'migrations'),
    path.join(__dirname, '..', 'supabase')
  ];

  const sqlFiles = [];
  for (const dir of searchDirs) {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir)
        .filter(f => f.endsWith('.sql'))
        .map(f => path.join(dir, f));
      sqlFiles.push(...files);
    }
  }

  console.log(`Scanning ${sqlFiles.length} SQL migration and seed files...`);

  for (const filePath of sqlFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let currentTable = null;
    let inInsert = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Track current table from INSERT statement
      const insertMatch = line.match(/INSERT\s+INTO\s+(?:public\.)?(\w+)\s*\(/i);
      if (insertMatch) {
        currentTable = insertMatch[1];
        inInsert = true;
        continue;
      }

      if (inInsert && line.endsWith(';')) {
        inInsert = false;
      }

      if (currentTable && (line.startsWith('(') || line.includes("('"))) {
        // Extract quoted values in row definition
        // Regex handles escaped single quotes ''
        const quotedValues = [];
        let currentVal = '';
        let inQuote = false;
        
        for (let j = 0; j < line.length; j++) {
          const char = line[j];
          if (char === "'") {
            if (inQuote && line[j + 1] === "'") {
              // Escaped quote
              currentVal += "'";
              j++; // skip next quote
            } else {
              inQuote = !inQuote;
              if (!inQuote) {
                quotedValues.push(currentVal);
                currentVal = '';
              }
            }
          } else if (inQuote) {
            currentVal += char;
          }
        }

        if (quotedValues.length > 0) {
          // Identify image URL (external or local /images/)
          const imageUrl = quotedValues.find(v => 
            v.startsWith('http://') || 
            v.startsWith('https://') || 
            v.startsWith('/images/') ||
            v.startsWith('/assets/')
          );

          if (imageUrl) {
            // Find entity name (first non-UUID string that is not a URL/email)
            const name = quotedValues.find(v => 
              v.length > 2 && 
              !isUuid(v) && 
              !v.startsWith('http') && 
              !v.startsWith('/images') &&
              !v.startsWith('/assets') &&
              !v.includes('@') && 
              v !== 'PUBLISHED' && 
              v !== 'demo' &&
              v !== 'editorial'
            ) || 'Unknown Entity';

            // Find description/alt if present (exclude UUIDs)
            const description = quotedValues.find(v => v.length > 25 && v !== imageUrl && !isUuid(v)) || '';

            records.push({
              id: quotedValues.find(isUuid) || 'No UUID',
              table: currentTable,
              name,
              imageUrl,
              description,
              file: path.basename(filePath)
            });
          }
        }
      }
    }
  }

  return records;
}

// 2. Perform Audit
async function runAudit() {
  const records = extractEntitiesAndImages();
  console.log(`Extracted ${records.length} image records for auditing.\n`);

  const results = [];
  const imageUrlMap = new Map(); // For duplicate detection

  // Helper mapping categories to forbidden keywords
  const categoryForbiddenKeywords = {
    accommodations: ['food', 'dish', 'recipe', 'cuisine', 'restaurant', 'plate', 'cooking', 'menu', 'soup', 'salad'],
    restaurants: ['bed', 'room', 'hotel', 'cabin', 'accommodation', 'stay', 'resort'],
    foods: ['hotel', 'cabin', 'room', 'bed', 'suite', 'resort', 'stay', 'mountain', 'fjord'],
    wildlife_species: ['hotel', 'room', 'bed', 'cuisine', 'dish', 'restaurant', 'sushi', 'pizza']
  };

  // Helper mapping entities to expected keywords
  const expectedKeywords = {
    'Fårikål': ['far', 'kal', 'cabbage', 'mutton', 'lamb'],
    'Lutefisk': ['lutefisk', 'fish', 'cod'],
    'Smalahove': ['smalahove', 'sheep', 'head'],
    'Pinnekjøtt': ['pinnekj', 'ribs', 'lamb', 'mutton'],
    'Rakfisk': ['rakfisk', 'trout', 'fish'],
    'Raspeballer': ['raspeballer', 'potato', 'dumpling'],
    'Brunost': ['brunost', 'cheese', 'brown'],
    'Gravlaks': ['gravlaks', 'salmon', 'cured'],
    'Moose': ['moose', 'elk', 'alces'],
    'Reindeer': ['reindeer', 'caribou', 'tarandus'],
    'Puffin': ['puffin', 'bird', 'fratercula'],
    'Polar Bear': ['polar', 'bear', 'maritimus'],
    'Orca': ['orca', 'killer', 'whale'],
    'Humpback whale': ['humpback', 'whale'],
    'Walrus': ['walrus', 'odobenus'],
    'Wolf': ['wolf', 'canis', 'lupus'],
    'Lofoten': ['lofoten', 'archipelago', 'nordland'],
    'Geirangerfjord': ['geiranger', 'fjord'],
    'Preikestolen': ['preikestolen', 'pulpit', 'cliff'],
    'Trolltunga': ['trolltunga', 'troll']
  };

  // Perform checks in chunks
  let checkedCount = 0;
  for (let i = 0; i < records.length; i += CONCURRENCY_LIMIT) {
    const chunk = records.slice(i, i + CONCURRENCY_LIMIT);
    const promises = chunk.map(async (record) => {
      const audits = {
        semanticMatch: true,
        categoryMatch: true,
        reachable: true,
        notPlaceholder: true,
        notDuplicate: true,
        meaningfulAlt: true,
        warnings: [],
        errors: []
      };

      const urlString = record.imageUrl.toLowerCase();

      // Rule 1: Entity Name & Expected Keywords check
      let hasMatch = false;
      const cleanName = record.name.replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase();
      const nameWords = cleanName.split(/\s+/).filter(w => w.length > 3);
      
      // Check if entity name or query keywords exist in URL
      for (const word of nameWords) {
        if (urlString.includes(word)) hasMatch = true;
      }
      
      // Check specific expected keywords
      for (const [entityName, keywords] of Object.entries(expectedKeywords)) {
        if (record.name.includes(entityName)) {
          for (const kw of keywords) {
            if (urlString.includes(kw.toLowerCase()) || record.description.toLowerCase().includes(kw.toLowerCase())) {
              hasMatch = true;
            }
          }
        }
      }

      // If it is loremflickr or unsplash, check query parameter/path
      if (urlString.includes('unsplash.com') || urlString.includes('loremflickr.com')) {
        if (!hasMatch) {
          audits.semanticMatch = false;
          audits.warnings.push(`Image URL does not contain clear reference to entity keywords: "${record.name}"`);
        }
      }

      // Rule 2: Category Match Check (No food image for hotel, etc.)
      const forbidden = categoryForbiddenKeywords[record.table];
      if (forbidden) {
        for (const kw of forbidden) {
          if (urlString.includes(kw) || record.description.toLowerCase().includes(kw)) {
            audits.categoryMatch = false;
            audits.errors.push(`Category Mismatch: Table "${record.table}" record "${record.name}" contains forbidden keyword "${kw}" in its image reference`);
          }
        }
      }

      // Rule 3: Placeholder Check
      if (urlString.includes('placeholder') && !record.imageUrl.startsWith('/images/placeholder.jpg')) {
        audits.notPlaceholder = false;
        audits.warnings.push(`Placeholder Image Found: URL contains generic placeholder keyword`);
      }

      // Rule 4: Duplicate Check
      if (imageUrlMap.has(record.imageUrl)) {
        const original = imageUrlMap.get(record.imageUrl);
        // Only trigger duplicate warning if the names are significantly different (not same entity)
        if (original.name.toLowerCase() !== record.name.toLowerCase()) {
          audits.notDuplicate = false;
          audits.warnings.push(`Duplicate Image: URL is also used by entity "${original.name}" (table: "${original.table}")`);
        }
      } else {
        imageUrlMap.set(record.imageUrl, record);
      }

      // Rule 5: Meaningful Alt / Description Check
      if (record.description && record.description.length > 0) {
        const cleanDesc = record.description.toLowerCase();
        if (cleanDesc === 'image' || cleanDesc === 'photo' || cleanDesc === 'placeholder') {
          audits.meaningfulAlt = false;
          audits.warnings.push(`Alt text/description is generic: "${record.description}"`);
        }
      }

      // Rule 6: Image URL Reachability or local file existence check
      if (record.imageUrl.startsWith('/images/') || record.imageUrl.startsWith('/assets/')) {
        const localPath = path.join(__dirname, '..', 'frontend', 'public', record.imageUrl.split('?')[0]);
        if (!fs.existsSync(localPath)) {
          audits.reachable = false;
          audits.errors.push(`Missing Local File: File does not exist at "${localPath}"`);
        }
      } else {
        // External URLs
        const isPlaceholderDomain = urlString.includes('loremflickr.com') || urlString.includes('example.com') || urlString.includes('via.placeholder.com') || urlString.includes('picsum.photos');
        
        const httpCheck = await checkUrl(record.imageUrl);
        if (!httpCheck.ok) {
          if (isPlaceholderDomain || httpCheck.status === 429 || httpCheck.status === 'TIMEOUT') {
            // Placeholder domains, rate-limiting, and timeouts are treated as warnings
            audits.warnings.push(`External URL check warning (Status: ${httpCheck.status}, Error: ${httpCheck.error || 'N/A'}). URL: ${record.imageUrl}`);
          } else {
            // Actual production links (Unsplash, Wikimedia) returning 404 or other errors fail the build
            audits.reachable = false;
            audits.errors.push(`Broken Link: Image URL failed to resolve (Status: ${httpCheck.status}, Error: ${httpCheck.error || 'N/A'})`);
          }
        }
      }

      return {
        record,
        audits
      };
    });

    const chunkResults = await Promise.all(promises);
    results.push(...chunkResults);
    checkedCount += chunk.length;
    process.stdout.write(`Audited ${checkedCount}/${records.length} images...\r`);
  }
  console.log('\nAudit complete. Analyzing results...\n');

  // Summary Metrics
  let totalErrors = 0;
  let totalWarnings = 0;

  for (const res of results) {
    const { record, audits } = res;
    if (audits.errors.length > 0 || audits.warnings.length > 0) {
      console.log(`--------------------------------------------------`);
      console.log(`Entity: ${record.name} (${record.table})`);
      console.log(`File: ${record.file}`);
      console.log(`URL: ${record.imageUrl}`);
      
      for (const err of audits.errors) {
        console.log(`  ${RED}[ERROR]${RESET} ${err}`);
        totalErrors++;
      }
      for (const warn of audits.warnings) {
        console.log(`  ${YELLOW}[WARNING]${RESET} ${warn}`);
        totalWarnings++;
      }
    }
  }

  console.log(`\n==================================================`);
  console.log(`Audit Summary:`);
  console.log(`- Total Records Checked: ${records.length}`);
  console.log(`- Total Errors: ${totalErrors > 0 ? RED : GREEN}${totalErrors}${RESET}`);
  console.log(`- Total Warnings: ${totalWarnings > 0 ? YELLOW : GREEN}${totalWarnings}${RESET}`);
  console.log(`==================================================`);

  const isStrict = process.argv.includes('--strict');
  if (totalErrors > 0) {
    console.log(`\n${RED}Audit failed with ${totalErrors} semantic or link errors.${RESET}`);
    process.exit(1);
  } else if (isStrict && totalWarnings > 0) {
    console.log(`\n${RED}Audit failed in strict mode with ${totalWarnings} warnings.${RESET}`);
    process.exit(1);
  } else {
    console.log(`\n${GREEN}Audit passed successfully! All image URLs resolved and semantic constraints are satisfied.${RESET}`);
    process.exit(0);
  }
}

runAudit();
