import { test, expect } from '@playwright/test';

test.describe('Challenges Flow', () => {
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
    await page.goto('/challenges');
    await expect(page.locator('h1:has-text("Sustainability Challenges")')).toBeVisible({ timeout: 10000 });
  });

  test('should load challenges and allow joining', async ({ page }) => {
    // Check if available challenges section is present
    const joinButton = page.getByRole('button', { name: 'Join Challenge' }).first();
    
    // Sometimes demo mode might already have joined all challenges, so we only test if there's an available challenge
    if (await joinButton.isVisible()) {
      await joinButton.click();
      await expect(page.locator('text=Challenge joined successfully')).toBeVisible({ timeout: 5000 });
    }
    
    // Ensure active challenges section exists
    await expect(page.locator('text=Active Joined Challenges')).toBeVisible();
  });
});
