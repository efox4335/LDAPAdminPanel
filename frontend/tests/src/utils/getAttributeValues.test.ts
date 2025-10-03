import { test, describe, expect } from 'vitest';

import getAttributeValues from '../../../src/utils/getAttributeValues';

describe('getAttributeValues.ts tests', () => {
  test('correct output', () => {
    const data = ',123,  456 ,  789    ,10,11,';

    const res = getAttributeValues(data);

    expect(res).toStrictEqual(['123', '456', '789', '10', '11']);
  });
});
