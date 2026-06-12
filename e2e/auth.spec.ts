import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should successfully login via Demo Mode', async ({ page }) => {
    // Navigate to Login
    await page.goto('/login');
    
    // Click Demo Login
    await page.getByTestId('demo-login-button').click();

    // Should redirect to dashboard immediately
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByTestId('dashboard-loaded')).toBeVisible({ timeout: 15000 });
    
    // Open user menu
    await page.getByTestId('user-account-menu').click();
    
    // Click Exit Demo Mode
    await page.getByTestId('logout-button').click();
    
    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });
});
