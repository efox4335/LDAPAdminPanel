import { test, expect, describe } from 'vitest';

import parseModifyedAttributes from '../../../src/utils/parseModifiedAttributes';
import type { ldapEntry } from '../../../src/utils/types';

const testEntry: ldapEntry = {
  dn: 'testDn',
  objectClass: 'testObjectClass',
  staticAttribute: 'static',
  changingAttribute: 'not this',
  arrAttribute: [
    'val1',
    'val2'
  ]
};

describe('parseModifiedAttributes.ts tests', () => {
  test('empty array passed', () => {
    const res = parseModifyedAttributes([], testEntry);

    expect(res.dn).toStrictEqual(testEntry.dn);

    expect(res.changes.length).toBeGreaterThan(0);

    expect(res.changes.length).toStrictEqual(
      Object.keys(testEntry).length - 1
    );

    res.changes.forEach((change) => {
      expect(change.operation).toStrictEqual('delete');
      expect(change.type).not.toStrictEqual('dn');
      expect(change.values.length).toStrictEqual(0);
    });
  });

  test('empty attributeName passed', () => {
    const res = parseModifyedAttributes(
      [{ id: '1', attributeName: '', value: '' }],
      testEntry
    );

    expect(res.dn).toStrictEqual(testEntry.dn);

    expect(res.changes.length).toBeGreaterThan(0);

    expect(res.changes.length).toStrictEqual(
      Object.keys(testEntry).length - 1
    );

    res.changes.forEach((change) => {
      expect(change.operation).toStrictEqual('delete');
      expect(change.type).not.toStrictEqual('dn');
      expect(change.type).not.toStrictEqual('');
      expect(change.values.length).toStrictEqual(0);
    });
  });

  test('no changes', () => {
    const res = parseModifyedAttributes(
      Object.entries(testEntry).map(([key, value], index) => {
        return {
          id: index.toString(),
          attributeName: key,
          value: Array.isArray(value) ?
            value.join('  ,') :
            value
        };
      }),
      testEntry
    );

    expect(res.dn).toStrictEqual(testEntry.dn);

    expect(res.changes.length).toStrictEqual(0);
  });

  test('correct add', () => {
    const newAttributes = [
      {
        id: 'abc',
        attributeName: 'newAttribute1',
        value: ''
      },
      {
        id: 'abcdefg',
        attributeName: '',
        value: 'val'
      },
      {
        id: 'abcd',
        attributeName: 'newAttribute2',
        value: 'val1,  val2'
      },
      {
        id: 'abcdef',
        attributeName: 'newAttribute3',
        value: 'singleval'
      }
    ];

    const res = parseModifyedAttributes(
      Object.entries(testEntry).map(([key, value], index) => {
        return {
          id: index.toString(),
          attributeName: key,
          value: Array.isArray(value) ?
            value.join('  ,') :
            value
        };
      }).concat(newAttributes),
      testEntry
    );

    expect(res.dn).toStrictEqual(testEntry.dn);

    expect(res.changes.length).toStrictEqual(newAttributes.length - 1);

    res.changes.forEach((change) => {
      expect(res.changes.filter((ch) => ch.type !== change.type).length).toStrictEqual(newAttributes.length - 2);
    });
  });

  test('duplicate attribute name', () => {
    try {
      parseModifyedAttributes([
        {
          id: '1',
          attributeName: 'taken',
          value: ''
        },
        {
          id: '2',
          attributeName: 'taken',
          value: ''
        }
      ], testEntry);

      throw new Error('no error');
    } catch (err) {
      if (!(err instanceof Error)) {
        throw err;
      }

      expect(err.message).toStrictEqual('duplicate attribute name: taken');
    }
  });
});
