import { test, describe, expect } from 'vitest';

import getAttributeValues from '../../../src/utils/getAttributeValues';

describe('getAttributeValues.ts tests', () => {
  test('correct output', () => {
    const data = ['', '123', '456', '789', '', '10', '11', ''].map((ele, index) => { return { id: index.toString(), value: ele }; });

    const res = getAttributeValues(data);

    expect(res).toStrictEqual(['123', '456', '789', '10', '11']);
  });

  test('empty arr', () => {
    expect(getAttributeValues([])).toStrictEqual(['']);
  });

  test('multiple empty values', () => {
    const data = ['', '', ''].map((ele, index) => { return { id: index.toString(), value: ele }; });

    expect(getAttributeValues(data)).toStrictEqual(['']);
  });
});
