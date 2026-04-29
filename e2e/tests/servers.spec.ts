import { test, expect } from '@playwright/test';

import { ldapServerUrl, tlsServerUrl } from '../utils/constants';
import { navToPage } from '../utils/preTestUtils';
import assertServerInfo from '../utils/assertServerInfo';
import assertError from '../utils/assertError';

test.describe('server tests', () => {
  test.beforeEach(async ({ page }) => {
    await navToPage(page);
  });

  test('incorrect protocol causes error', async ({ page }) => {
    await page.getByRole('textbox').fill('invalidProtocol');

    await page.getByRole('button', { name: 'add' }).click();

    await expect(page.getByText('is an invalid LDAP URL')).toBeVisible();
  });

  test('non tls enabled server errors on connection with tls on', async ({ page }) => {
    await page.getByRole('textbox').fill(ldapServerUrl);

    await page.getByRole('checkbox').check();

    await page.getByRole('button', { name: 'add' }).click();

    await page.getByRole('button', { name: 'bind' }).click();

    await assertError(page, 'Client network socket disconnected before secure TLS connection was established', true);

    await page.getByRole('button', { name: 'remove' }).click();
  });

  test('reset works', async ({ page }) => {
    await page.getByRole('textbox').fill('stuff');

    await page.getByRole('checkbox').check();

    await page.getByRole('button', { name: 'reset' }).click();

    await expect(page.getByRole('textbox')).toHaveText('');

    await expect(page.getByRole('checkbox')).not.toBeChecked();
  });

  test('tls checkbox works', async ({ page }) => {
    await page.getByRole('textbox').fill(tlsServerUrl);

    await page.getByRole('checkbox').check();

    await page.getByRole('button', { name: 'add' }).click();

    await assertServerInfo(page, {
      isConnected: false,
      boundDn: '',
      ldapServerUrl: tlsServerUrl,
      tlsEnabled: true
    });

    await page.getByRole('button', { name: 'remove' }).click();
  });

  test('tls is auto enabled with ldaps', async ({ page }) => {
    await page.getByRole('textbox').fill(tlsServerUrl);

    await expect(page.getByRole('checkbox')).not.toBeChecked();

    await page.getByRole('button', { name: 'add' }).click();

    await assertServerInfo(page, {
      isConnected: false,
      boundDn: '',
      ldapServerUrl: tlsServerUrl,
      tlsEnabled: true
    });

    await page.getByRole('button', { name: 'remove' }).click();
  });

  test('correct add and remove', async ({ page }) => {
    await page.getByRole('textbox').fill(ldapServerUrl);

    await page.getByRole('button', { name: 'add' }).click();

    await expect(page.getByText(ldapServerUrl)).toBeVisible();

    await page.getByRole('button', { name: 'remove' }).click();

    await expect(page.getByText(ldapServerUrl)).toBeHidden();
  });
});
