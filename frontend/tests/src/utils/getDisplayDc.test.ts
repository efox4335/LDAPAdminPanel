import { describe, test, expect } from 'vitest';

import getDisplayDc from '../../../src/utils/getDisplayDc';

describe('getDisplayDc.ts tests', () => {
  test('not found', () => {
    const res = getDisplayDc('not found', 'in this');

    expect(res).toStrictEqual('in this');
  });

  test('included multiple times', () => {
    const res = getDisplayDc('multiple', 'multiple,first,multiple');

    expect(res).toStrictEqual('multiple,first,');
  });

  test('normal', () => {
    const res = getDisplayDc('second', 'firstsecond');

    expect(res).toStrictEqual('first');
  });
});
