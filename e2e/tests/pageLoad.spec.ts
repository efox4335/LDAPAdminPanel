import { test, expect } from '@playwright/test';

import { pageUrl } from '../utils/constants';

test.describe('page load tests', () => {
  test('page load', async ({ page }) => {
    await page.goto(pageUrl);

    const mainDisplay = page.locator('.mainDisplay');

    await expect(mainDisplay).toBeVisible();
  });
});
