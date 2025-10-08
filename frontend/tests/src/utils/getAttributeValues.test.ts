import { test, describe, expect } from 'vitest';

import getAttributeValues from '../../../src/utils/getAttributeValues';

describe('getAttributeValues.ts tests', () => {
  test('correct output', () => {
    const data = ',123,  456 ,  789    ,10,11,';

    const res = getAttributeValues(data);

    expect(res).toStrictEqual(['123', '456', '789', '10', '11']);
  });

  test('arr with whitespace', () => {
    const data = '  1, 2  , 3  ';

    const res = getAttributeValues(data);

    expect(res).toStrictEqual(['1', '2', '3']);
  });

  test('single value with whitespace', () => {
    const leadingWhitespace = '   1';

    const noLeadingWhitespace = getAttributeValues(leadingWhitespace);

    expect(noLeadingWhitespace).toStrictEqual(['1']);

    const trailingWhitespace = '1   ';

    const noTrailingWhitespace = getAttributeValues(trailingWhitespace);

    expect(noTrailingWhitespace).toStrictEqual(['1']);

    const bothWhitespace = '  1  ';

    const noWhitespace = getAttributeValues(bothWhitespace);

    expect(noWhitespace).toStrictEqual(['1']);
  });

  test('just whitespace', () => {
    const justWhitespaceArr = '  ,   ,, ';

    const emptyArr = getAttributeValues(justWhitespaceArr);

    expect(emptyArr).toStrictEqual([]);

    const whitespaceVal = '   ';

    expect(getAttributeValues(whitespaceVal)).toStrictEqual([]);
  });
});
