import { expect, test } from '@playwright/test';

import { addServer, adminBind, unbind, removeServer, navToPage } from '../utils/preTestUtils';
import { defaultNewEntry, invalidCriticalControl, defaultTreeEntries, personAutoCompelete, autoCompeletePersonModify, autoCompeletePersonFinalEntry } from '../utils/constants';
import { locateOpenEntryDisplay, fillNewEntry, deleteOpenEntry, assertEntryContents, clickNewEntryButton, submitNewEntry, clickNewChildButton, assertNewEntryFormContents, clickResetButton, clickCancelButton, deleteNewEntryAttribute, deleteNewEntryValue, autoCompeleteObjectClass, modifyEntryFormContents, locateFormAttributeRow } from '../utils/openEntryUtils';
import { locateEntry, openEntry } from '../utils/treeDisplayUtils';
import assertError from '../utils/assertError';
import expandAdvancedOptions from '../utils/expandAdvancedOptions';
import assertAdvancedOptionsClosed from '../utils/assertAdvancedOptionsClosed';
import locateTableByHeaderText from '../utils/locateTableByHeader';

test.describe('new entry tests', () => {
  test.beforeEach(async ({ page }) => {
    await navToPage(page);

    await addServer(page);

    await adminBind(page);
  });

  test.afterEach(async ({ page }) => {
    await unbind(page);

    await removeServer(page);
  });

  test('attribute autofill on auto compelete', async ({ page }) => {
    await clickNewEntryButton(page);

    const newEntryForm = locateOpenEntryDisplay(page).locator('form');

    await autoCompeleteObjectClass(page, newEntryForm, 'person');

    await assertNewEntryFormContents(page, newEntryForm, personAutoCompelete.attributes, []);
  });

  test('autofilled attributes save and can be deleted', async ({ page }) => {
    await clickNewEntryButton(page);

    const newEntryForm = locateOpenEntryDisplay(page).locator('form');

    await autoCompeleteObjectClass(page, newEntryForm, 'person');

    await modifyEntryFormContents(page, newEntryForm, autoCompeletePersonModify.modifications);

    await submitNewEntry(page, newEntryForm);

    await assertEntryContents(page, autoCompeletePersonFinalEntry);

    await deleteOpenEntry(page, autoCompeletePersonFinalEntry.dn, []);
  });

  test('entry with multiple autofill include attributes only once', async ({ page }) => {
    await clickNewEntryButton(page);

    const newEntryForm = locateOpenEntryDisplay(page).locator('form');

    await autoCompeleteObjectClass(page, newEntryForm, 'person');

    const attributeTable = locateTableByHeaderText(page, newEntryForm, 'attribute');

    const beforeRowCount = await attributeTable.getByRole('row').count();

    await autoCompeleteObjectClass(page, newEntryForm, 'person');

    const afterRowCount = await attributeTable.getByRole('row').count();

    expect(beforeRowCount).toStrictEqual(afterRowCount);
  });

  test('attributes with different names are included only once', async ({ page }) => {
    await clickNewEntryButton(page);

    const newEntryForm = locateOpenEntryDisplay(page).locator('form');

    await autoCompeleteObjectClass(page, newEntryForm, 'person');

    await autoCompeleteObjectClass(page, newEntryForm, 'RFC822localPart');

    try {
      await locateFormAttributeRow(page, newEntryForm, 'commonName');

      throw new Error('commonName row found');
    } catch { /* error expected */ }
  });

  test('new entry', async ({ page }) => {
    await clickNewEntryButton(page);

    const newEntryForm = locateOpenEntryDisplay(page).locator('form');

    await fillNewEntry(page, newEntryForm, defaultNewEntry.attributes, []);

    await submitNewEntry(page, newEntryForm);

    await assertEntryContents(page, defaultNewEntry);

    const newEntryTreeLocation = await locateEntry(page, defaultNewEntry.dn, true);

    await expect(newEntryTreeLocation).toBeVisible();

    await deleteOpenEntry(page, defaultNewEntry.dn, []);
  });

  test('controls passed', async ({ page }) => {
    await clickNewEntryButton(page);

    const newEntryForm = locateOpenEntryDisplay(page).locator('form');

    await fillNewEntry(page, newEntryForm, defaultNewEntry.attributes, [invalidCriticalControl]);

    await assertNewEntryFormContents(page, newEntryForm, defaultNewEntry.attributes, [invalidCriticalControl]);

    await submitNewEntry(page, newEntryForm);

    await assertError(page, 'UnavailableCriticalExtensionError', true);

    try {
      await locateEntry(page, defaultNewEntry.dn, true);

      throw new Error('deleted entry found');
    } catch { /*error good*/ }
  });

  test('incompelete entry', async ({ page }) => {
    await clickNewEntryButton(page);

    const newEntryForm = locateOpenEntryDisplay(page).locator('form');

    await fillNewEntry(page, newEntryForm, defaultNewEntry.attributes.filter(({ name }) => name !== 'dn'), []);

    await submitNewEntry(page, newEntryForm);

    await assertError(page, '', true);
  });

  test('new child starts with dn as initial attribute', async ({ page }) => {
    // eslint-disable-next-line playwright/no-conditional-in-test
    if (!defaultTreeEntries[0]) {
      throw new Error('no default tree entries');
    }

    await openEntry(page, defaultTreeEntries[0].dn);

    await clickNewChildButton(page, defaultTreeEntries[0].dn);

    const newEntryForm = locateOpenEntryDisplay(page).locator('form');

    await assertNewEntryFormContents(page, newEntryForm, [{ name: 'dn', values: [defaultTreeEntries[0].dn] }], []);
  });

  test('reset button keeps initial attributes', async ({ page }) => {
    // eslint-disable-next-line playwright/no-conditional-in-test
    if (!defaultTreeEntries[0]) {
      throw new Error('no default tree entries');
    }

    await openEntry(page, defaultTreeEntries[0].dn);

    await clickNewChildButton(page, defaultTreeEntries[0].dn);

    const newEntryForm = locateOpenEntryDisplay(page).locator('form');

    await clickResetButton(newEntryForm);

    await assertNewEntryFormContents(page, newEntryForm, [{ name: 'dn', values: [defaultTreeEntries[0].dn] }], []);
  });

  test('blank row for new attributes', async ({ page }) => {
    await clickNewEntryButton(page);

    const newEntryForm = locateOpenEntryDisplay(page).locator('form');

    await fillNewEntry(page, newEntryForm, defaultNewEntry.attributes, []);

    await assertNewEntryFormContents(page, newEntryForm, [{ name: '', values: [''] }], []);
  });

  test('blank row for new values', async ({ page }) => {
    await clickNewEntryButton(page);

    const newEntryForm = locateOpenEntryDisplay(page).locator('form');

    await fillNewEntry(page, newEntryForm, defaultNewEntry.attributes, []);

    await assertNewEntryFormContents(page, newEntryForm, defaultNewEntry.attributes.concat({ name: 'objectClass', values: [''] }), []);
  });

  test('attribute can be deleted', async ({ page }) => {
    await clickNewEntryButton(page);

    const newEntryForm = locateOpenEntryDisplay(page).locator('form');

    await fillNewEntry(page, newEntryForm, defaultNewEntry.attributes, []);

    await deleteNewEntryAttribute(page, newEntryForm, 'sn');

    try {
      await assertNewEntryFormContents(page, newEntryForm, defaultNewEntry.attributes, []);

      throw new Error('new attribute sn not deleted');
    } catch { /* error expected */ }
  });

  test('value can be deleted', async ({ page }) => {
    await clickNewEntryButton(page);

    const newEntryForm = locateOpenEntryDisplay(page).locator('form');

    await fillNewEntry(page, newEntryForm, defaultNewEntry.attributes, []);

    await deleteNewEntryValue(page, newEntryForm, 'sn', 'testUser');

    try {
      await assertNewEntryFormContents(page, newEntryForm, defaultNewEntry.attributes, []);

      throw new Error('new attribute sn not deleted');
    } catch { /* error expected */ }
  });

  test('advanced options start closed', async ({ page }) => {
    await clickNewEntryButton(page);

    const newEntryForm = locateOpenEntryDisplay(page).locator('form');

    await assertAdvancedOptionsClosed(newEntryForm);
  });

  test('control can be deleted', async ({ page }) => {
    await clickNewEntryButton(page);

    const newEntryForm = locateOpenEntryDisplay(page).locator('form');

    await fillNewEntry(page, newEntryForm, defaultNewEntry.attributes, [invalidCriticalControl]);

    try {
      await expandAdvancedOptions(newEntryForm);
    } catch { /* error is ok */ }

    try {
      await assertNewEntryFormContents(page, newEntryForm, defaultNewEntry.attributes, [invalidCriticalControl]);

      throw new Error(`control ${invalidCriticalControl.oid} not deleted`);
    } catch { /* error is expected */ }
  });

  test('blank row for new controls', async ({ page }) => {
    await clickNewEntryButton(page);

    const newEntryForm = locateOpenEntryDisplay(page).locator('form');

    await fillNewEntry(page, newEntryForm, defaultNewEntry.attributes, [invalidCriticalControl]);

    try {
      await expandAdvancedOptions(newEntryForm);
    } catch { /* error is ok */ }

    await assertNewEntryFormContents(page, newEntryForm, defaultNewEntry.attributes, [{ oid: '', critical: false }]);
  });

  test('cancel button', async ({ page }) => {
    await clickNewEntryButton(page);

    const newEntryForm = locateOpenEntryDisplay(page).locator('form');

    await clickCancelButton(newEntryForm);

    await expect(newEntryForm).toBeHidden();
  });
});
