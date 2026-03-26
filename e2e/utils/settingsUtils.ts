import type { Page, Locator } from '@playwright/test';

import { changeSetting } from './types';
import locateTableByHeaderText from './locateTableByHeader';

export const locateOpenSettingsDisplay = (page: Page): Locator => {
  return page.locator('.openSettingsDisplay');
};

export const openSettings = async (page: Page) => {
  await page
    .locator('.settingsPanelToggleButton')
    .click();
};

export const fillSettingsForm = async (page: Page, settingChanges: changeSetting[]) => {
  const settingsPanel = locateOpenSettingsDisplay(page);

  const settingsTable = locateTableByHeaderText(page, settingsPanel, 'setting');

  for (const change of settingChanges) {
    let curRow;

    switch (change.setting) {
      case 'logFile':
        curRow = settingsTable
          .getByRole('row')
          .filter({ has: page.getByRole('cell', { name: 'log file' }) });

        await curRow
          .getByRole('textbox')
          .fill(change.newValue);

        break;
      case 'enableLogging':
        curRow = settingsTable
          .getByRole('row')
          .filter({ has: page.getByRole('cell', { name: 'enable logging' }) });

        await curRow
          .locator('select')
          .selectOption(change.newValue.toString());

        break;
      case 'forceTls':
        curRow = settingsTable
          .getByRole('row')
          .filter({ has: page.getByRole('cell', { name: 'force tls' }) });

        await curRow
          .locator('select')
          .selectOption(change.newValue.toString());

        break;
      case 'customCertificates':
        curRow = settingsTable
          .getByRole('row')
          .filter({ has: page.getByRole('cell', { name: 'custom certificates' }) });

        if (change.removeExistingCerts) {
          const delButtons = curRow
            .locator('.deleteButton')
            .all();

          for (const button of await delButtons) {
            await button.click();
          }
        }

        if (change.addNewCert) {
          const fileChooserPromise = page.waitForEvent('filechooser');

          await page.getByText('select file').click();

          const fileChooser = await fileChooserPromise;

          await fileChooser.setFiles(change.relativeFilePath);
        }

        break;
    }
  }
};

export const applySettings = async (page: Page) => {
  const settingPanel = locateOpenSettingsDisplay(page);

  await settingPanel
    .getByRole('button', { name: 'apply' })
    .last()
    .click();
};

export const resetSettingsToDefault = async (page: Page) => {
  const settingsPanel = locateOpenSettingsDisplay(page);

  await settingsPanel
    .getByRole('button', { name: 'reset to default' })
    .click();

  await applySettings(page);
};
