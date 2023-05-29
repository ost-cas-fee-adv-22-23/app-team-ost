import { test, expect } from '@playwright/test';

test.describe('Create a new Mumble', () => {
  test.beforeEach(async ({ page }) => {
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
  });

  test('should add a new mumble', async ({ page }) => {
    const testdate = Date.now().toString();

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

  test('should upload an image', async ({ page }) => {
    await page.getByRole('button', { name: 'Bild hochladen' }).click();
    page.on('filechooser', async (filechooser) => {
      await filechooser.setFiles('./src/tests/e2e/test.txt');
    });
    await page.locator('label').click();
    await page.getByRole('button', { name: 'Speichern' }).click();
    await expect(page.getByText('Falsches Dateiformat - Erlaubt sind JPEG, PNG oder GIF.')).toBeVisible();
    page.on('filechooser', async (filechooser) => {
      await filechooser.setFiles('./src/tests/e2e/refresh.gif');
    });
    await page.locator('label').click();
    await page.getByRole('button', { name: 'Speichern' }).click();
    await expect(page.getByRole('img', { name: 'refresh.gif' })).toBeVisible();
  });
});

test.describe('Like a Mumble', () => {
  test.beforeEach(async ({ page }) => {
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
  });

  test('Likes a new mumble and check the liked mumble in profile', async ({ page }) => {
    const testdate = Date.now().toString();

    await page.goto(process.env.NEXT_PUBLIC_URL as string);
    await page.getByPlaceholder('Und was meinst du dazu?').click();
    await page.getByPlaceholder('Und was meinst du dazu?').fill(`I like this mumble at ${testdate}`);
    await page.getByRole('button', { name: 'Absenden' }).click();
    await page.goto(process.env.NEXT_PUBLIC_URL as string);
    await page
      .getByRole('article')
      .filter({ hasText: `I like this mumble at ${testdate}` })
      .getByRole('button', { name: 'Like' })
      .click();
    await page.getByRole('navigation').getByRole('link', { name: 'toenn' }).click();
    await expect(page.getByRole('paragraph').filter({ hasText: `I like this mumble at ${testdate}` })).toBeVisible();
  });
});
