import { test, expect } from '@playwright/test';

test.describe('Activities Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login via Demo Mode
    await page.goto('/login');
    await page.getByTestId('demo-login-button').click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should successfully log a new Transport activity', async ({ page }) => {
    // Wait for the dashboard to finish loading its API data
    await expect(page.getByTestId('dashboard-loaded')).toBeVisible({ timeout: 15000 });
    
    // Navigate to log activity
    await page.getByTestId('sidebar-nav-log-activity').click();
    await expect(page).toHaveURL(/\/log/);
    
    // Wait for page to load
    await expect(page.locator('text=Ledger').first()).toBeVisible({ timeout: 10000 });
    
    // Click 'Log Event' to open the modal
    await page.getByRole('button', { name: 'Log Event' }).first().click();
    await expect(page.locator('text=Log New Activity').first()).toBeVisible({ timeout: 5000 });

    // Fill out the form
    await page.getByTestId('activity-category-select').click();
    await page.getByRole('option', { name: 'Transport' }).click();
    
    await page.getByTestId('activity-type-input').fill('Morning Commute');
    await page.getByTestId('activity-title-input').fill('Train ride to office');
    await page.locator('input[name="carbonEmission"]').fill('15');
    
    // Submit
    await page.getByTestId('activity-submit-button').click();
    
    // Verify toast success
    await expect(page.locator('text=Activity logged successfully')).toBeVisible();
  });
});
