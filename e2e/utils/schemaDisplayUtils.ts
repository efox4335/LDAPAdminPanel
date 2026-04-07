import { type Page, type Locator, expect } from '@playwright/test';

import { objectClassSchema } from './types';

export const generateSchemaName = (baseName: string): string => {
  return baseName.concat(Date.now().toString());
};

export const getRowByFirstCellName = (page: Page, baseLoc: Locator, cellName: string): Locator => {
  return baseLoc
    .getByRole('row')
    .locator('>:first-child')
    .filter({
      has:
        page.getByText(cellName)
    })
    .locator('..');
};

export const fillNewSchemaForm = async (page: Page, newSchemaForm: Locator, schema: objectClassSchema, generateOid: boolean) => {
  if (schema.oid !== undefined) {
    const curRow = getRowByFirstCellName(page, newSchemaForm, 'oid');

    await curRow
      .getByRole('textbox')
      .fill(schema.oid);
  }

  if (generateOid) {
    const curRow = getRowByFirstCellName(page, newSchemaForm, 'oid');

    await curRow
      .getByRole('button')
      .click();
  }

  if (schema.names !== undefined) {
    const curTableRow = getRowByFirstCellName(page, newSchemaForm, 'names');

    for (const name of schema.names) {
      await curTableRow
        .getByRole('textbox')
        .last()
        .fill(name);
    }
  }

  if (schema.description !== undefined) {
    const curRow = getRowByFirstCellName(page, newSchemaForm, 'description');

    await curRow
      .getByRole('textbox')
      .fill(schema.description);
  }

  if (schema.obsolete !== undefined) {
    const curRow = getRowByFirstCellName(page, newSchemaForm, 'obsolete');

    await curRow
      .locator('select')
      .selectOption(schema.obsolete.toString());
  }

  if (schema.supObjectClasses !== undefined) {
    const curRow = getRowByFirstCellName(page, newSchemaForm, 'superior object classes');

    for (const supObjectClass of schema.supObjectClasses) {
      await curRow
        .getByRole('textbox')
        .last()
        .fill(supObjectClass);
    }
  }

  if (schema.type !== undefined && schema.type !== 'INPARENT') {
    const curRow = getRowByFirstCellName(page, newSchemaForm, 'type');

    await curRow
      .locator('select')
      .selectOption(schema.type.toLowerCase());
  }

  if (schema.reqAttributes !== undefined) {
    const curRow = getRowByFirstCellName(page, newSchemaForm, 'required attributes');

    for (const reqAttribute of schema.reqAttributes) {
      await curRow
        .getByRole('textbox')
        .last()
        .fill(reqAttribute);
    }
  }

  if (schema.optAttributes !== undefined) {
    const curRow = getRowByFirstCellName(page, newSchemaForm, 'optional attributes');

    for (const optAttribute of schema.optAttributes) {
      await curRow
        .getByRole('textbox')
        .last()
        .fill(optAttribute);
    }
  }
};

export const locateSchemaDisplay = (page: Page): Locator => {
  return page.locator('.schemaDisplayHeader').locator('..');
};

export const toggleSchemaDisplayState = async (schemaDisplay: Locator) => {
  await schemaDisplay
    .locator('.schemaDisplayHeader')
    .getByText(RegExp('.*schemas$'))
    .click();
};

export const clickNewSchemaButton = async (schemaDisplay: Locator) => {
  await schemaDisplay
    .locator('.schemaDisplayHeader')
    .getByRole('button', { name: /new schema/ })
    .click();
};

export const openSchema = async (schemaDisplay: Locator, schemaName: string) => {
  const searchLocation = schemaDisplay
    .locator('.schemaDisplayContainer')
    .first();

  await searchLocation
    .getByRole('textbox')
    .fill(schemaName);

  await searchLocation
    .getByRole('button', { name: schemaName })
    .click({ force: true });
};

export const assertSchemaContents = async (page: Page, openSchemaLocator: Locator, schema: objectClassSchema) => {
  if (schema.oid !== undefined) {
    const curRow = getRowByFirstCellName(page, openSchemaLocator, 'oid');

    await expect(curRow.getByText(schema.oid)).toBeVisible();
  }

  if (schema.names !== undefined) {
    const curRow = getRowByFirstCellName(page, openSchemaLocator, 'names');

    for (const name of schema.names) {
      await expect(curRow.getByText(RegExp(`^${name}$`))).toBeVisible();
    }
  }

  if (schema.description !== undefined) {
    const curRow = getRowByFirstCellName(page, openSchemaLocator, 'description');

    await expect(curRow.getByText(schema.description)).toBeVisible();
  }

  if (schema.obsolete !== undefined) {
    const curRow = getRowByFirstCellName(page, openSchemaLocator, 'obsolete');

    await expect(curRow.getByText(schema.obsolete.toString())).toBeVisible();
  }

  if (schema.supObjectClasses !== undefined) {
    const curRow = getRowByFirstCellName(page, openSchemaLocator, 'superior object classes');

    for (const supObjectClass of schema.supObjectClasses) {
      await expect(curRow.getByText(RegExp(`^${supObjectClass}$`))).toBeVisible();
    }
  }

  if (schema.type !== undefined) {
    const curRow = getRowByFirstCellName(page, openSchemaLocator, 'type');

    await expect(curRow.getByText(schema.type)).toBeVisible();
  }

  if (schema.reqAttributes !== undefined) {
    const curRow = getRowByFirstCellName(page, openSchemaLocator, 'required attributes');

    for (const reqAttribute of schema.reqAttributes) {
      await expect(curRow.getByText(RegExp(`^${reqAttribute}$`))).toBeVisible();
    }
  }

  if (schema.optAttributes !== undefined) {
    const curRow = getRowByFirstCellName(page, openSchemaLocator, 'optional attributes');

    for (const optAttribute of schema.optAttributes) {
      await expect(curRow.getByText(RegExp(`^${optAttribute}$`))).toBeVisible();
    }
  }
};

export const locateOpenSchema = (page: Page, schemaDisplay: Locator, locAttribute: string, locValue: string): Locator => {
  return schemaDisplay
    .locator('.schemaDisplayContainer')
    .locator('div')
    .nth(1)
    .getByRole('table')
    .filter({
      has:
        page
          .getByRole('row')
          .locator('>:first-child')
          .getByText(locAttribute)
          .locator('..')
          .getByText(locValue)
    })
    .locator('..');
};

export const closeOpenSchema = async (openSchemaLocator: Locator) => {
  await openSchemaLocator
    .getByRole('button', { name: 'X' })
    .click();
};

export const closeNewSchemaForm = async (formLoc: Locator) => {
  await formLoc
    .getByRole('button', { name: 'X' })
    .first()
    .click();
};

export const submitSchemaForm = async (formLoc: Locator) => {
  await formLoc
    .getByRole('button', { name: 'add' })
    .click();

  await formLoc
    .getByRole('button', { name: 'confirm' })
    .click();
};
