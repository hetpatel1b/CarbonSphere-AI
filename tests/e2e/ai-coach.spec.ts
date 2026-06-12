import { test, expect } from '@playwright/test';

test.describe('AI Coach Workspace', () => {
  test('should load the AI Coach workspace', async ({ page }) => {
    // Navigate to the AI coach page
    await page.goto('/ai-coach');
    
    // Check if page loaded correctly
    const title = page.locator('h1', { hasText: 'AI Coach' }).or(page.locator('h2', { hasText: 'Welcome back' }));
    await expect(title).toBeVisible({ timeout: 10000 });

    // Try finding the generate button
    const generateBtn = page.locator('button:has-text("Generate")').first();
    if (await generateBtn.isVisible()) {
      await expect(generateBtn).toBeEnabled();
    }
  });
});
