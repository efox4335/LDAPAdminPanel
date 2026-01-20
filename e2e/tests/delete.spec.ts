import { test } from '@playwright/test';

import { addNewEntry, cancelDelete, deleteOpenEntry, openDeleteForm } from '../utils/openEntryUtils';
import { defaultNewEntry, invalidCriticalControl } from '../utils/constants';
import { addServer, removeServer, adminBind, unbind } from '../utils/preTestUtils';
import { locateEntry } from '../utils/treeDisplayUtils';
import assertError from '../utils/assertError';

test.describe('delete tests', () => {
  test.beforeEach(async ({ page }) => {
    await addServer(page);

    await adminBind(page);
  });

  test.afterEach(async ({ page }) => {
    await unbind(page);

    await removeServer(page);
  });

  test('entry deleted', async ({ page }) => {
    await addNewEntry(page, defaultNewEntry.attributes, []);

    await deleteOpenEntry(page, defaultNewEntry.dn, []);

    try {
      await locateEntry(page, defaultNewEntry.dn, true);

      throw new Error(`entry ${defaultNewEntry.dn} was not deleted`);
    } catch { /* error is expected */ }
  });

  test('controls passed', async ({ page }) => {
    await addNewEntry(page, defaultNewEntry.attributes, []);

    await deleteOpenEntry(page, defaultNewEntry.dn, [invalidCriticalControl]);

    await assertError(page, 'UnavailableCriticalExtensionError', true);

    await cancelDelete(page, defaultNewEntry.dn);

    await deleteOpenEntry(page, defaultNewEntry.dn, []);
  });

  test('cancel delete', async ({ page }) => {
    await addNewEntry(page, defaultNewEntry.attributes, []);

    await openDeleteForm(page, defaultNewEntry.dn);

    await cancelDelete(page, defaultNewEntry.dn);

    await locateEntry(page, defaultNewEntry.dn, true);

    await deleteOpenEntry(page, defaultNewEntry.dn, []);
  });
});
