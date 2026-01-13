import { type Page, type Locator, expect } from '@playwright/test';

import type { ldapEntry } from './types';

const locateOpenEntryDisplay = (page: Page): Locator => {
  return page.locator('.openEntriesContainer');
};

export const locateOpenEntry = (page: Page, distinguishedName: string): Locator => {
  const openEntries = locateOpenEntryDisplay(page);

  const entryDnRowLocater = page
    .getByRole('row')
    .locator('css=:first-child')
    .filter({ has: page.getByText(/^dn$/) })
    .locator('..')
    .locator('css=:last-child')
    .filter({ has: page.getByText(new RegExp(`^${distinguishedName}$`)) });

  return openEntries
    .locator('.singleOpenEntry')
    .filter({ has: entryDnRowLocater });
};

export const closeEntry = async (page: Page, distinguishedName: string) => {
  const entry = locateOpenEntry(page, distinguishedName);

  await entry.getByRole('button', { name: 'X' }).click();
};

export const assertEntryContents = async (page: Page, entry: ldapEntry) => {
  const entryLocation = locateOpenEntry(page, entry.dn);

  await expect(entryLocation).toBeVisible();

  for (const attribute of entry.attributes) {
    const attributeRow = entryLocation
      .getByRole('row')
      .locator(':first-child')
      .filter({ has: page.getByText(new RegExp(`^${attribute.name}$`)) })
      .locator('..');

    await expect(attributeRow).toBeVisible();
    await expect(attributeRow).toHaveCount(1);

    for (const value of attribute.values) {
      await expect(attributeRow.locator(':last-child').getByText(new RegExp(`^${value}$`))).toBeVisible();
    }
  }
};
