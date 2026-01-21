import { type Page, type Locator, expect } from '@playwright/test';

import type { entryAttribute, ldapControl, ldapEntry, modification } from './types';
import locateTableByHeaderText from './locateTableByHeader';

export const locateOpenEntryDisplay = (page: Page): Locator => {
  return page.locator('.openEntriesContainer');
};

export const locateOpenEntry = (page: Page, distinguishedName: string): Locator => {
  const openEntries = locateOpenEntryDisplay(page);

  const entryDnRowLocater = page
    .getByRole('row')
    .locator('>:first-child')
    .filter({ has: page.getByText(/^dn$/) })
    .locator('..')
    .locator('>:last-child')
    .filter({ has: page.getByText(new RegExp(`^${distinguishedName}$`)) });

  return openEntries
    .locator('.singleOpenEntry')
    .filter({ has: entryDnRowLocater });
};

export const closeEntry = async (page: Page, distinguishedName: string) => {
  const entry = locateOpenEntry(page, distinguishedName);

  await entry.getByRole('button', { name: 'X' }).click();
};

export const clickNewChildButton = async (page: Page, distinguishedName: string) => {
  const entry = locateOpenEntry(page, distinguishedName);

  await entry
    .getByRole('button', { name: 'new child' })
    .click();
};

export const clickResetButton = async (form: Locator) => {
  await form
    .getByRole('button', { name: 'reset' })
    .click();
};

export const clickCancelButton = async (form: Locator) => {
  await form
    .getByRole('button', { name: 'cancel' })
    .click();
};

const locateFormAttributeRow = async (page: Page, entryForm: Locator, attributeName: string) => {
  const attributeTable = locateTableByHeaderText(page, entryForm, 'attribute');

  const nonInputAttributeRow = attributeTable
    .getByRole('row')
    .locator('>:first-child')
    .filter({ has: page.getByText(RegExp(`^${attributeName}$`)) })
    .locator('..');


  if (await nonInputAttributeRow.count() != 0) {
    return nonInputAttributeRow;
  }

  const attributeRows = attributeTable
    .getByRole('row');

  let curChild = 0;

  for (const singleAttributeRow of await attributeRows.all()) {
    try {
      await expect(singleAttributeRow.locator('>:first-child').getByRole('textbox')).toHaveValue(RegExp(`^${attributeName}$`), { timeout: 100 });

      return attributeRows.nth(curChild);
    } catch { /* only one expect has to not error */ } finally { curChild += 1; }
  }

  throw new Error(`no row for ${attributeName} found`);
};

const locateNewControl = async (page: Page, controlTable: Locator, controlOid: string) => {
  let curChild = 0;

  const controlRows = controlTable.getByRole('row');

  for (const singleControlRow of await controlRows.all()) {
    try {
      await expect(singleControlRow.getByRole('textbox')).toHaveValue(RegExp(`^${controlOid}$`), { timeout: 100 });

      return controlRows.nth(curChild);
    } catch { /* only one expect has to not error */ } finally { curChild += 1; }
  }

  throw new Error(`no control for oid ${controlOid} found`);
};

const locateFormAttributeValue = async (newAttributeRow: Locator, value: string) => {
  const curValueCells = newAttributeRow
    .locator('>:last-child')
    .locator('input');

  for (const curInput of await curValueCells.all()) {
    try {
      await expect(curInput).toHaveValue(RegExp(`^${value}$`), { timeout: 100 });

      return curInput.locator('..');
    } catch { /* only one expect has to not error */ }
  }

  throw new Error(`no value ${value} found`);
};

export const deleteNewEntryAttribute = async (page: Page, newEntryForm: Locator, attributeName: string) => {
  const attributeRow = await locateFormAttributeRow(page, newEntryForm, attributeName);

  if (!attributeRow) {
    throw new Error(`no row for attribute ${attributeName}`);
  }

  await attributeRow
    .locator('>:first-child')
    .getByRole('button')
    .click();
};

