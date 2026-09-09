import fs from 'node:fs';
import path from 'node:path';

const BRAIN_DIR = 'C:/Users/kesha/.gemini/antigravity-ide/brain/1eed0324-6e5f-4556-9f19-a400e3f06e6e';

// 1. Copy the 13 generated AI dish images
const GENERATED_MAPPING = {
  'dish_farikal.jpg': 'dish_farikal_1788977400531.jpg',
  'dish_kjottkaker.jpg': 'dish_kjottkaker_1788977425450.jpg',
  'dish_pinnekjott.jpg': 'dish_pinnekjott_1788977458773.jpg',
  'dish_ribbe.jpg': 'dish_ribbe_1788977485614.jpg',
  'dish_lutefisk.jpg': 'dish_lutefisk_1788977531970.jpg',
  'dish_raspeballer.jpg': 'dish_raspeballer_1788977743039.jpg',
  'dish_lapskaus.jpg': 'dish_lapskaus_1788977769617.jpg',
  'dish_rakfisk.jpg': 'dish_rakfisk_1788977801833.jpg',
  'dish_gravlaks.jpg': 'dish_gravlaks_1788977831645.jpg',
  'dish_brunost.jpg': 'dish_brunost_1788977863431.jpg',
  'dish_rommegrot.jpg': 'dish_rommegrot_1788977898719.jpg',
  'dish_lefse.jpg': 'dish_lefse_1788977944641.jpg',
  'dish_svele.jpg': 'dish_svele_1788978366180.jpg',
};

for (const [targetName, sourceFile] of Object.entries(GENERATED_MAPPING)) {
  const sourcePath = path.join(BRAIN_DIR, sourceFile);
  if (fs.existsSync(sourcePath)) {
    const data = fs.readFileSync(sourcePath);
    fs.writeFileSync(path.join('images', targetName), data);
    fs.writeFileSync(path.join('frontend', 'public', 'images', targetName), data);
    console.log(`[COPIED] ${targetName} (${data.length} bytes)`);
  } else {
    console.warn(`[MISSING SOURCE] ${sourcePath}`);
  }
}

// 2. Download remaining dishes from verified Wikimedia Commons endpoints
const COMMONS_DISHES = [
  {
    target: 'dish_skolebrod.jpg',
    wikiTitle: 'School bread',
  },
  {
    target: 'dish_sodd.jpg',
    wikiTitle: 'Sodd',
  },
  {
    target: 'dish_fiskesuppe.jpg',
    directUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Fish_soup_in_Bergen.jpg',
  },
  {
    target: 'dish_finnbiff.jpg',
    wikiTitle: 'Sautéed reindeer',
  },
  {
    target: 'dish_fenalar.jpg',
    wikiTitle: 'Fenalår',
  },
  {
    target: 'dish_kongekrabbe.jpg',
    wikiTitle: 'Red king crab',
  },
  {
    target: 'dish_blotkake.jpg',
    wikiTitle: 'Bløtkake',
  },
  {
    target: 'dish_kvikklunsj.jpg',
    wikiTitle: 'Kvikk Lunsj',
  },
  {
    target: 'dish_sild.jpg',
    wikiTitle: 'Pickled herring',
  },
  {
    target: 'dish_torrfisk.jpg',
    wikiTitle: 'Stockfish',
  },
  {
    target: 'dish_krumkake.jpg',
    wikiTitle: 'Krumkake',
  },
  {
    target: 'dish_multekrem.jpg',
    directUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Moltekrem.jpg',
  }
];

async function downloadDish(item) {
  let url = item.directUrl;
  if (!url && item.wikiTitle) {
    const apiRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(item.wikiTitle)}&redirects=1&prop=pageimages&format=json&pithumbsize=1280`,
      { headers: { 'User-Agent': 'NorwaySmartLife/1.0 (dev@norwaysmartlife.com)' } }
    );
    const d = await apiRes.json();
    const pages = d.query.pages;
    const page = pages[Object.keys(pages)[0]];
    url = page?.thumbnail?.source;
  }

  if (!url) {
    console.error(`[NO URL] Failed to resolve URL for ${item.target}`);
    return;
  }

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'NorwaySmartLife/1.0 (dev@norwaysmartlife.com)' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(path.join('images', item.target), buffer);
    fs.writeFileSync(path.join('frontend', 'public', 'images', item.target), buffer);
    console.log(`[DOWNLOADED] ${item.target} (${buffer.length} bytes) from ${url}`);
  } catch (err) {
    console.error(`[ERROR] Failed to download ${item.target}:`, err.message);
  }
}

async function main() {
  for (const item of COMMONS_DISHES) {
    await downloadDish(item);
  }
  console.log('All Norwegian dishes downloaded and synced successfully!');
}

main();
