import { type Page, type Locator, expect } from '@playwright/test';

import type { ldapControl, ldapSearch } from './types';
import locateTableByHeaderText from './locateTableByHeader';
import locateNewControl from './locateNewControl';
import expandAdvancedOptions from './expandAdvancedOptions';

export const locateSearchForm = (page: Page): Locator => {
  return page
    .locator('.singleClientSearch')
    .locator('form');
};

export const assertAdvancedOptionsOpen = async (page: Page) => {
  const searchForm = locateSearchForm(page);

  await expect(locateTableByHeaderText(page, searchForm, 'controls')).toBeVisible();
};

export const assertAdvancedOptionsClosed = async (page: Page) => {
  const searchForm = locateSearchForm(page);

  await expect(locateTableByHeaderText(page, searchForm, 'controls')).toBeHidden();
};

export const fillSearchForm = async (page: Page, search: ldapSearch, controls: ldapControl[]) => {
  const searchForm = locateSearchForm(page);

  try {
    await expandAdvancedOptions(searchForm);
  } catch { /* error is fine */ }

  if (search.name) {
    await searchForm
      .getByRole('row')
      .filter({
        has: page
          .getByRole('cell', { name: /^name$/ })
      })
      .getByRole('textbox')
      .fill(search.name);
  }

  if (search.filter) {
    await searchForm
      .getByRole('row')
      .filter({
        has: page
          .getByRole('cell', { name: /^ldap filter$/ })
      })
      .getByRole('textbox')
      .fill(search.filter);
  }

  if (search.timeLimit) {
    await searchForm
      .getByRole('row')
      .filter({
        has: page
          .getByRole('cell', { name: /^time limit.*/ })
      })
      .getByRole('textbox')
      .fill(search.timeLimit);
  }

  if (search.maxEntries) {
    await searchForm
      .getByRole('row')
      .filter({
        has: page
          .getByRole('cell', { name: /^max entries.*/ })
      })
      .getByRole('textbox')
      .fill(search.maxEntries);
  }

  if (search.scope) {
    await searchForm
      .getByRole('row')
      .filter({
        has: page
          .getByRole('cell', { name: /^scope$/ })
      })
      .getByLabel(search.scope)
      .click();
  }

  if (search.aliasDeref) {
    await searchForm
      .getByRole('row')
      .filter({
        has: page
          .getByRole('cell', { name: /^alias dereferencing$/ })
      })
      .getByLabel(search.aliasDeref)
      .click();
  }

  if (search.baseDns) {
    const baseDnsRow = searchForm
      .getByRole('row')
      .filter({
        has: page.getByRole('cell', { name: /^base dns$/ })
      });

    let curTextBoxNum = 0;

    for (const baseDn of search.baseDns) {
      await baseDnsRow
        .getByRole('textbox')
        .nth(curTextBoxNum)
        .fill(baseDn);

      curTextBoxNum += 1;
    }
  }

  const controlTable = locateTableByHeaderText(page, searchForm, 'controls');

  await expect(controlTable).toBeVisible();

  let curRowNum = 0;

  for (const control of controls) {
    await controlTable
      .getByRole('textbox')
      .nth(curRowNum)
      .fill(control.oid);

    if (control.critical) {
      await controlTable
        .getByRole('checkbox')
        .nth(curRowNum)
        .check();
    }

    curRowNum += 1;
  }
};

export const assertSearchFormContents = async (page: Page, search: ldapSearch, controls: ldapControl[]) => {
  const searchForm = locateSearchForm(page);

  try {
    await expandAdvancedOptions(searchForm);
  } catch { /* error is fine */ }

  if (typeof (search.name) === 'string') {
    await expect(searchForm
      .getByRole('row')
      .filter({
        has: page
          .getByRole('cell', { name: /^name$/ })
      })
      .getByRole('textbox'))
      .toHaveValue(search.name);
  }

  if (typeof (search.filter) === 'string') {
    await expect(searchForm
      .getByRole('row')
      .filter({
        has: page
          .getByRole('cell', { name: /^ldap filter$/ })
      })
      .getByRole('textbox'))
      .toHaveValue(search.filter);
  }

  if (search.timeLimit) {
    await expect(searchForm
      .getByRole('row')
      .filter({
        has: page
          .getByRole('cell', { name: /^time limit.*/ })
      })
      .getByRole('textbox'))
      .toHaveValue(search.timeLimit);
  }

  if (search.maxEntries) {
    await expect(searchForm
      .getByRole('row')
      .filter({
        has: page
          .getByRole('cell', { name: /^max entries.*/ })
      })
      .getByRole('textbox'))
      .toHaveValue(search.maxEntries);
  }

  if (typeof (search.scope) === 'string') {
    await expect(searchForm
      .getByRole('row')
      .filter({
        has: page
          .getByRole('cell', { name: /^scope$/ })
      })
      .getByLabel(search.scope))
      .toBeChecked();
  }

  if (search.aliasDeref) {
    await expect(searchForm
      .getByRole('row')
      .filter({
        has: page
          .getByRole('cell', { name: /^alias dereferencing$/ })
      })
      .getByLabel(search.aliasDeref))
      .toBeChecked();
  }

  if (search.baseDns) {
    const baseDnsRow = searchForm
      .getByRole('row')
      .filter({
        has: page.getByRole('cell', { name: /^base dns$/ })
      });

    for (const baseDn of search.baseDns) {
      let curChild = 0;

      const baseDnInputs = baseDnsRow.getByRole('textbox');

      for (const singleBaseDnInput of await baseDnInputs.all()) {
        try {
          await expect(singleBaseDnInput).toHaveValue(RegExp(`^${baseDn}$`), { timeout: 100 });

          break;
        } catch { /* only one expect has to not error */ } finally { curChild += 1; }
      }

      await expect(baseDnInputs.nth(curChild)).toBeVisible();
    }
  }

  const controlTable = locateTableByHeaderText(page, searchForm, 'controls');

  await expect(controlTable).toBeVisible();

  for (const control of controls) {
    const curControlRow = await locateNewControl(page, controlTable, control.oid);

    if (!curControlRow) {
      throw new Error(`no control for oid ${control.oid}`);
    }

    if (control.critical) {
      await expect(curControlRow.getByRole('checkbox')).toBeChecked();
    } else {
      await expect(curControlRow.getByRole('checkbox')).not.toBeChecked();
    }
  }
};

export const clickResetBaseFormButton = async (page: Page) => {
  const searchForm = locateSearchForm(page);

  try {
    await assertAdvancedOptionsOpen(page);

    await searchForm
      .getByRole('button', { name: /^reset$/ })
      .last()
      .click();
  } catch {
    await searchForm
      .getByRole('button', { name: /^reset$/ })
      .click();
  }
};

export const clickResetAdvancedFormButton = async (page: Page) => {
  const searchForm = locateSearchForm(page);

  try {
    await assertAdvancedOptionsOpen(page);

    await searchForm
      .getByRole('button', { name: /^reset$/ })
      .first()
      .click();
  } catch {
    await searchForm
      .getByRole('button', { name: /^reset$/ })
      .click();
  }
};

export const clickSearchButton = async (page: Page) => {
  const searchForm = locateSearchForm(page);

  await searchForm
    .getByRole('button', { name: /^search$/ })
    .click();
};
