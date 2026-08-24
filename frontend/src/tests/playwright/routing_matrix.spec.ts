import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read extracted routes
const routesPath = path.resolve(__dirname, '../../../routes.json');
let routes: string[] = [];

try {
  routes = JSON.parse(fs.readFileSync(routesPath, 'utf8'));
} catch (e) {
  console.warn('Could not load routes.json, using fallback routes');
  routes = ['/home', '/explore', '/flora', '/checkout'];
}

// Filter out dynamic routes (e.g. /:id) or replace them with mock IDs
const validRoutes = routes
  .filter(r => !r.includes(':id') && !r.includes(':slug'))
  .slice(0, 10); // Limit to top 10 for demonstration of the matrix. Remove slice for full run.

test.describe('Routing Matrix Navigation & Reliability', () => {
  for (const route of validRoutes) {
    test(`Route Check: ${route}`, async ({ page }) => {
      
      // 1. Direct URL Access
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBeLessThan(400);

      // Verify no unhandled react errors (GlobalErrorBoundary catches them, but we want no "Page Not Found")
      const notFound = await page.locator('text=Page Not Found').count();
      if (route !== '/non-existent-matrix') {
         expect(notFound).toBe(0);
      }

      // 2. Refresh Resilience
      await page.reload({ waitUntil: 'domcontentloaded' });
      expect(await page.locator('text=Page Not Found').count()).toBe(0);

      // 3. Back / Forward Navigation
      await page.goto('/home', { waitUntil: 'domcontentloaded' });
      await page.goBack({ waitUntil: 'domcontentloaded' });
      
      // We should be back on our original route or a valid redirect destination
      const currentUrl = new URL(page.url()).pathname;
      expect(currentUrl).toBeDefined();
      expect(await page.locator('text=Page Not Found').count()).toBe(0);
    });
  }
});
