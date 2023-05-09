import { test, expect } from '@playwright/test';

test.describe('Check Title', () => {
  test('has title timeline', async ({ page }) => {
    await page.goto(process.env.NEXT_PUBLIC_URL as string);
    //Expect a title to contain a substring.
    await expect(page).toHaveTitle(/Timeline/);
  });
});

test.describe('New Mumble', () => {
  test('should add a new mumble', async ({ page }) => {
    const testdate = Date.now().toString();

    await page.goto(process.env.NEXT_PUBLIC_URL as string);
    await page.getByRole('link', { name: 'Login' }).click();

    await page.getByRole('button', { name: 'login with zitadel' }).click();

    const loginnameField = page.getByPlaceholder('username');
    await loginnameField.fill(process.env.ZITADEL_USERNAME as string);
    const forwardButton = page.getByText('next');
    await forwardButton.click();

    const passwordField = page.getByLabel('password');
    await passwordField.fill(process.env.ZITADEL_PASSWORD as string);
    const forwardPwButton = page.getByText('next');
    await forwardPwButton.click();

    // Create locators for textarea and send button
    const newMumble = page.getByPlaceholder('Und was meinst du dazu?');

    // Create new mumble and submit
    await newMumble.click();
    await newMumble.fill(`Playwright Test - ${testdate}`);
    await page.getByRole('button', { name: 'Absenden' }).click();

    //Expect a new mumble
    await page.goto(process.env.NEXT_PUBLIC_URL as string);
    await expect(page.getByText(testdate)).toBeVisible();
  });
});
