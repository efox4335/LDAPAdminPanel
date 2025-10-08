import { test, expect, describe } from 'vitest';

import parseModifyedAttributes from '../../../src/utils/parseModifiedAttributes';
import type { ldapEntry, newLdapAttribute } from '../../../src/utils/types';

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
      [{ id: '1', attributeName: '', values: [{ id: '1', value: '' }] }],
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
          values: Array.isArray(value) ?
            value.map((val, index) => {
              return {
                id: index.toString(),
                value: val
              };
            }) :
            [{ id: '1', value: value }]
        };
      }),
      testEntry
    );

    expect(res.dn).toStrictEqual(testEntry.dn);

    expect(res.changes.length).toStrictEqual(0);
  });

  test('correct add', () => {
    const newAttributes: newLdapAttribute[] = [
      {
        id: 'abc',
        attributeName: 'newAttribute1',
        values: [{
          id: '1',
          value: ''
        }]
      },
      {
        id: 'abcdefg',
        attributeName: '',
        values: [{
          id: '2',
          value: 'val'
        }]
      },
      {
        id: 'abcd',
        attributeName: 'newAttribute2',
        values: [{
          id: '1',
          value: 'val1'
        },
        {
          id: '2',
          value: 'val2'
        }]
      },
      {
        id: 'abcdef',
        attributeName: 'newAttribute3',
        values: [{
          id: '1',
          value: 'singleval'
        }]
      }
    ];

    const res = parseModifyedAttributes(
      Object.entries(testEntry).map(([key, value], index) => {
        return {
          id: index.toString(),
          attributeName: key,
          values: Array.isArray(value) ?
            value.map((val, index) => {
              return {
                id: index.toString(),
                value: val
              };
            }) :
            [{ id: '1', value: value }]
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
          values: [{
            id: '1',
            value: ''
          }]
        },
        {
          id: '2',
          attributeName: 'taken',
          values: [{
            id: '1',
            value: ''
          }]
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
