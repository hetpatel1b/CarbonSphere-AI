import { test, expect } from '@playwright/test';

test.describe('Dashboard Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login via Demo Mode
    await page.goto('/login');
    await page.getByTestId('demo-login-button').click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should load dashboard summary widgets and sidebar', async ({ page }) => {
    // Wait for the dashboard to finish loading its API data
    await expect(page.getByTestId('dashboard-loaded')).toBeVisible({ timeout: 15000 });
    
    // Check if sidebar navigation is visible
    await expect(page.getByTestId('sidebar-nav-dashboard')).toBeVisible();
    await expect(page.getByTestId('sidebar-nav-log-activity')).toBeVisible();
    await expect(page.getByTestId('sidebar-nav-analytics')).toBeVisible();
    
    // Check if hero section is visible
    await expect(page.locator('text=You are tracking')).toBeVisible();
  });

  test('should navigate to Analytics from sidebar', async ({ page }) => {
    // Navigate using sidebar
    await page.getByTestId('sidebar-nav-analytics').click();
    await expect(page).toHaveURL(/\/analytics/);
    
    // Analytics page should load
    await expect(page.locator('text=Intelligence').first()).toBeVisible({ timeout: 10000 });
  });
  
  test('should navigate to Forecasting from sidebar', async ({ page }) => {
    await page.getByTestId('sidebar-nav-forecasting').click();
    await expect(page).toHaveURL(/\/forecasting/);
    
    // Forecast page should load
    await expect(page.locator('text=Carbon Forecasting').first()).toBeVisible({ timeout: 10000 });
  });

  test('should handle empty dashboard state safely', async ({ page }) => {
    // Intercept dashboard API and return empty data
    await page.route('**/dashboard/summary', async route => {
      const json = { data: { summary: null, score: 0 } };
      await route.fulfill({ json });
    });
    
    await page.goto('/dashboard');
    // Ensure page still renders (even if data is empty)
    await expect(page.getByTestId('sidebar-nav-dashboard')).toBeVisible();
  });

  test('should handle dashboard loading state', async ({ page }) => {
    // Intercept and delay response
    await page.route('**/dashboard/summary', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.continue();
    });
    
    await page.goto('/dashboard');
    // We can't always catch the loading spinner perfectly in E2E, but we verify it doesn't crash during delay
    await expect(page.locator('text=You are tracking')).toBeVisible({ timeout: 15000 });
  });

  test('should handle dashboard API error state safely', async ({ page }) => {
    // Intercept and return 500
    await page.route('**/dashboard/summary', async route => {
      await route.fulfill({ status: 500, json: { error: 'Internal Server Error' } });
    });
    
    await page.goto('/dashboard');
    // App should not crash. It might show an error boundary or just empty widgets.
    await expect(page.getByTestId('sidebar-nav-dashboard')).toBeVisible();
  });
});
