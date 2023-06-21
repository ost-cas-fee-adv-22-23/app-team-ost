import { expect, test as setup } from '@playwright/test';
import { authFile } from '../../playwright.config';

setup('authenticate as test user', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Login' }).click();

  await page.getByRole('button', { name: 'login with zitadel' }).click();

  // await expect(page).toHaveURL(/.*.zitadel.cloud\/ui\/login\/login.*/);

  const loginnameField = await page.waitForSelector('input[name="loginName"]');
  loginnameField.fill(process.env.ZITADEL_USERNAME as string);
  const forwardButton = page.getByText('next');
  await forwardButton.click();

  const passwordField = await page.waitForSelector('input[name="password"]');
  passwordField.fill(process.env.ZITADEL_PASSWORD as string);
  const forwardPwButton = page.getByText('next');
  await forwardPwButton.click();

  //Save the auth state in context
  await page.context().storageState({ path: authFile });
});
