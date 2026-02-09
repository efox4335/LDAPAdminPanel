import { expect, test } from '@playwright/test';

import { addServer, removeServer, adminBind, unbind, navToPage } from '../utils/preTestUtils';
import { locateEntry, collapseEntry, expandEntry } from '../utils/treeDisplayUtils';
import { defaultTreeEntries } from '../utils/constants';

test.describe('ldap tree display tests', () => {
  test.beforeEach(async ({ page }) => {
    await navToPage(page);

    await addServer(page);

    await adminBind(page);
  });

  test.afterEach(async ({ page }) => {
    await unbind(page);

    await removeServer(page);
  });

  test('default tree visibility', async ({ page }) => {
    for (const { dn } of defaultTreeEntries) {
      await locateEntry(page, dn, true);
    }
  });

  test('all entries can collapse', async ({ page }) => {
    for (const entry of defaultTreeEntries) {
      const entryLoc = await locateEntry(page, entry.dn, true);

      await collapseEntry(page, entryLoc);

      await expect(entryLoc.locator('.ldapTreeEntryChildren')).toBeHidden();
    }
  });

  test('dse starts closed', async ({ page }) => {
    const entryLoc = await locateEntry(page, '', true);

    await collapseEntry(page, entryLoc);

    await expect(entryLoc.locator('.ldapTreeEntryChildren')).toBeHidden();
  });

  test('toggle vis of parent does not affect vis of child', async ({ page }) => {
    for (const entry of defaultTreeEntries) {
      const entryLoc = await locateEntry(page, entry.dn, true);

      await expandEntry(page, entryLoc);
    }

    const dseLoc = await locateEntry(page, '', false);

    await collapseEntry(page, dseLoc);

    await expandEntry(page, dseLoc);

    for (const entry of defaultTreeEntries) {
      const entryLoc = await locateEntry(page, entry.dn, true);

      await expect(entryLoc.getByRole('button', { name: '-' }).first()).toBeVisible();
    }
  });

  test('entry can expand', async ({ page }) => {
    for (const entry of defaultTreeEntries) {
      const entryLoc = await locateEntry(page, entry.dn, true);

      await expandEntry(page, entryLoc);

      await expect(entryLoc.getByRole('button', { name: '-' }).first()).toBeVisible();
    }
  });
});
