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
        name: undefined
      }
    },
    {
      rawSchema: '(oid NAME \'abc\')',
      result: {
        oid: 'oid',
        name: [
          'abc'
        ]
      }
    },
    {
      rawSchema: '(   curOid  NAME ( \'abc\' $ \'def\'))',
      result: {
        oid: 'curOid',
        name: [
          'abc',
          'def'
        ]
      }
    }
  ];

describe('parseAttributeSchema.ts tests', () => {
  test('parse tests', () => {
    testData.forEach((value) => {
      const curResult = parseAttributeTypeSchema(value.rawSchema);

      expect(value.result.oid).toStrictEqual(curResult.oid);

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
