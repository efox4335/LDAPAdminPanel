import { type Page, type Locator, expect } from '@playwright/test';

const locateTreeDisplay = (page: Page): Locator => {
  return page.locator('.ldapTreeDisplayContainer');
};

export const locateEntry = async (page: Page, distinguishedName: string, expandEntries?: boolean): Promise<Locator> => {
  expandEntries = expandEntries || false;

  const treeDisplay = locateTreeDisplay(page);

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
      .locator('.ldapTreeEntryChildren>*')
      .filter({ has: page.getByText(new RegExp(`^${curCommonName}$`)) });

    try {
      await expect(nextLocation).toBeVisible({ timeout: 100 });

      curLocation = nextLocation.locator('..');

      curCommonName = '';
    } catch { /* waiting required because entry may not immediately visible */ }
  }

  if (curCommonName !== '') {
    throw new Error(`no entry for ${distinguishedName} located`);
  }

  return curLocation;
};

export const collapseEntry = async (page: Page, distinguishedName: string) => {
  const curEntry = await locateEntry(page, distinguishedName);

  const displayToggleButton = curEntry.locator('.ldapEntryVisibilityToggle').first().getByText('-');

  if (await displayToggleButton.isVisible()) {
    await displayToggleButton.click();
  }
};

export const expandEntry = async (page: Page, distinguishedName: string) => {
  const curEntry = await locateEntry(page, distinguishedName);

  const displayToggleButton = curEntry.locator('.ldapEntryVisibilityToggle').first().getByText('+');

  if (await displayToggleButton.isVisible()) {
    await displayToggleButton.click();
  }
};

export const defaultTreeEntries = [
  'dc=example,dc=org',
  'ou=users,dc=example,dc=org',
  'ou=groups,dc=example,dc=org',
  'cn=user01,ou=users,dc=example,dc=org',
  'cn=user02,ou=users,dc=example,dc=org',
  'cn=readers,ou=groups,dc=example,dc=org',
];
