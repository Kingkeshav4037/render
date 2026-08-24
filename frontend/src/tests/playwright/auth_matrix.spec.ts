import { test, expect } from '@playwright/test';

test.describe('Auth Matrix', () => {

  test('Logged out user is redirected to login from protected route', async ({ page }) => {
    // Navigate to admin
    await page.goto('/admin');
    
    // Without mocking the auth state, the app should naturally redirect a logged-out user to /login or /home
    // The exact implementation might be /home if unauthorized, or /login if unauthenticated.
    await page.waitForURL(/.*(\/login|\/home).*/, { timeout: 10000 });
    const url = page.url();
    expect(url.includes('/login') || url.includes('/home') || url.includes('/checkout')).toBeTruthy();
  });

  test('Admin user can access /admin route', async ({ page }) => {
    // Mock the Supabase Auth session in the browser context via route.fulfill
    await page.route('**/auth/v1/user', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'admin-123',
          email: 'admin@norway.no',
          app_metadata: {},
          user_metadata: { role: 'SUPER_ADMIN' },
          aud: 'authenticated',
          created_at: new Date().toISOString()
        })
      });
    });

    // We also need to mock the profile fetch
    await page.route('**/rest/v1/profiles*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{
          id: 'admin-123',
          role: 'SUPER_ADMIN',
          full_name: 'System Admin'
        }])
      });
    });

    // Sometimes we need to inject a token into localStorage to trick the frontend auth store
    await page.addInitScript(() => {
      window.localStorage.setItem('sb-supabase-project-auth-token', JSON.stringify({
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        user: { id: 'admin-123', email: 'admin@norway.no', role: 'authenticated' },
        expires_at: Math.floor(Date.now() / 1000) + 3600
      }));
    });

    await page.goto('/admin', { waitUntil: 'domcontentloaded' });
    // Should not redirect
    expect(page.url().includes('/admin')).toBeTruthy();
  });

});
