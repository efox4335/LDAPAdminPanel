import { test, expect } from '@playwright/test';

test('page load', async ({ page }) => {
  await page.goto('http://localhost:5173');

  const mainDisplay = page.locator('.mainDisplay');

  await expect(mainDisplay).toBeVisible();
});
