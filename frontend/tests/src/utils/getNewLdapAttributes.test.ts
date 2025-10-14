import { test, describe, expect } from 'vitest';

import type { ldapEntry } from '../../../src/utils/types';
import getNewLdapAttributes from '../../../src/utils/getNewLdapAttributes';

const testEntry: ldapEntry = {
  dn: 'dn',
  objectClass: ['object', 'Class'],
  singleValue: 'single value',
  arrValue: ['this', 'is', 'an', 'array'],
  spChar: '+_,.- =/<>?\\|:\'";`~!@#$%^&*()',
  spCharArr: ['+_,.- =/<>?\\|:\\', '|:\'";`~!@#$%^&*()']
};

describe('getNewLdapAttributes.ts tests', () => {
  test('correct test', () => {
    const res = getNewLdapAttributes(testEntry);

    expect(res.length).toStrictEqual(Object.entries(testEntry).length - 1);

    res.forEach((attr) => {
      expect(attr.attributeName).not.toStrictEqual('dn');

      expect(Array.isArray(attr.values)).toStrictEqual(true);

      attr.values.forEach((ele) => {
        const entryValues: string[] = Array.isArray(testEntry[attr.attributeName]) ?
          testEntry[attr.attributeName] as string[] : [testEntry[attr.attributeName]] as string[];

        expect(ele.value).toStrictEqual(entryValues.find((val) => val === ele.value));
      });
    });
  });
});
