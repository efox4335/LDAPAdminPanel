import { test, expect, describe } from 'vitest';

import getParentDn from '../../../src/utils/getParentDn';

describe('getParentDn.ts tests', () => {
  test('no parent', () => {
    const res = getParentDn('parent is dse so no comma here');

    expect(res).toStrictEqual('dse');
  });

  test('single comma', () => {
    const res = getParentDn('onlyOne,comma');

    expect(res).toStrictEqual('comma');
  });

  test('multiple commas', () => {
    const res = getParentDn('multiple,commas,here');

    expect(res).toStrictEqual('commas,here');
  });
});
