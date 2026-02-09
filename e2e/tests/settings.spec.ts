import { test, expect } from '@playwright/test';

import locateTableByHeaderText from '../utils/locateTableByHeader';
import { navToPage } from '../utils/preTestUtils';

test.describe('settings tests', () => {
  test.beforeEach(async ({ page }) => {
    await navToPage(page);
  });

  test('settings panel starts closed', async ({ page }) => {
    const settingsTable = locateTableByHeaderText(page, page.locator('.mainDisplay'), 'setting');

    await expect(settingsTable).toBeHidden();
  });

  test('settings table shows', async ({ page }) => {
    await page.getByRole('button', { name: /.*Settings.*/ }).click();

    const settingsTable = locateTableByHeaderText(page, page.locator('.mainDisplay'), 'setting');

    await expect(settingsTable).toBeVisible();
  });
});
