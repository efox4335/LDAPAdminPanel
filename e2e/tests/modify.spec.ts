import { test, expect } from '@playwright/test';

import { addServer, removeServer, adminBind, unbind } from '../utils/preTestUtils';
import { addNewEntry, assertEntryContents, assertModifyFormContents, clickCancelButton, clickModifyButton, clickResetButton, clickSaveButton, deleteOpenEntry, fillModifyForm, locateOpenEntry, locateOpenEntryDisplay } from '../utils/openEntryUtils';
import { defaultNewEntry, defaultNewEntryInvalidModifyBody, defaultNewEntryInvalidModifyDn, defaultNewEntryModifiedBody, defaultNewEntryModifiedDn, defaultNewEntryModifyBody, defaultNewEntryModifyDn, defaultNewEntryRestoreDn, invalidCriticalControl } from '../utils/constants';
import { openEntry } from '../utils/treeDisplayUtils';
import assertError from '../utils/assertError';

test.describe('modify tests', () => {
  test.beforeEach(async ({ page }) => {
    await addServer(page);

    await adminBind(page);

    await addNewEntry(page, defaultNewEntry.attributes, []);
  });

  test.afterEach(async ({ page }) => {
    await openEntry(page, defaultNewEntry.dn);

    await deleteOpenEntry(page, defaultNewEntry.dn, []);

    await unbind(page);

    await removeServer(page);
  });

  test('modify body', async ({ page }) => {
    const newEntry = locateOpenEntry(page, defaultNewEntryModifyBody.dn);

    await clickModifyButton(newEntry);

    const modifyForm = locateOpenEntryDisplay(page).locator('form');

    await fillModifyForm(page, modifyForm, defaultNewEntryModifyBody.modifications, [], []);

    await clickSaveButton(modifyForm);

    await assertEntryContents(page, {
      dn: defaultNewEntry.dn,
      attributes: defaultNewEntryModifiedBody
    });
  });

  test('modify form starts with it\'s entries attributes', async ({ page }) => {
    const newEntry = locateOpenEntry(page, defaultNewEntry.dn);

    await clickModifyButton(newEntry);

    const modifyForm = locateOpenEntryDisplay(page).locator('form');

    await assertModifyFormContents(page, modifyForm, defaultNewEntry.attributes, [], []);

    await clickCancelButton(modifyForm);
  });

  test('modify dn', async ({ page }) => {
    const newEntry = locateOpenEntry(page, defaultNewEntryModifyDn.dn);

    await clickModifyButton(newEntry);

    const modifyForm = locateOpenEntryDisplay(page).locator('form');

    await fillModifyForm(page, modifyForm, defaultNewEntryModifyDn.modifications, [], []);

    await clickSaveButton(modifyForm);

    await assertEntryContents(page, {
      dn: defaultNewEntryModifiedDn,
      attributes: [
        {
          name: 'dn',
          values: [defaultNewEntryModifiedDn]
        }
      ]
    });

    const modifiedEntry = locateOpenEntry(page, defaultNewEntryRestoreDn.dn);

    await clickModifyButton(modifiedEntry);

    const modifiedModifyFrom = locateOpenEntryDisplay(page).locator('form');

    await fillModifyForm(page, modifiedModifyFrom, defaultNewEntryRestoreDn.modifications, [], []);

    await clickSaveButton(modifiedModifyFrom);
  });

  test('modify body and dn', async ({ page }) => {
    const newEntry = locateOpenEntry(page, defaultNewEntryModifyBody.dn);

    await clickModifyButton(newEntry);

    const modifyForm = locateOpenEntryDisplay(page).locator('form');

    await fillModifyForm(page, modifyForm, defaultNewEntryModifyBody.modifications, [], []);

    await fillModifyForm(page, modifyForm, defaultNewEntryModifyDn.modifications, [], []);

    await clickSaveButton(modifyForm);

    await assertEntryContents(page, {
      dn: defaultNewEntryModifiedDn,
      attributes: defaultNewEntryModifiedBody
    });

    await assertEntryContents(page, {
      dn: defaultNewEntryModifiedDn,
      attributes: [
        {
          name: 'dn',
          values: [defaultNewEntryModifiedDn]
        }
      ]
    });

    const modifiedEntry = locateOpenEntry(page, defaultNewEntryRestoreDn.dn);

    await clickModifyButton(modifiedEntry);

    const modifiedModifyFrom = locateOpenEntryDisplay(page).locator('form');

    await fillModifyForm(page, modifiedModifyFrom, defaultNewEntryRestoreDn.modifications, [], []);

    await clickSaveButton(modifiedModifyFrom);
  });

  test('modify body controls passed', async ({ page }) => {
    const newEntry = locateOpenEntry(page, defaultNewEntryModifyBody.dn);

    await clickModifyButton(newEntry);

    const modifyForm = locateOpenEntryDisplay(page).locator('form');

    await fillModifyForm(page, modifyForm, defaultNewEntryModifyBody.modifications, [invalidCriticalControl], []);

    await clickSaveButton(modifyForm);

    await assertError(page, 'UnavailableCriticalExtensionError', true);

    await clickCancelButton(modifyForm);
  });

  test('modify dn controls passed', async ({ page }) => {
    const newEntry = locateOpenEntry(page, defaultNewEntryModifyDn.dn);

    await clickModifyButton(newEntry);

    const modifyForm = locateOpenEntryDisplay(page).locator('form');

    await fillModifyForm(page, modifyForm, defaultNewEntryModifyDn.modifications, [], [invalidCriticalControl]);

    await clickSaveButton(modifyForm);

    await assertError(page, 'UnavailableCriticalExtensionError', true);

    await clickCancelButton(modifyForm);
  });

  test('reset keeps default attributes', async ({ page }) => {
    const newEntry = locateOpenEntry(page, defaultNewEntry.dn);

    await clickModifyButton(newEntry);

    const modifyForm = locateOpenEntryDisplay(page).locator('form');

    await fillModifyForm(page, modifyForm, defaultNewEntryModifyBody.modifications, [], []);

    await fillModifyForm(page, modifyForm, defaultNewEntryModifyDn.modifications, [], []);

    await clickResetButton(modifyForm);

    await assertModifyFormContents(page, modifyForm, defaultNewEntry.attributes, [], []);

    await clickCancelButton(modifyForm);
  });

  test('invalid modify error on fail', async ({ page }) => {
    const newEntry = locateOpenEntry(page, defaultNewEntryInvalidModifyBody.dn);

    await clickModifyButton(newEntry);

    const modifyForm = locateOpenEntryDisplay(page).locator('form');

    await fillModifyForm(page, modifyForm, defaultNewEntryInvalidModifyBody.modifications, [], []);

    await clickSaveButton(modifyForm);

    await assertError(page, '', true);

    await expect(modifyForm).toBeVisible();

    await clickCancelButton(modifyForm);

    await assertEntryContents(page, defaultNewEntry);
  });

  test('invalid modify dn error on fail', async ({ page }) => {
    const newEntry = locateOpenEntry(page, defaultNewEntryInvalidModifyDn.dn);

    await clickModifyButton(newEntry);

    const modifyForm = locateOpenEntryDisplay(page).locator('form');

    await fillModifyForm(page, modifyForm, defaultNewEntryInvalidModifyDn.modifications, [], []);

    await clickSaveButton(modifyForm);

    await assertError(page, '', true);

    await expect(modifyForm).toBeVisible();

    await clickCancelButton(modifyForm);

    await assertEntryContents(page, defaultNewEntry);
  });
});
