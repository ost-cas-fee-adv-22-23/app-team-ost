import { test, expect } from '@playwright/test';

test.describe('Visual comparisons', () => {
  test('should open the logout page and snapshot test it', async ({ page }) => {
    await page.goto(process.env.NEXT_PUBLIC_URL as string);
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page).toHaveScreenshot();
  });
});
