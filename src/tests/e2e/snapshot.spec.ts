import { test, expect } from '@playwright/test';

test.describe('Compares a snapshot of the login page', () => {
  test('snapshot test the login page', async ({ page }) => {
    await page.goto(process.env.NEXT_PUBLIC_URL as string);
    await page.getByRole('link', { name: 'Login' }).click();
    await expect(page).toHaveScreenshot();
  });
});
