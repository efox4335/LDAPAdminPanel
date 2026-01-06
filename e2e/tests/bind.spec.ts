import { test } from '@playwright/test';

import { pageUrl, ldapServerUrl, adminDn, adminPassword, invalidOid } from '../utils/constants';
import assertClientInfo from '../utils/assertClientInfo';
import assertError from '../utils/assertError';

test.describe('bind tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(pageUrl);

    await page.getByRole('textbox').fill(ldapServerUrl);

    await page.getByRole('button', { name: 'add' }).click();
  });

  test.afterEach(async ({ page }) => {
    await page.getByRole('button', { name: 'remove' }).click();
  });

  test('no bind server info', async ({ page }) => {
    await assertClientInfo(page, false, 'null', ldapServerUrl);
  });

  test('controls passed', async ({ page }) => {
    const controlInput = page
      .locator('.singleClientBind')
      .getByText('controls')
      .locator('..')
      .locator('..')
      .locator('..');

    await controlInput.getByRole('textbox').fill(invalidOid);
    await controlInput.locator('.criticalCheckbox').nth(0).click();

    await page.getByRole('button', { name: 'bind' }).click()

    await assertError(page, 'UnavailableCriticalExtensionError', true);
  });

  test.describe('admin bind', () => {
    test.beforeEach(async ({ page }) => {
      await page
        .locator('.singleClientBind')
        .getByText('dn')
        .locator('..')
        .getByRole('textbox')
        .fill(adminDn);

      await page
        .locator('.singleClientBind')
        .getByText('password')
        .locator('..')
        .getByRole('textbox')
        .fill(adminPassword);

      await page
        .locator('.singleClientBind')
        .getByRole('button', { name: 'bind' })
        .click();
    });

    test('admin unbind server info', async ({ page }) => {
      await page
        .getByRole('button', { name: 'unbind' })
        .click();

      await assertClientInfo(page, false, 'null', ldapServerUrl);
    });

    test.describe('admin unbind', () => {
      test.afterEach(async ({ page }) => {
        await page.getByRole('button', { name: 'unbind' }).click();
      });

      test('admin bind server info', async ({ page }) => {
        await assertClientInfo(page, true, adminDn, ldapServerUrl);
      });

      test('remove while bound', async ({ page }) => {
        await page.getByRole('button', { name: 'remove' }).click();

        await assertError(page, 'cannot delete: client has active connection to database', true);
        await assertClientInfo(page, true, adminDn, ldapServerUrl);
      });
    });
  });

  test.describe('anon bind', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'bind' }).click();
    });

    test.afterEach(async ({ page }) => {
      await page.getByRole('button', { name: 'unbind' }).click();
    });


    test('anon bind bound dn', async ({ page }) => {
      await assertClientInfo(page, true, '', ldapServerUrl);
    });
  });
});
