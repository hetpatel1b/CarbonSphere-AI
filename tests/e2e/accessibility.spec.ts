import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Audits (WCAG 2.1 AA)', () => {
  test('login page should have no accessibility violations', async ({ page }) => {
    await page.goto('/login');
    
    // Wait for the login form to be loaded
    await expect(page.getByRole('heading', { name: /Welcome back/i })).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('register page should have no accessibility violations', async ({ page }) => {
    await page.goto('/register');
    
    // Wait for the register form to be loaded
    await expect(page.getByRole('heading', { name: /Create an account/i })).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
