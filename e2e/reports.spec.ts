import { test, expect } from '@playwright/test';

test.describe('Reports Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Unique user per test to prevent data collision
    const testId = Date.now() + Math.random();
    await page.goto('/login');
    await page.evaluate((id) => {
      localStorage.setItem('demoMode', 'true');
      localStorage.setItem('user', JSON.stringify({
        _id: `test-user-${id}`,
        name: 'Test User',
        email: `test${id}@example.com`
      }));
    }, testId);
    await page.goto('/reports');
    await expect(page.locator('h1:has-text("Impact Reporting")')).toBeVisible({ timeout: 10000 });
  });

  test('should generate a new monthly report', async ({ page }) => {
    // Click Generate Monthly
    await page.getByRole('button', { name: /Generate Monthly/i }).click();

    // The active report view should appear
    await expect(page.locator('h1:has-text("Sustainability Impact Report")')).toBeVisible({ timeout: 15000 });
    
    // Verify AI sections are loaded
    await expect(page.locator('text=Executive Summary')).toBeVisible();
    await expect(page.locator('text=Emissions Analysis')).toBeVisible();

    // Close the viewer
    await page.getByRole('button', { name: 'Close Viewer' }).click();

    // The new report should now be in the history vault
    await expect(page.locator('h2:has-text("Report History Vault")')).toBeVisible();
    await expect(page.locator('text=Sustainability Report').first()).toBeVisible();
  });
});
