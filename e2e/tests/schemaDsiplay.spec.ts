import { test, expect } from '@playwright/test';

import { addServer, adminBind, configAdminBind, navToPage, removeServer, unbind } from '../utils/preTestUtils';
import {
  assertSchemaContents,
  clickNewSchemaButton,
  closeNewSchemaForm,
  closeOpenSchema,
  fillNewSchemaForm,
  locateOpenSchema,
  locateSchemaDisplay,
  openSchema,
  toggleSchemaDisplayState,
  getRowByFirstCellName,
  submitSchemaForm,
  generateSchemaName
} from '../utils/schemaDisplayUtils';
import { defaultNewObjectClassSchema, defaultNewObjectClassTestEntry, invalidNewSchemaAttribute, pilotPersonSchema, simpleSecurityObjectSchema } from '../utils/constants';
import assertError from '../utils/assertError';
import { addNewEntry, assertEntryContents, deleteOpenEntry } from '../utils/openEntryUtils';
import { openEntry } from '../utils/treeDisplayUtils';

test.describe('schema display tests', () => {
  test.beforeEach(async ({ page }) => {
    await navToPage(page);

    await addServer(page);
  });

  test.afterEach(async ({ page }) => {
    await removeServer(page);
  });

  test('unconnected schema display hidden', async ({ page }) => {
    const schemaDisplay = locateSchemaDisplay(page);

    await expect(schemaDisplay).toBeHidden();
  });

  test.describe('config admin', () => {
    test.beforeEach(async ({ page }) => {
      await configAdminBind(page);
    });

    test.afterEach(async ({ page }) => {
      await unbind(page);
    });

    test('schema display visible', async ({ page }) => {
      const schemaDisplay = locateSchemaDisplay(page);

      await toggleSchemaDisplayState(schemaDisplay);

      await expect(schemaDisplay).toBeVisible();
    });

    test.describe('schema display open', () => {
      test.beforeEach(async ({ page }) => {
        await toggleSchemaDisplayState(locateSchemaDisplay(page));
      });

      test('schema can be added and entry can be created', async ({ page }) => {
        const schemaDisplay = locateSchemaDisplay(page);

        await clickNewSchemaButton(schemaDisplay);

        const curForm = schemaDisplay.locator('form');

        const curSchemaName = generateSchemaName('testSchema');

        const curSchema = {
          ...defaultNewObjectClassSchema,
          names: [
            curSchemaName
          ]
        };

        await fillNewSchemaForm(
          page,
          curForm,
          curSchema,
          true
        );

        await submitSchemaForm(curForm);

        const curSchemaLoc = locateOpenSchema(page, schemaDisplay, 'names', curSchemaName);

        await assertSchemaContents(page, curSchemaLoc, curSchema);

        await unbind(page);

        await adminBind(page);

        const curTestEntry = {
          ...defaultNewObjectClassTestEntry,
          attributes: [
            ...defaultNewObjectClassTestEntry.attributes,
            {
              name: 'objectClass',
              values: [
                curSchemaName
              ]
            }
          ]
        };

        await addNewEntry(page, curTestEntry.attributes, []);

        await openEntry(page, curTestEntry.dn);

        await assertEntryContents(page, curTestEntry);

        await deleteOpenEntry(page, curTestEntry.dn, []);
      });

      test('generate oid warning', async ({ page }) => {
        const schemaDisplay = locateSchemaDisplay(page);

        await clickNewSchemaButton(schemaDisplay);

        const curForm = schemaDisplay.locator('form');

        await fillNewSchemaForm(page, curForm, {}, true);

        await expect(
          curForm
            .getByText(RegExp('.*generating oids may be a bad idea as oids are meant to be globally unique.*'))
        ).toBeVisible();

        await curForm
          .getByRole('button', { name: 'dismiss' })
          .click();

        await expect(
          curForm
            .getByText(RegExp('.*generating oids may be a bad idea as oids are meant to be globally unique.*'))
        ).toBeHidden();
      });

      test('new schema form can be closed', async ({ page }) => {
        const schemaDisplay = locateSchemaDisplay(page);

        await clickNewSchemaButton(schemaDisplay);

        const formDiv = schemaDisplay
          .locator('form')
          .locator('..');

        await closeNewSchemaForm(formDiv);

        await expect(formDiv).toBeHidden();
      });

      test('schema can be closed', async ({ page }) => {
        const schemaDisplay = locateSchemaDisplay(page);

        const schemaName = pilotPersonSchema.oid as string;

        await openSchema(schemaDisplay, schemaName);

        const curSchema = locateOpenSchema(page, schemaDisplay, 'oid', schemaName);

        await expect(curSchema).toBeVisible();

        await closeOpenSchema(curSchema);

        await expect(curSchema).toBeHidden();
      });

      test('invalid attribute error passed', async ({ page }) => {
        const schemaDisplay = locateSchemaDisplay(page);

        await clickNewSchemaButton(schemaDisplay);

        const curForm = schemaDisplay.locator('form');

        await fillNewSchemaForm(
          page,
          curForm,
          {
            ...defaultNewObjectClassSchema,
            reqAttributes: [
              ...defaultNewObjectClassSchema.reqAttributes as string[],
              invalidNewSchemaAttribute
            ]
          },
          true
        );

        await submitSchemaForm(curForm);

        await assertError(page, 'user-defined ObjectClass includes operational attributes', true);
      });

      test('invalid superior object class error passed', async ({ page }) => {
        const schemaDisplay = locateSchemaDisplay(page);

        await clickNewSchemaButton(schemaDisplay);

        const curForm = schemaDisplay.locator('form');

        await fillNewSchemaForm(
          page,
          curForm,
          {
            ...defaultNewObjectClassSchema,
            supObjectClasses: [
              'pkiUser'
            ]
          },
          true
        );

        await submitSchemaForm(curForm);

        await assertError(page, ' user-defined ObjectClass has inappropriate SUPerior: "pkiUser"', true);
      });

      test('invalid attributes not in auto compelete', async ({ page }) => {
        const schemaDisplay = locateSchemaDisplay(page);

        await clickNewSchemaButton(schemaDisplay);

        const curForm = schemaDisplay.locator('form');

        await fillNewSchemaForm(page, curForm, { reqAttributes: [invalidNewSchemaAttribute] }, false);

        await expect(curForm.getByRole('button', { name: invalidNewSchemaAttribute })).toBeHidden();
      });

      test('reset to default works', async ({ page }) => {
        const schemaDisplay = locateSchemaDisplay(page);

        await clickNewSchemaButton(schemaDisplay);

        const curForm = schemaDisplay.locator('form');

        await fillNewSchemaForm(page, curForm, {
          oid: '13223',
          names: [
            'abc',
            'def'
          ],
          description: 'testDesc',
          obsolete: false,
          supObjectClasses: [
            'abc'
          ],
          type: 'AUXILIARY',
          reqAttributes: [
            'abc',
            'def'
          ],
          optAttributes: [
            'abc',
            'def'
          ]
        }, false);

        await curForm
          .getByRole('button', { name: 'reset' })
          .click();

        const oidRow = getRowByFirstCellName(page, curForm, 'oid');

        await expect(oidRow.getByRole('textbox')).toHaveValue('');

        const namesRow = getRowByFirstCellName(page, curForm, 'names');

        await expect(namesRow.getByRole('textbox')).toHaveCount(1);

        await expect(namesRow.getByRole('textbox')).toHaveValue('');

        const descRow = getRowByFirstCellName(page, curForm, 'description');

        await expect(descRow.getByRole('textbox')).toHaveValue('');

        const obsRow = getRowByFirstCellName(page, curForm, 'obsolete');

        await expect(obsRow.locator('select')).toHaveValue('false');

        const subObjClassRow = getRowByFirstCellName(page, curForm, 'superior object classes');

        await expect(subObjClassRow.getByRole('textbox')).toHaveCount(2);

        await expect(subObjClassRow.getByRole('textbox').first()).toHaveValue('top');

        await expect(subObjClassRow.getByRole('textbox').last()).toHaveValue('');

        const typeRow = getRowByFirstCellName(page, curForm, 'type');

        await expect(typeRow.locator('select')).toHaveValue('STRUCTURAL');

        const reqRow = getRowByFirstCellName(page, curForm, 'required attributes');

        await expect(reqRow.getByRole('textbox')).toHaveValue('');

        const optRow = getRowByFirstCellName(page, curForm, 'optional attributes');

        await expect(optRow.getByRole('textbox')).toHaveValue('');
      });

      test('top is added as superior object class', async ({ page }) => {
        const schemaDisplay = locateSchemaDisplay(page);

        await clickNewSchemaButton(schemaDisplay);

        const curForm = schemaDisplay.locator('form');

        const subObjClassRow = getRowByFirstCellName(page, curForm, 'superior object classes');

        await expect(subObjClassRow.getByRole('textbox')).toHaveCount(2);

        await expect(subObjClassRow.getByRole('textbox').first()).toHaveValue('top');

        await expect(subObjClassRow.getByRole('textbox').last()).toHaveValue('');
      });

      test('object class schema can be viewed', async ({ page }) => {
        const schemaDisplay = locateSchemaDisplay(page);

        const pilotOid = pilotPersonSchema.oid as string;

        await openSchema(schemaDisplay, pilotOid);

        const pilotSchemaLoc = locateOpenSchema(page, schemaDisplay, 'oid', pilotOid);

        await assertSchemaContents(page, pilotSchemaLoc, pilotPersonSchema);

        const secOid = simpleSecurityObjectSchema.oid as string;

        await openSchema(schemaDisplay, secOid);

        const secSchemaLoc = locateOpenSchema(page, schemaDisplay, 'oid', secOid);

        await assertSchemaContents(page, secSchemaLoc, simpleSecurityObjectSchema);
      });
    });
  });
});
