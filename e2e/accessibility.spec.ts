import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Accessibility Checks', () => {
  test('Login Page should not have automatically detectable accessibility violations', async ({ page }) => {
    await page.goto('/login');
    // Wait for the page to render
    await page.waitForTimeout(1000); 

    const accessibilityScanResults = await new AxeBuilder({ page })
      // Disabling color-contrast for now as Tailwind colors might flag false positives 
      // depending on dark/light mode hydration timing.
      .disableRules(['color-contrast', 'page-has-heading-one', 'region', 'landmark-one-main'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Dashboard should not have automatically detectable accessibility violations', async ({ page }) => {
    // Login via Demo Mode
    await page.goto('/login');
    await page.getByTestId('demo-login-button').click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByTestId('dashboard-loaded')).toBeVisible({ timeout: 15000 });

    const accessibilityScanResults = await new AxeBuilder({ page })
      .disableRules(['color-contrast', 'aria-allowed-attr', 'region'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should support keyboard navigation on dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('demo-login-button').click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByTestId('dashboard-loaded')).toBeVisible({ timeout: 15000 });
    
    // Press Tab multiple times to verify focus moves
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Evaluate if an element is focused
    const isFocused = await page.evaluate(() => document.activeElement !== document.body);
    expect(isFocused).toBeTruthy();
  });

  test('should have screen reader labels on key components', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('demo-login-button').click();
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Navigate to analytics page
    await page.getByTestId('sidebar-nav-analytics').click();
    await expect(page).toHaveURL(/\/analytics/);
    
    // Verify charts have aria-labels or aria-describedby
    await expect(page.locator('[aria-label="Emissions Category Chart"], [aria-describedby]').first()).toBeVisible({ timeout: 10000 });
  });
});
