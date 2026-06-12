import { test, expect } from '@playwright/test';

test.describe('Simulator Flow', () => {
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
    await page.goto('/simulator');
    await expect(page.locator('h1:has-text("Sustainability Simulator")')).toBeVisible({ timeout: 10000 });
  });

  test('should run a simulation successfully', async ({ page }) => {
    // Select "Public Transit" scenario
    await page.locator('text=Public Transit').click();

    // Click Run Simulation
    await page.getByRole('button', { name: /Run Simulation/i }).click();

    // Wait for results
    await expect(page.locator('text=Simulation Results').first()).toBeVisible({ timeout: 15000 });
    
    // Verify AI insights loaded
    await expect(page.locator('text=Groq AI Coach Assessment').first()).toBeVisible();
    
    // Verify chart is visible
    await expect(page.getByRole('img', { name: 'Simulation Comparison Chart' })).toBeVisible();
  });
});
