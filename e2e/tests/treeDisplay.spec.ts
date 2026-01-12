import { test } from '@playwright/test';

import { addServer, removeServer, adminBind, unbind } from '../utils/preTestUtils';
import { locateEntry, collapseEntry, expandEntry } from '../utils/treeDisplayUtils';
import { defaultTreeEntries } from '../utils/constants';

test.describe('ldap tree display tests', () => {
  test.beforeEach(async ({ page }) => {
    await addServer(page);

    await adminBind(page);
  });

  test.afterEach(async ({ page }) => {
    await unbind(page);

    await removeServer(page);
  });

  test('default tree visibility', async ({ page }) => {
    for (const entryDn of defaultTreeEntries) {
      await locateEntry(page, entryDn, true);
    }
  });

  test('entry can collapse', async ({ page }) => {
    await collapseEntry(page, 'dc=example,dc=org');

    try {
      await locateEntry(page, 'cn=user01,ou=users,dc=example,dc=org');

      throw new Error('entry was visible');
    } catch { /* if there was an error then the child entry was hidden */ };
  });

  test('entry can expand', async ({ page }) => {
    await collapseEntry(page, 'dc=example,dc=org');

    await expandEntry(page, 'dc=example,dc=org');

    await locateEntry(page, 'cn=user01,ou=users,dc=example,dc=org');
  });
});
