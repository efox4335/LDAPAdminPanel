import { test, expect } from '@playwright/test';

import { addServer, removeServer, adminBind, unbind } from '../utils/preTestUtils';
import { whoAmIOid, invalidOid } from '../utils/constants';
import assertError from '../utils/assertError';

test.describe('exop tests', () => {
  test.beforeEach(async ({ page }) => {
    await addServer(page);
    await adminBind(page);
  });

  test.afterEach(async ({ page }) => {
    await unbind(page);
    await removeServer(page);
  });

  test('success', async ({ page }) => {
    await page
      .locator('.singleClientExopForm')
      .locator('.userInteractionContainer')
      .getByRole('textbox')
      .first()
      .fill(whoAmIOid);

    await page
      .locator('.singleClientExop')
      .getByRole('button', { name: 'start' })
      .click();

    await expect(
      page
        .locator('.singleClientExop')
        .locator('.userInteractionContainer')
        .getByText('result')
        .locator('..')
        .getByRole('cell')
        .nth(1)
    ).toHaveText(RegExp('.*success.*'));
  });

  test('error on fail', async ({ page }) => {
    await page
      .locator('.singleClientExopForm')
      .locator('.userInteractionContainer')
      .getByRole('textbox')
      .first()
      .fill(invalidOid);

    await page
      .locator('.singleClientExop')
      .getByRole('button', { name: 'start' })
      .click();

    await expect(
      page
        .locator('.singleClientExop')
        .locator('.userInteractionContainer')
        .getByText('result')
        .locator('..')
        .getByRole('cell')
        .nth(1)
    ).toHaveText(RegExp('.*fail.*'));

    await assertError(page, 'ProtocolError', true);
  });

  test('control passed', async ({ page }) => {
    await page
      .locator('.singleClientExopForm')
      .locator('.userInteractionContainer')
      .getByRole('textbox')
      .first()
      .fill(whoAmIOid);

    const controlForm = page
      .locator('.singleClientExopForm')
      .getByText('controls')
      .locator('..')
      .locator('..')
      .locator('..');

    await controlForm
      .getByRole('textbox')
      .fill(invalidOid);

    await controlForm
      .getByRole('checkbox')
      .nth(0)
      .check();

    await page
      .locator('.singleClientExop')
      .getByRole('button', { name: 'start' })
      .click();

    await expect(
      page
        .locator('.singleClientExop')
        .locator('.userInteractionContainer')
        .getByText('result')
        .locator('..')
        .getByRole('cell')
        .nth(1)
    ).toHaveText(RegExp('.*fail.*'));

    await assertError(page, 'UnavailableCriticalExtensionError', true);
  });
});
