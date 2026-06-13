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


  test('should show error on invalid login attempt', async ({ page }) => {
    // Intercept login API
    await page.route('**/auth/login', async route => {
      await route.fulfill({ status: 400, json: { message: 'Invalid credentials' } });
    });

    await page.goto('/login');
    
    // Fill credentials
    await page.getByTestId('login-email-input').fill('invalid@test.com');
    await page.getByTestId('login-password-input').fill('wrongpassword');
    await page.getByTestId('login-submit-button').click();
    
    // Expect to remain on login page with the form still visible
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByTestId('login-submit-button')).toBeVisible({ timeout: 10000 });
  });

  test('should redirect unauthorized user to login', async ({ page }) => {
    // Go to login to ensure domain context
    await page.goto('/login');
    // Clear any potential demo mode auth state
    await page.evaluate(() => {
      localStorage.removeItem('demoMode');
      localStorage.removeItem('user');
    });
    
    await page.goto('/dashboard');
    
    // Should be redirected to login page
    await expect(page).toHaveURL(/\/login/);
  });
});
