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
    await expect(page.locator('text=Your sustainability performance is')).toBeVisible();
  });

  test('should navigate to Analytics from sidebar', async ({ page }) => {
    // Navigate using sidebar
    await page.getByTestId('sidebar-nav-analytics').click();
    await expect(page).toHaveURL(/\/analytics/);
    
    // Analytics page should load
    await expect(page.locator('text=Analytics & Intelligence')).toBeVisible({ timeout: 10000 });
  });
  
  test('should navigate to Forecasting from sidebar', async ({ page }) => {
    await page.getByTestId('sidebar-nav-forecasting').click();
    await expect(page).toHaveURL(/\/forecasting/);
    
    // Forecast page should load
    await expect(page.locator('text=Carbon Forecasting').first()).toBeVisible({ timeout: 10000 });
  });
});
