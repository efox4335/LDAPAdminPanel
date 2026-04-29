import { test, expect } from '@playwright/test';

import locateTableByHeaderText from '../utils/locateTableByHeader';
import { navToPage } from '../utils/preTestUtils';
import { applySettings, fillSettingsForm, openSettings, resetSettingsToDefault } from '../utils/settingsUtils';
import { customCertFilePath, ldapServerUrl, tlsServerUrl } from '../utils/constants';
import assertServerInfo from '../utils/assertServerInfo';
import assertError from '../utils/assertError';

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

  test('custom tls certificates works', async ({ page }) => {
    await openSettings(page);

    await fillSettingsForm(page, [
      {
        setting: 'customCertificates',
        removeExistingCerts: true,
        relativeFilePath: '',
        addNewCert: false
      }
    ]);

    await applySettings(page);

    await fillSettingsForm(page, [
      {
        setting: 'customCertificates',
        removeExistingCerts: false,
        relativeFilePath: customCertFilePath,
        addNewCert: true
      }
    ]);

    await applySettings(page);

    const newServerForm = page.locator('.newServerForm');

    await newServerForm
      .getByRole('textbox')
      .fill(tlsServerUrl);

    await newServerForm
      .getByRole('button', { name: 'add' })
      .click();

    await page
      .getByRole('button', { name: 'bind' })
      .click();

    await assertServerInfo(page, {
      isConnected: true,
      boundDn: '',
      ldapServerUrl: tlsServerUrl,
      tlsEnabled: true
    });

    await page
      .getByRole('button', { name: 'unbind' })
      .click();

    await page
      .getByRole('button', { name: 'remove' })
      .click();

    await resetSettingsToDefault(page);
  });

  test('force tls works', async ({ page }) => {
    await openSettings(page);

    await fillSettingsForm(page, [
      {
        setting: 'forceTls',
        newValue: true
      }
    ]);

    await applySettings(page);

    const newServerForm = page.locator('.newServerForm');

    await newServerForm
      .getByRole('textbox')
      .fill(ldapServerUrl);

    await expect(newServerForm.getByRole('checkbox')).toBeChecked();

    await newServerForm
      .getByRole('button', { name: 'add' })
      .click();

    await page
      .getByRole('button', { name: 'bind' })
      .click();

    await assertError(page, 'Client network socket disconnected before secure TLS connection was established', true);

    await page
      .getByRole('button', { name: 'remove' })
      .click();

    await resetSettingsToDefault(page);
  });
});
