import { test, expect } from '@playwright/test';

test.describe('Marketplace Flow', () => {
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
    await page.goto('/offset-marketplace');
    await expect(page.locator('h1:has-text("Carbon Offset Marketplace")')).toBeVisible({ timeout: 10000 });
  });

  test('should load marketplace and purchase an offset', async ({ page }) => {
    // Wait for projects to load and click the first "Select Project" button
    const selectProjectButton = page.getByRole('button', { name: 'Select Project' }).first();
    await expect(selectProjectButton).toBeVisible({ timeout: 10000 });
    await selectProjectButton.click();

    // The modal should open
    await expect(page.locator('text=Fund Project')).toBeVisible();

    // Click confirm purchase
    await page.getByRole('button', { name: 'Confirm Purchase' }).click();

    // Verify success
    await expect(page.locator('text=Purchase Successful!')).toBeVisible({ timeout: 10000 });
  });
});
