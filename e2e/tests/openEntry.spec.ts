import { test, expect } from '@playwright/test';

import { openEntry } from '../utils/treeDisplayUtils';
import { assertEntryContents, closeEntry, locateOpenEntry } from '../utils/openEntryUtils';
import { addServer, adminBind, removeServer, unbind } from '../utils/preTestUtils';
import { defaultTreeEntries } from '../utils/constants';

test.describe('open entry tests', () => {
  test.beforeEach(async ({ page }) => {
    await addServer(page);

    await adminBind(page);
  });

  test.afterEach(async ({ page }) => {
    await unbind(page);

    await removeServer(page);
  });

  test('all entries open', async ({ page }) => {
    for (const entry of defaultTreeEntries) {
      await openEntry(page, entry.dn);

      await assertEntryContents(page, entry);
    }
  });

  test('all entries can close', async ({ page }) => {
    for (const entry of defaultTreeEntries) {
      await openEntry(page, entry.dn);

      await closeEntry(page, entry.dn);

      const openedEntry = locateOpenEntry(page, entry.dn);

      await expect(openedEntry).toBeHidden();
    }
  });

  test('correct entry closed', async ({ page }) => {
    for (const entry of defaultTreeEntries) {
      await openEntry(page, entry.dn);
    }

    const selectedEntry = defaultTreeEntries[3];

    // eslint-disable-next-line playwright/no-conditional-in-test
    if (!selectedEntry) {
      throw new Error('test data missing');
    }

    await closeEntry(page, selectedEntry.dn);

    for (const entry of defaultTreeEntries) {
      // eslint-disable-next-line playwright/no-conditional-in-test
      if (selectedEntry.dn === entry.dn) {
        continue;
      }

      await assertEntryContents(page, entry);
    }

    const selectedEntryLocation = locateOpenEntry(page, selectedEntry.dn);

    await expect(selectedEntryLocation).toBeHidden();
  });

  test('entry can only be opened once', async ({ page }) => {
    // eslint-disable-next-line playwright/no-conditional-in-test
    if (!defaultTreeEntries[0]) {
      throw new Error('no default tree entries');
    }

    await openEntry(page, defaultTreeEntries[0].dn);
    await openEntry(page, defaultTreeEntries[0].dn);

    await expect(page.locator('.singleOpenEntry')).toHaveCount(1);
  });
});
