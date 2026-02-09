import { test, expect } from '@playwright/test';

import { ldapServerUrl } from '../utils/constants';
import { navToPage } from '../utils/preTestUtils';

test.describe('client tests', () => {
  test.beforeEach(async ({ page }) => {
    await navToPage(page);
  });

  test('incorrect protocol causes error', async ({ page }) => {
    await page.getByRole('textbox').fill('invalidProtocol');

    await page.getByRole('button', { name: 'add' }).click();

    await expect(page.getByText('is an invalid LDAP URL')).toBeVisible();
  });

  test('reset works', async ({ page }) => {
    await page.getByRole('textbox').fill('stuff');

    await page.getByRole('button', { name: 'reset' }).click();

    await expect(page.getByRole('textbox')).toHaveText('');
  });

  test('correct add and remove', async ({ page }) => {
    await page.getByRole('textbox').fill(ldapServerUrl);

    await page.getByRole('button', { name: 'add' }).click();

    await expect(page.getByText(ldapServerUrl)).toBeVisible();

    await page.getByRole('button', { name: 'remove' }).click();

    await expect(page.getByText(ldapServerUrl)).toBeHidden();
  });
});
