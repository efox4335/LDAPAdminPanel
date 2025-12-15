import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

const assertError = async (page: Page, errorText: string, dismiss?: boolean) => {
  dismiss = dismiss || false;

  await expect(page.locator('.errorsDisplay')).toBeVisible();
  await expect(page.locator('.errorsDisplay')).toHaveText(RegExp(`.*${errorText}.*`));

  if (dismiss) {
    await page
      .locator('.errorsDisplay')
      .getByText(errorText)
      .getByRole('button', { name: 'dismiss' })
      .click();
  }
};

export default assertError;
