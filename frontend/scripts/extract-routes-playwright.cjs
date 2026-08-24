const fs = require('fs');
const path = require('path');

const appTsxPath = path.join(__dirname, '..', 'src', 'App.tsx');
const outputJsonPath = path.join(__dirname, '..', 'routes.json');

const content = fs.readFileSync(appTsxPath, 'utf-8');

// Simple regex to match <Route path="/something" ... />
const routeRegex = /<Route[^>]+path=["']([^"']+)["']/g;

const routes = new Set();
let match;

while ((match = routeRegex.exec(content)) !== null) {
  const routePath = match[1];
  
  // Exclude some dynamic ones like /auth/callback or wildcard routes if necessary
  if (!routePath.includes('*') && !routePath.includes('callback')) {
    routes.add(routePath);
  }
}

// Write to JSON
const routesArray = Array.from(routes);
fs.writeFileSync(outputJsonPath, JSON.stringify(routesArray, null, 2));

console.log(`Extracted ${routesArray.length} routes from App.tsx`);
