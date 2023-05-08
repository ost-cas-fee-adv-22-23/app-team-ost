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
    const loginButton = page.getByText('Login');
    await loginButton.click();

    const loginWithZitadel = page.getByText('Anmelden mit ZITADEL');
    await loginWithZitadel.click();

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
    const sendButton = page.getByText('Absenden');

    // Create new mumble and submit
    await newMumble.fill(`Playwright Test - ${testdate}`);
    await sendButton.click();

    //Expect a new mumble
    await page.goto(process.env.NEXT_PUBLIC_URL as string);
    await expect(page.getByText(testdate)).toBeVisible();
  });
});
