import { type Page, type Locator, expect } from '@playwright/test';

const locateTreeDisplay = (page: Page): Locator => {
  return page.locator('.ldapTreeDisplayContainer');
};

export const locateEntry = async (page: Page, distinguishedName: string, expandEntries?: boolean): Promise<Locator> => {
  expandEntries = expandEntries || false;

  const treeDisplay = locateTreeDisplay(page);

  if (distinguishedName === 'dse') {
    distinguishedName = '';
  }

  const commonNames = distinguishedName.split(',').reverse();

  let curLocation = treeDisplay
    .locator('.userInteractionContainer')
    .locator('.ldapTreeEntry')
    .first();

  await expect(curLocation).toBeVisible();

  let curCommonName = '';

  for (const commonName of commonNames) {
    if (expandEntries) {
      const curVisButton = curLocation.locator('.ldapEntryVisibilityToggle').first().getByText('+');

      if (await curVisButton.isVisible()) {
        await curVisButton.click();
      }
    }

    if (curCommonName.length > 0) {
      curCommonName = commonName + ',' + curCommonName;
    } else {
      curCommonName = commonName;
    }

    const nextLocation = curLocation
      .locator('>.ldapTreeEntryChildren')
      .locator('>.ldapTreeEntry')
      .locator('>button')
      .filter({ has: page.getByText(new RegExp(`^${curCommonName}$`)) })
      .locator('..');

    try {
      await expect(nextLocation).toBeVisible({ timeout: 500 });

      curLocation = nextLocation;

      curCommonName = '';
    } catch { /* waiting required because entry may not immediately visible */ }
  }

  if (curCommonName !== '') {
    throw new Error(`no entry for ${distinguishedName} located`);
  }

  return curLocation;
};

export const openEntry = async (page: Page, distinguishedName: string) => {
  const entry = await locateEntry(page, distinguishedName, true);
  await entry
    .getByRole('button')
    .nth(1)
    .click();
};

export const collapseEntry = async (page: Page, curEntry: Locator) => {
  const displayToggleButton = curEntry.locator('.ldapEntryVisibilityToggle').first().getByText('-');

  if (await displayToggleButton.isVisible()) {
    await displayToggleButton.click();
  }
};

export const expandEntry = async (page: Page, curEntry: Locator) => {
  const displayToggleButton = curEntry.locator('.ldapEntryVisibilityToggle').first().getByText('+');

  if (await displayToggleButton.isVisible()) {
    await displayToggleButton.click();
  }
};
