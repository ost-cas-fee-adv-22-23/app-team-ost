import { test, expect } from '@playwright/test';

test.describe('Visual comparisons', () => {
  test('should open the logout page and snapshot test it', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page).toHaveScreenshot({ maxDiffPixels: 100 });
  });
});
