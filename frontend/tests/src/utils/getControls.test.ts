import { describe, expect, test } from 'vitest';

import getControls from '../../../src/utils/getControls';
import type { newControlObject } from '../../../src/utils/types';

const testControls: newControlObject[] = [
  {
    type: 'abc',
    critical: true,
    id: '1'
  },
  {
    type: 'def',
    critical: false,
    id: '2'
  },
  {
    type: '',
    critical: true,
    id: '4'
  },
  {
    type: 'ghi',
    critical: false,
    id: '3'
  },
  {
    type: '',
    critical: false,
    id: '6'
  }
];

describe('getControls.ts tests', () => {
  test('empty arr', () => {
    const res = getControls([]);

    expect(res).not.toBeDefined();
  });

  test('correct output', () => {
    const res = getControls(testControls);

    expect(res).toBeDefined();
    if (!res) {
      return;
    }

    res.forEach((control) => {
      expect(control.type).not.toStrictEqual('');
      expect(testControls.find((c) => c.type === control.type)).toBeDefined();
      expect(control.critical).toStrictEqual(testControls.find((c) => c.type === control.type)?.critical);
    });
  });
});
