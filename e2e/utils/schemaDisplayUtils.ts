import { type Page, type Locator, expect } from '@playwright/test';

import { attributeTypeSchema, ldapSchema, objectClassSchema, schemaType } from './types';

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

const fillNewObjectClassForm = async (page: Page, newSchemaForm: Locator, schema: objectClassSchema, generateOid: boolean) => {
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

export const fillNewAttributeTypeForm = async (page: Page, newSchemaForm: Locator, schema: attributeTypeSchema, generateOid: boolean) => {
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

  if (schema.name !== undefined) {
    const curTableRow = getRowByFirstCellName(page, newSchemaForm, 'names');

    for (const name of schema.name) {
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

  if (schema.superiorAttributeType !== undefined) {
    const curRow = getRowByFirstCellName(page, newSchemaForm, 'superior attribute type');

    await curRow
      .getByRole('textbox')
      .fill(schema.superiorAttributeType);
  }

  if (schema.eqMatchingRule !== undefined) {
    const curRow = getRowByFirstCellName(page, newSchemaForm, 'equality matching rule');

    await curRow
      .getByRole('textbox')
      .fill(schema.eqMatchingRule);
  }

  if (schema.subStrMatchingRule !== undefined) {
    const curRow = getRowByFirstCellName(page, newSchemaForm, 'substring matching rule');

    await curRow
      .getByRole('textbox')
      .fill(schema.subStrMatchingRule);
  }

  if (schema.attributeSyntax !== undefined) {
    if (schema.attributeSyntax.oid !== undefined) {
      const curRow = getRowByFirstCellName(page, newSchemaForm, 'attribute syntax');

      await curRow
        .getByRole('textbox')
        .fill(schema.attributeSyntax.oid);
    }

    if (schema.attributeSyntax.size !== undefined) {
      const curRow = getRowByFirstCellName(page, newSchemaForm, 'attribute size');

      await curRow
        .getByRole('textbox')
        .fill(schema.attributeSyntax.size.toString());
    }
  }

  if (schema.singleValue !== undefined) {
    const curRow = getRowByFirstCellName(page, newSchemaForm, 'single value');

    await curRow
      .locator('select')
      .selectOption(schema.singleValue.toString());
  }

  if (schema.collective !== undefined) {
    const curRow = getRowByFirstCellName(page, newSchemaForm, 'collective');

    await curRow
      .locator('select')
      .selectOption(schema.collective.toString());
  }

  if (schema.noUserMod !== undefined) {
    const curRow = getRowByFirstCellName(page, newSchemaForm, 'no user modification');

    await curRow
      .locator('select')
      .selectOption(schema.noUserMod.toString());
  }

  if (schema.usage !== undefined) {
    const curRow = getRowByFirstCellName(page, newSchemaForm, 'usage');

    await curRow
      .locator('select')
      .selectOption(schema.usage);
  }

  if (schema.extensions !== undefined) {
    const curRow = getRowByFirstCellName(page, newSchemaForm, 'extensions');

    let curExtensionRowNum = 0;

    for (const extension of schema.extensions) {
      const curExtensionRow = curRow
        .getByText('name')
        .nth(curExtensionRowNum)
        .locator('..');

      await curExtensionRow
        .getByText('name')
        .getByRole('textbox')
        .fill(extension.name);

      for (const value of extension.value) {
        await curExtensionRow
          .getByText('value')
          .getByRole('textbox')
          .last()
          .fill(value);
      }

      ++curExtensionRowNum;
    }
  }
};

export const assertAttributeTypeSchemaContents = async (page: Page, openSchemaLocator: Locator, schema: attributeTypeSchema) => {
  if (schema.oid !== undefined) {
    const curRow = getRowByFirstCellName(page, openSchemaLocator, 'oid');

    await expect(curRow.getByText(schema.oid)).toBeVisible();
  }

  if (schema.name !== undefined) {
    const curRow = getRowByFirstCellName(page, openSchemaLocator, 'names');

    for (const name of schema.name) {
      await expect(curRow.getByText(name)).toBeVisible();
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

  if (schema.superiorAttributeType !== undefined) {
    const curRow = getRowByFirstCellName(page, openSchemaLocator, 'superior attribute type');

    await expect(curRow.getByText(schema.superiorAttributeType)).toBeVisible();
  }

  if (schema.eqMatchingRule !== undefined) {
    const curRow = getRowByFirstCellName(page, openSchemaLocator, 'equality matching rule');

    await expect(curRow.getByText(schema.eqMatchingRule)).toBeVisible();
  }

  if (schema.subStrMatchingRule !== undefined) {
    const curRow = getRowByFirstCellName(page, openSchemaLocator, 'substring matching rule');

    await expect(curRow.getByText(schema.subStrMatchingRule)).toBeVisible();
  }

  if (schema.attributeSyntax !== undefined) {
    if (schema.attributeSyntax.oid !== undefined) {
      const curRow = getRowByFirstCellName(page, openSchemaLocator, 'attribute syntax');

      await expect(curRow.getByText(`syntax oid: ${schema.attributeSyntax.oid}`)).toBeVisible();
    }

    if (schema.attributeSyntax.size !== undefined) {
      const curRow = getRowByFirstCellName(page, openSchemaLocator, 'attribute syntax');

      await expect(curRow.getByText(`size: ${schema.attributeSyntax.size}`)).toBeVisible();
    }
  }

  if (schema.singleValue !== undefined) {
    const curRow = getRowByFirstCellName(page, openSchemaLocator, 'single value');

    await expect(curRow.getByText(schema.singleValue.toString())).toBeVisible();
  }

  if (schema.collective !== undefined) {
    const curRow = getRowByFirstCellName(page, openSchemaLocator, 'collective');

    await expect(curRow.getByText(schema.collective.toString())).toBeVisible();
  }

  if (schema.noUserMod !== undefined) {
    const curRow = getRowByFirstCellName(page, openSchemaLocator, 'no user modification');

    await expect(curRow.getByText(schema.noUserMod.toString())).toBeVisible();
  }

  if (schema.usage !== undefined) {
    const curRow = getRowByFirstCellName(page, openSchemaLocator, 'usage');

    await expect(curRow.getByText(schema.usage)).toBeVisible();
  }

  if (schema.extensions !== undefined) {
    const curRow = getRowByFirstCellName(page, openSchemaLocator, 'extensions');

    for (const extension of schema.extensions) {
      const curExtensionRow = curRow
        .getByText(`name: ${extension.name}`)
        .locator('..');

      await expect(curExtensionRow).toBeVisible();

      const curValues = curExtensionRow.getByText('values:');

      for (const value of extension.value) {
        await expect(curValues.getByText(value)).toBeVisible();
      }
    }
  }
};

const setNewSchemaFormSchemaType = async (page: Page, newSchemaForm: Locator, curSchemaType: schemaType) => {
  await newSchemaForm
    .locator('..')
    .locator('select')
    .first()
    .selectOption(curSchemaType);
};

export const fillNewSchemaForm = async (page: Page, newSchemaForm: Locator, schema: ldapSchema, generateOid: boolean) => {
  await setNewSchemaFormSchemaType(page, newSchemaForm, schema.curSchemaType);

  switch (schema.curSchemaType) {
    case 'attributeType':
      await fillNewAttributeTypeForm(page, newSchemaForm, schema, generateOid);

      break;
    case 'objectClass':
      await fillNewObjectClassForm(page, newSchemaForm, schema, generateOid);

      break;
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

export const openSchema = async (schemaDisplay: Locator, schemaName: string, type: schemaType) => {
  let searchText: RegExp = /.*/;

  switch (type) {
    case 'attributeType':
      searchText = /.*search attribute types.*/;

      break;
    case 'objectClass':
      searchText = /.*search object classes.*/;

      break;
  }

  const searchLocation = schemaDisplay
    .locator('.schemaDisplayContainer')
    .first()
    .getByText(searchText);

  await searchLocation
    .getByRole('textbox')
    .fill(schemaName);

  await searchLocation
    .getByRole('button', { name: schemaName })
    .click({ force: true });
};

const assertObjectClassSchemaContents = async (page: Page, openSchemaLocator: Locator, schema: objectClassSchema) => {
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

export const assertSchemaContents = async (page: Page, openSchemaLocator: Locator, schema: ldapSchema) => {
  switch (schema.curSchemaType) {
    case 'objectClass':
      await assertObjectClassSchemaContents(page, openSchemaLocator, schema);

      break;
    case 'attributeType':
      await assertAttributeTypeSchemaContents(page, openSchemaLocator, schema);

      break;
  }
};

export const locateOpenSchema = (page: Page, schemaDisplay: Locator, locAttribute: string, locValue: string): Locator => {
  return schemaDisplay
    .locator('.schemaDisplayContainer')
    .locator('>div')
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
    .locator('..')
    .locator('..')
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
