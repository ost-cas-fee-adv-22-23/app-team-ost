import { test, expect } from '@playwright/test';

test.describe('Create a mumble', () => {
  test('should add a new mumble', async ({ page }) => {
    await page.goto('/');

    const testdate = Date.now().toString();

    const newMumble = page.getByTestId('new-mumble-textarea');

    // Create new mumble and submit
    await newMumble.click();
    await newMumble.fill(`Playwright Test - ${testdate}`);
    await page.getByTestId('button-submit').click();

    //We expect to pass the test if the mumble is visible on the home page
    //As the mumble is not visible immediately, we need to wait for it
    await expect(async () => {
      await page.goto('/');
      await expect(page.getByText(testdate)).toBeVisible();
    }).toPass();
  });

  test('should detect wrong file format', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('button-upload-image').click();

    page.on('filechooser', async (filechooser) => {
      await filechooser.setFiles('./tests/e2e/test.txt');
    });
    await page.locator('label').click();
    await page.getByRole('button', { name: 'Speichern' }).click();
    await expect(page.getByText('Falsches Dateiformat - Erlaubt sind JPEG, PNG oder GIF.')).toBeVisible();
  });

  test('should upload a gif image', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('button-upload-image').click();

    page.on('filechooser', async (filechooser) => {
      await filechooser.setFiles('./tests/e2e/refresh.gif');
    });
    await page.locator('label').click();
    await page.getByRole('button', { name: 'Speichern' }).click();
    await expect(page.getByRole('img', { name: 'refresh.gif' })).toBeVisible();
  });
});

test.describe('Like a Mumble', () => {
  test('should add a new mumble, like it and verify it in the user profile', async ({ page }) => {
    const testdate = Date.now().toString();

    await page.goto('/');
    const newMumble = page.getByTestId('new-mumble-textarea');

    // Create new mumble and submit
    await newMumble.click();
    await newMumble.fill(`I like this mumble at ${testdate}`);
    await page.getByTestId('button-submit').click();

    // Navigate to home and like the mumble
    //We expect to pass the test if the mumble is visible on the home page
    //As the mumble is not visible immediately, we need to wait for it
    await expect(async () => {
      await page.goto('/');
      await page
        .getByRole('article')
        .filter({ hasText: `I like this mumble at ${testdate}` })
        .getByRole('button', { name: 'Like' })
        .click();
    }).toPass();

    // Navigate to user profile and verify the liked mumble
    await page.getByRole('navigation').getByRole('link', { name: 'toenn' }).click();
    await expect(page.getByRole('paragraph').filter({ hasText: `I like this mumble at ${testdate}` })).toBeVisible();
  });
});