export const deleteNewEntryValue = async (page: Page, newEntryForm: Locator, attributeName: string, value: string) => {
  const attributeRow = await locateFormAttributeRow(page, newEntryForm, attributeName);

  if (!attributeRow) {
    throw new Error(`no row for attribute ${attributeName}`);
  }

  const valueLocation = await locateFormAttributeValue(attributeRow, value);

  if (!valueLocation) {
    throw new Error(`no value ${value} found for ${attributeName}`);
  }

  await valueLocation.getByRole('button').click();
};

export const assertNewEntryFormContents = async (page: Page, newEntryForm: Locator, entryAttributes: entryAttribute[], controls: ldapControl[]) => {
  for (const attribute of entryAttributes) {
    const curAttributeRow = await locateFormAttributeRow(page, newEntryForm, attribute.name);

    for (const value of attribute.values) {
      try {
        await locateFormAttributeValue(curAttributeRow, value);
      } catch {
        throw new Error(`attribute with name ${attribute.name} did not contain value ${value}`);
      }
    }
  }

  const controlTable = locateTableByHeaderText(page, newEntryForm, 'controls');

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

export const clickNewEntryButton = async (page: Page) => {
  const openEntriesDisplay = locateOpenEntryDisplay(page);

  await openEntriesDisplay
    .getByRole('button', { name: 'new entry' })
    .click();
};

export const deleteNewEntryControl = async (page: Page, newEntryForm: Locator, controlOid: string) => {
  const controlRow = await locateNewControl(page, newEntryForm, controlOid);

  if (!controlRow) {
    throw new Error(`no control found for oid ${controlOid}`);
  }

  await controlRow.getByRole('button').click();
};

export const openDeleteForm = async (page: Page, dn: string) => {
  const openEntry = locateOpenEntry(page, dn);

  await openEntry.getByRole('button', { name: 'delete' }).click();
};

export const cancelDelete = async (page: Page, dn: string) => {
  const curDelConfirm = locateOpenEntryDisplay(page)
    .locator('form')
    .filter({ has: page.getByText(`delete ${dn} forever`) });

  await curDelConfirm.getByRole('button', { name: 'cancel' }).click();
};

export const deleteOpenEntry = async (page: Page, distinguishedName: string, controls: ldapControl[]) => {
  await openDeleteForm(page, distinguishedName);

  const delEntryForm = locateOpenEntryDisplay(page).locator('form');

  const controlTable = delEntryForm.getByRole('table');

  for (const control of controls) {
    await expect(controlTable.getByRole('row')).toHaveCount(2);

    const curControlRowNum = await controlTable.getByRole('row').count() - 1;

    console.log(curControlRowNum);

    const curControlRow = controlTable.getByRole('row').nth(curControlRowNum);

    await curControlRow.getByRole('textbox').fill(control.oid);

    if (control.critical) {
      await curControlRow.getByRole('checkbox').check();
    }
  }

  const curDelConfirm = locateOpenEntryDisplay(page)
    .locator('form')
    .filter({ has: page.getByText(`delete ${distinguishedName} forever`) });

  await curDelConfirm.getByRole('button', { name: 'delete' }).click();
};

export const fillNewEntry = async (page: Page, newEntryForm: Locator, entryAttributes: entryAttribute[], controls: ldapControl[]) => {
  const attributeTable = locateTableByHeaderText(page, newEntryForm, 'attribute');

  for (const ldapAttribute of entryAttributes) {
    if (ldapAttribute.name === 'dn') {
      if (!ldapAttribute.values[0]) {
        continue;
      }

      await attributeTable
        .getByRole('row')
        .locator('>:first-child')
        .filter({ has: page.getByText(/^dn$/) })
        .locator('..')
        .getByRole('textbox')
        .fill(ldapAttribute.values[0]);
    } else if (ldapAttribute.name === 'objectClass') {
      const objectClassRow = attributeTable
        .getByRole('row')
        .locator('>:first-child')
        .filter({ has: page.getByText(/^objectClass$/) })
        .locator('..');

      for (const value of ldapAttribute.values) {
        await objectClassRow
          .getByRole('textbox')
          .last()
          .fill(value);
      }
    } else {
      const curAttributeRowNum = await attributeTable.getByRole('row').count() - 1;

      const curAttributeRow = attributeTable.getByRole('row').nth(curAttributeRowNum);

      await curAttributeRow
        .getByRole('textbox')
        .first()
        .fill(ldapAttribute.name);

      const valueCell = curAttributeRow.locator('>td').last();

      for (const value of ldapAttribute.values) {
        const curValueInputNum = await valueCell.getByRole('textbox').count() - 1;

        await valueCell
          .getByRole('textbox')
          .nth(curValueInputNum)
          .fill(value);
      }
    }
  }

  const controlTable = locateTableByHeaderText(page, newEntryForm, 'controls');

  for (const control of controls) {
    const curControlRowNum = await controlTable.getByRole('row').count() - 1;

    const curControlRow = controlTable.getByRole('row').nth(curControlRowNum);

    await curControlRow.getByRole('textbox').fill(control.oid);

    if (control.critical) {
      await curControlRow.getByRole('checkbox').check();
    }
  }
};

export const submitNewEntry = async (page: Page, newEntryForm: Locator) => {
  await newEntryForm
    .getByRole('button', { name: 'add' })
    .click();
};

export const assertEntryContents = async (page: Page, entry: ldapEntry) => {
  const entryLocation = locateOpenEntry(page, entry.dn);

  await expect(entryLocation).toBeVisible();

  for (const attribute of entry.attributes) {
    const attributeRow = entryLocation
      .getByRole('row')
      .locator('>:first-child')
      .filter({ has: page.getByText(new RegExp(`^${attribute.name}$`)) })
      .locator('..');

    await expect(attributeRow).toBeVisible();
    await expect(attributeRow).toHaveCount(1);

    for (const value of attribute.values) {
      await expect(attributeRow.locator(':last-child').getByText(new RegExp(`^${value}$`))).toBeVisible();
    }
  }
};

export const addNewEntry = async (page: Page, entry: entryAttribute[], controls: ldapControl[]) => {
  await clickNewEntryButton(page);

  const openEntryDisplay = locateOpenEntryDisplay(page);

  const newEntryForm = openEntryDisplay.locator('form');

  await fillNewEntry(page, newEntryForm, entry, controls);

  await submitNewEntry(page, newEntryForm);
};

export const clickModifyButton = async (entryLocation: Locator) => {
  await entryLocation
    .getByRole('button', { name: 'modify' })
    .click();
};

export const fillModifyForm = async (
  page: Page,
  modifyForm: Locator,
  modifyEntry: modification[],
  modifyBodyControls: ldapControl[],
  modifyDnControls: ldapControl[]
) => {
  const attributeTable = locateTableByHeaderText(page, modifyForm, 'attribute');

  for (const attribute of modifyEntry) {
    switch (attribute.type) {
      case 'add': {
        const rowNum = await attributeTable
          .getByRole('row')
          .count() - 1;

        const curRow = attributeTable
          .getByRole('row')
          .nth(rowNum);

        await curRow
          .locator('>:first-child')
          .getByRole('textbox')
          .fill(attribute.attribute.name);

        for (const curValue of attribute.attribute.values) {
          await curRow
            .locator('>:last-child')
            .getByRole('textbox')
            .last()
            .fill(curValue);
        }
        break;
      }
      case 'append': {
        const curRow = await locateFormAttributeRow(page, attributeTable, attribute.attribute.name);

        for (const curValue of attribute.attribute.values) {
          await curRow
            .locator('>:last-child')
            .getByRole('textbox')
            .last()
            .fill(curValue);
        }
        break;
      }
      case 'deleteAttribute': {
        const curRow = await locateFormAttributeRow(page, attributeTable, attribute.name);

        await curRow
          .locator('>:first-child')
          .getByRole('button')
          .click();
        break;
      }
      case 'deleteValues': {
        const curRow = await locateFormAttributeRow(page, attributeTable, attribute.attribute.name);

        for (const curValue of attribute.attribute.values) {
          const valueLocation = await locateFormAttributeValue(curRow, curValue);

          await valueLocation
            .getByRole('button')
            .click();
        }
        break;
      }
      case 'truncate': {
        if (attribute.attribute.name === 'dn') {
          const newDn = attribute.attribute.values[0];

          if (typeof (newDn) !== 'string') {
            throw new Error('no new dn');
          }

          await attributeTable
            .getByRole('row')
            .filter({
              has: page
                .getByText(/^dn$/)
            })
            .first()
            .getByRole('textbox')
            .fill(newDn);
        } else {
          const curRow = await locateFormAttributeRow(page, attributeTable, attribute.attribute.name);

          const valueDelButtons = curRow
            .locator('>:last-child')
            .getByRole('button');

          let delButtonCount = await valueDelButtons.count();

          while (delButtonCount > 1) {
            await valueDelButtons
              .first()
              .click();

            delButtonCount = await valueDelButtons.count();
          }

          for (const curValue of attribute.attribute.values) {
            await curRow
              .locator('>:last-child')
              .getByRole('textbox')
              .last()
              .fill(curValue);
          }
        }

        break;
      }
    }
  }

  const modifyBodyControlTable = locateTableByHeaderText(page, modifyForm, 'modify controls');

  for (const control of modifyBodyControls) {
    const rowNum = await modifyBodyControlTable
      .getByRole('row')
      .count() - 1;

    await modifyBodyControlTable
      .getByRole('row')
      .nth(rowNum)
      .getByRole('textbox')
      .fill(control.oid);

    if (control.critical) {
      await modifyBodyControlTable
        .getByRole('row')
        .nth(rowNum)
        .getByRole('checkbox')
        .check();
    }
  }

  const modifyDnControlTable = locateTableByHeaderText(page, modifyForm, 'modify dn controls');

  for (const control of modifyDnControls) {
    const rowNum = await modifyDnControlTable
      .getByRole('row')
      .count() - 1;

    await modifyDnControlTable
      .getByRole('row')
      .nth(rowNum)
      .getByRole('textbox')
      .fill(control.oid);

    if (control.critical) {
      await modifyDnControlTable
        .getByRole('row')
        .nth(rowNum)
        .getByRole('checkbox')
        .check();
    }
  }
};

export const assertModifyFormContents = async (
  page: Page,
  modifyForm: Locator,
  entryAttributes: entryAttribute[],
  modifyBodyControls: ldapControl[],
  modifyDnControls: ldapControl[]
) => {
  for (const attribute of entryAttributes) {
    const curAttributeRow = await locateFormAttributeRow(page, modifyForm, attribute.name);

    for (const value of attribute.values) {
      try {
        await locateFormAttributeValue(curAttributeRow, value);
      } catch {
        throw new Error(`attribute with name ${attribute.name} did not contain value ${value}`);
      }
    }
  }

  const modifyBodyControlTable = locateTableByHeaderText(page, modifyForm, 'modify controls');

  for (const control of modifyBodyControls) {
    const curControlRow = await locateNewControl(page, modifyBodyControlTable, control.oid);

    if (!curControlRow) {
      throw new Error(`no control for oid ${control.oid}`);
    }

    if (control.critical) {
      await expect(curControlRow.getByRole('checkbox')).toBeChecked();
    } else {
      await expect(curControlRow.getByRole('checkbox')).not.toBeChecked();
    }
  }

  const modifyDnControlTable = locateTableByHeaderText(page, modifyForm, 'modify dn controls');

  for (const control of modifyDnControls) {
    const curControlRow = await locateNewControl(page, modifyDnControlTable, control.oid);

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

export const clickSaveButton = async (form: Locator) => {
  await form
    .getByRole('button', { name: 'save' })
    .click();
};
