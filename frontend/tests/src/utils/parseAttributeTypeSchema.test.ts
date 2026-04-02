import { test, expect, describe } from 'vitest';

import parseAttributeTypeSchema from '../../../src/utils/parseAttributeTypeSchema';
import type { attributeTypeSchema } from '../../../src/utils/types';

const testData: {
  rawSchema: string,
  result: attributeTypeSchema
}[] = [
    {
      rawSchema: '(oid)',
      result: {
        oid: 'oid',
        name: undefined,
        noUserMod: false
      }
    },
    {
      rawSchema: '(oid NAME \'abc\')',
      result: {
        oid: 'oid',
        name: [
          'abc'
        ],
        noUserMod: false
      }
    },
    {
      rawSchema: '(   curOid  NAME ( \'abc\' $ \'def\'))',
      result: {
        oid: 'curOid',
        name: [
          'abc',
          'def'
        ],
        noUserMod: false
      }
    },
    {
      rawSchema: '(   curOid  NAME ( \'abc\' $ \'def\') NO-USER-MODIFICATION)',
      result: {
        oid: 'curOid',
        name: [
          'abc',
          'def'
        ],
        noUserMod: true
      }
    },
    {
      rawSchema: '( 2.5.18.3 NAME \'creatorsName\' DESC \'RFC4512: name of creator\' EQUALITY distinguishedNameMatch SYNTAX 1.3.6.1.4.1.1466.115.121.1.12 SINGLE-VALUE NO-USER-MODIFICATION USAGE directoryOperation )',
      result: {
        oid: '2.5.18.3',
        name: [
          'creatorsName'
        ],
        noUserMod: true
      }
    }
  ];

describe('parseAttributeSchema.ts tests', () => {
  test('parse tests', () => {
    testData.forEach((value) => {
      const curResult = parseAttributeTypeSchema(value.rawSchema);

      expect(value.result.oid).toStrictEqual(curResult.oid);

      expect(value.result.noUserMod).toStrictEqual(curResult.noUserMod);

      if (value.result.name === undefined) {
        expect(curResult.name).toBeUndefined();
      } else if (curResult.name) {
        expect(value.result.name.length).toStrictEqual(curResult.name.length);

        for (const expectedName of value.result.name) {
          const found = curResult.name.find((val) => val === expectedName);

          if (found === undefined) {
            throw new Error(`name ${expectedName} not found in parsed data`);
          }
        }
      } else {
        expect(curResult.name).toBeDefined();
      }
    });
  });
});
