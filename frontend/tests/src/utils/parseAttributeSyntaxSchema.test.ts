import { describe, test, expect } from 'vitest';
import parseAttributeSyntaxSchema from '../../../src/utils/parseAttributeSyntaxSchema';
import type { attributeSyntaxSchema } from '../../../src/utils/types';
import assertArrayEqual from './assertArrayEqual';

const testData: {
  input: string,
  output: attributeSyntaxSchema
}[] = [
    {
      input: '( 1.3.6.1.4.1.1466.115.121.1.8 DESC \'Certificate\' X-BINARY-TRANSFER-REQUIRED \'TRUE\' X-NOT-HUMAN-READABLE \'TRUE\' )',
      output: {
        oid: '1.3.6.1.4.1.1466.115.121.1.8',
        description: 'Certificate',
        extensions: [
          {
            name: 'X-BINARY-TRANSFER-REQUIRED',
            value: [
              'TRUE'
            ]
          },
          {
            name: 'X-NOT-HUMAN-READABLE',
            value: [
              'TRUE'
            ]
          }
        ]
      }
    },
    {
      input: '( 1.3.6.1.4.1.1466.115.121.1.8 DESC \'Certificate\' )',
      output: {
        oid: '1.3.6.1.4.1.1466.115.121.1.8',
        description: 'Certificate',
        extensions: undefined
      }
    },
    {
      input: '( 1.3.6.1.4.1.1466.115.121.1.8 )',
      output: {
        oid: '1.3.6.1.4.1.1466.115.121.1.8',
        description: undefined,
        extensions: undefined
      }
    }
  ];

describe('parseAttributeSyntaxSchema.ts tests', () => {
  test('parse tests', () => {
    testData.forEach((testItem) => {
      const result = parseAttributeSyntaxSchema(testItem.input);

      expect(result.oid).toStrictEqual(testItem.output.oid);

      expect(result.description).toStrictEqual(testItem.output.description);

      assertArrayEqual(result.extensions, testItem.output.extensions, (ext) => ext.name, (ele1, ele2) => {
        if (ele1.name !== ele2.name) {
          return false;
        }

        assertArrayEqual(ele1.value, ele2.value, (arrEle) => arrEle, (arrEle1, arrEle2) => arrEle1 === arrEle2);

        return true;
      });
    });
  });
});
