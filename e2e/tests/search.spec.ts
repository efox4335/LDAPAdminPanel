import { test, expect } from '@playwright/test';

import { addServer, adminBind, removeServer, unbind } from '../utils/preTestUtils';
import { assertSearchFormContents, clickResetAdvancedFormButton, clickResetBaseFormButton, clickSearchButton, fillSearchForm, locateSearchForm } from '../utils/searchUtils';
import { assertOpenEntryCount, locateOpenEntry } from '../utils/openEntryUtils';
import { defaultSearchFormContents, invalidCriticalControl } from '../utils/constants';
import assertError from '../utils/assertError';
import { locateEntry } from '../utils/treeDisplayUtils';
import assertAdvancedOptionsClosed from '../utils/assertAdvancedOptionsClosed';

test.describe('search tests', () => {
  test.describe('server added', () => {
    test.beforeEach(async ({ page }) => {
      await addServer(page);
    });

    test.afterEach(async ({ page }) => {
      await removeServer(page);
    });

    test('form hidded when not bound', async ({ page }) => {
      const searchForm = locateSearchForm(page);

      await expect(searchForm).toBeHidden();
    });

    test.describe('bound', () => {
      test.beforeEach(async ({ page }) => {
        await adminBind(page);
      });

      test.afterEach(async ({ page }) => {
        await unbind(page);
      });

      test('advanced options start closed', async ({ page }) => {
        const searchForm = locateSearchForm(page);

        await assertAdvancedOptionsClosed(searchForm);
      });

      test('default form contents', async ({ page }) => {
        await assertSearchFormContents(page, defaultSearchFormContents, []);
      });

      test('time limit is always positive integer or zero', async ({ page }) => {
        await fillSearchForm(page, { timeLimit: 'abc' }, []);

        await assertSearchFormContents(page, defaultSearchFormContents, []);
      });

      test('max entries is always positive integer or zero', async ({ page }) => {
        await fillSearchForm(page, { maxEntries: 'abc' }, []);

        await assertSearchFormContents(page, defaultSearchFormContents, []);
      });

      test('max entries works', async ({ page }) => {
        await fillSearchForm(page, { filter: '(objectClass=*)', maxEntries: '3' }, []);

        await clickSearchButton(page);

        await assertOpenEntryCount(page, 3);
      });

      test('name search', async ({ page }) => {
        await fillSearchForm(page, { name: 'user01' }, []);

        await clickSearchButton(page);

        await expect(locateOpenEntry(page, 'cn=user01,ou=users,dc=example,dc=org')).toBeVisible();
      });

      test('reset base form button', async ({ page }) => {
        await fillSearchForm(page, { name: 'abc', filter: 'def' }, []);

        await clickResetBaseFormButton(page);

        await assertSearchFormContents(page, defaultSearchFormContents, []);
      });

      test('reset advanced form button', async ({ page }) => {
        await fillSearchForm(
          page,
          {
            scope: 'children',
            aliasDeref: 'find',
            timeLimit: '43',
            baseDns: ['abc', 'def'],
            maxEntries: '67'
          }, []);

        await clickResetAdvancedFormButton(page);

        await assertSearchFormContents(page, defaultSearchFormContents, []);
      });

      test('controls passed', async ({ page }) => {
        await fillSearchForm(page, {}, [invalidCriticalControl]);

        await assertSearchFormContents(page, {}, [invalidCriticalControl]);

        await clickSearchButton(page);

        await assertError(page, 'UnavailableCriticalExtensionError', true);
      });

      test('new base dns work', async ({ page }) => {
        await fillSearchForm(page, { name: 'user01', baseDns: ['ou=groups,dc=example,dc=org'] }, []);

        await clickSearchButton(page);

        await assertOpenEntryCount(page, 0);
      });

      test('searching for entries does not change the state of entries in the ldap tree', async ({ page }) => {
        await fillSearchForm(page, { name: 'users' }, []);

        await locateEntry(page, 'cn=user01,ou=users,dc=example,dc=org', true);

        await clickSearchButton(page);

        await expect(locateOpenEntry(page, 'ou=users,dc=example,dc=org')).toBeVisible();

        const user01 = await locateEntry(page, 'cn=user01,ou=users,dc=example,dc=org', false);

        await expect(user01).toBeVisible();
      });
    });
  });
});
