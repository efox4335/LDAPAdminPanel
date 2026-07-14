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
import { defaultNewAttributeTypeSchema, defaultNewObjectClassSchema, defaultNewObjectClassTestEntry, invalidNewSchemaAttribute, pilotPersonSchema, simpleSecurityObjectSchema, testAttributeTypes } from '../utils/constants';
import assertError from '../utils/assertError';
import { addNewEntry, assertEntryContents, deleteOpenEntry } from '../utils/openEntryUtils';
import { openEntry } from '../utils/treeDisplayUtils';
import { attributeTypeSchema } from '../utils/types';

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

      test('new schema form can be closed', async ({ page }) => {
        const schemaDisplay = locateSchemaDisplay(page);

        await clickNewSchemaButton(schemaDisplay);

        const formDiv = schemaDisplay
          .locator('form');

        await closeNewSchemaForm(formDiv);

        await expect(formDiv).toBeHidden();
      });

      test.describe('attribute type schema tests', () => {
        test('schema can be added', async ({ page }) => {
          const schemaDisplay = locateSchemaDisplay(page);

          await clickNewSchemaButton(schemaDisplay);

          const curForm = schemaDisplay.locator('form');

          const curSchemaName = generateSchemaName('testSchema');

          const curSchema = {
            ...defaultNewAttributeTypeSchema,
            name: [
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
        });

        test('generate oid warning', async ({ page }) => {
          const schemaDisplay = locateSchemaDisplay(page);

          await clickNewSchemaButton(schemaDisplay);

          const curForm = schemaDisplay.locator('form');

          await fillNewSchemaForm(page, curForm, { curSchemaType: 'attributeType' }, true);

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

        test('schema can be closed', async ({ page }) => {
          const schemaDisplay = locateSchemaDisplay(page);

          const schemaName = testAttributeTypes[0]?.oid as string;

          console.log(schemaName);

          await openSchema(schemaDisplay, schemaName, 'attributeType');

          const curSchema = locateOpenSchema(page, schemaDisplay, 'oid', schemaName);

          await expect(curSchema).toBeVisible();

          await closeOpenSchema(curSchema);

          await expect(curSchema).toBeHidden();
        });

        test('reset to default works', async ({ page }) => {
          const schemaDisplay = locateSchemaDisplay(page);

          await clickNewSchemaButton(schemaDisplay);

          const curForm = schemaDisplay.locator('form');

          const curSchema: attributeTypeSchema = {
            curSchemaType: 'attributeType',
            oid: '123',
            name: [
              'abc',
              'def'
            ],
            description: 'abc',
            obsolete: true,
            superiorAttributeType: 'abc',
            eqMatchingRule: 'abc',
            ordMatchingRule: 'abc',
            subStrMatchingRule: 'abc',
            attributeSyntax: {
              oid: 'ac',
              size: 67
            },
            singleValue: true,
            collective: true,
            noUserMod: true,
            usage: 'USERAPPLICATIONS',
            extensions: [
              {
                name: '67676',
                value: [
                  '939',
                  '1010'
                ]
              },
              {
                name: '676762',
                value: [
                  '9392',
                  '10102'
                ]
              }
            ]
          };

          await fillNewSchemaForm(
            page,
            curForm,
            curSchema,
            true
          );

          await curForm
            .getByRole('button', { name: 'reset' })
            .click();

          const oidRow = getRowByFirstCellName(page, curForm, 'oid');

          await expect(oidRow.getByRole('textbox')).toHaveValue('');

          const nameRow = getRowByFirstCellName(page, curForm, 'names');

          await expect(nameRow.getByRole('textbox')).toHaveCount(1);

          await expect(nameRow.getByRole('textbox')).toHaveValue('');

          const descRow = getRowByFirstCellName(page, curForm, 'description');

          await expect(descRow.getByRole('textbox')).toHaveValue('');

          const obsoleteRow = getRowByFirstCellName(page, curForm, 'obsolete');

          await expect(obsoleteRow.locator('select')).toHaveValue('false');

          const supAttrRow = getRowByFirstCellName(page, curForm, 'superior attribute type');

          await expect(supAttrRow.getByRole('textbox')).toHaveValue('');

          const eqRow = getRowByFirstCellName(page, curForm, 'equality matching rule');

          await expect(eqRow.getByRole('textbox')).toHaveValue('');

          const subStrRow = getRowByFirstCellName(page, curForm, 'substring matching rule');

          await expect(subStrRow.getByRole('textbox')).toHaveValue('');

          const attrRow = getRowByFirstCellName(page, curForm, 'attribute syntax');

          await expect(attrRow.getByRole('textbox')).toHaveValue('');

          const sizeRow = getRowByFirstCellName(page, curForm, 'attribute size');

          await expect(sizeRow.getByRole('textbox')).toHaveValue('');

          const singleValueRow = getRowByFirstCellName(page, curForm, 'single value');

          await expect(singleValueRow.locator('select')).toHaveValue('false');

          const collRow = getRowByFirstCellName(page, curForm, 'collective');

          await expect(collRow.locator('select')).toHaveValue('false');

          const useModRow = getRowByFirstCellName(page, curForm, 'no user modification');

          await expect(useModRow.locator('select')).toHaveValue('false');

          const usageRow = getRowByFirstCellName(page, curForm, 'usage');

          await expect(usageRow.locator('select')).toHaveValue('none');

          const extensionRow = getRowByFirstCellName(page, curForm, 'extensions');

          await expect(extensionRow.getByRole('textbox')).toHaveCount(2);

          await expect(extensionRow.getByRole('textbox').first()).toHaveValue('');

          await expect(extensionRow.getByRole('textbox').last()).toHaveValue('');
        });

        test('schema can be viewed', async ({ page }) => {
          const schemaDisplay = locateSchemaDisplay(page);

          for (const schema of testAttributeTypes) {
            const schemaName = schema.oid as string;

            await openSchema(schemaDisplay, schemaName, 'attributeType');

            const schemaLoc = locateOpenSchema(page, schemaDisplay, 'oid', schemaName);

            await assertSchemaContents(page, schemaLoc, schema);
          }
        });
      });

      test.describe('object class schema tests', () => {
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

          await fillNewSchemaForm(page, curForm, { curSchemaType: 'objectClass' }, true);

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

        test('schema can be closed', async ({ page }) => {
          const schemaDisplay = locateSchemaDisplay(page);

          const schemaName = pilotPersonSchema.oid as string;

          await openSchema(schemaDisplay, schemaName, 'objectClass');

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

          await fillNewSchemaForm(page, curForm, {
            curSchemaType: 'objectClass',
            reqAttributes: [invalidNewSchemaAttribute]
          }, false);

          await expect(curForm.getByRole('button', { name: invalidNewSchemaAttribute })).toBeHidden();
        });

        test('reset to default works', async ({ page }) => {
          const schemaDisplay = locateSchemaDisplay(page);

          await clickNewSchemaButton(schemaDisplay);

          const curForm = schemaDisplay.locator('form');

          await fillNewSchemaForm(page, curForm, {
            curSchemaType: 'objectClass',
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

        test('schema can be viewed', async ({ page }) => {
          const schemaDisplay = locateSchemaDisplay(page);

          const pilotOid = pilotPersonSchema.oid as string;

          await openSchema(schemaDisplay, pilotOid, 'objectClass');

          const pilotSchemaLoc = locateOpenSchema(page, schemaDisplay, 'oid', pilotOid);

          await assertSchemaContents(page, pilotSchemaLoc, pilotPersonSchema);

          const secOid = simpleSecurityObjectSchema.oid as string;

          await openSchema(schemaDisplay, secOid, 'objectClass');

          const secSchemaLoc = locateOpenSchema(page, schemaDisplay, 'oid', secOid);

          await assertSchemaContents(page, secSchemaLoc, simpleSecurityObjectSchema);
        });
      });
    });
  });
});
