import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

const assertError = async (page: Page, errorText: string, dismiss?: boolean) => {
  dismiss = dismiss || false;

  await expect(page.locator('.errorsDisplay')).toBeVisible();
  await expect(page.locator('.errorsDisplay')).toHaveText(RegExp(`.*${errorText}.*`));

  if (dismiss) {
    await page
      .locator('.errorsDisplay')
      .locator('.singleError')
      .filter({ has: page.getByText(RegExp(`.*${errorText}.*`)) })
      .getByRole('button', { name: 'dismiss' })
      .first()
      .click();
  }
};

export default assertError;
