const https = require('https');
const queries = [
  'offshore wind turbine', 'server room data center', 'modern sustainable architecture',
  'arctic snow mountain', 'smart city grid', 'electric ferry ship',
  'industrial facility factory', 'geothermal pipes', 'wind farm onshore',
  'modern office building exterior', 'steel mill factory', 'hydroelectric dam',
  'semi truck logistics', 'smart city night', 'aquaculture fish farm'
];

async function getUnsplashId(query) {
  return new Promise((resolve) => {
    const url = 'https://unsplash.com/s/photos/' + encodeURIComponent(query);
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const match = data.match(/images\.unsplash\.com\/photo-([a-zA-Z0-9\-]+)\?/);
        if (match && match[1]) {
          resolve(match[1]);
        } else {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

(async () => {
  for (let i = 0; i < queries.length; i++) {
    const id = await getUnsplashId(queries[i]);
    console.log((i+1) + ': https://images.unsplash.com/photo-' + (id || 'NOT_FOUND') + '?w=800&q=80');
  }
})();
