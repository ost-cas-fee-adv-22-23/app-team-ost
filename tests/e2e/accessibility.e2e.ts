import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('A11y test', () => {
  test('a11y test with result attachement', async ({ page }, testInfo) => {
    await page.goto('/');

    // We disable some rules here, as we have some known issues with them
    // We should fix them in the future and enable the rules again
    const accessibilityScanResults = await new AxeBuilder({ page })
      .disableRules(['color-contrast', 'html-has-lang', 'duplicate-id', 'heading-order', 'aria-allowed-role'])
      .analyze();

    await testInfo.attach('accessibility-scan-results', {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: 'application/json',
    });

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
