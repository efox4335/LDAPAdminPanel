import { Change, Attribute } from 'ldapts';

import type { modifyReqChange } from './types';

const changeParser = (changes: modifyReqChange[]) => {
  return changes.map((change) => {
    return new Change({
      operation: change.operation,
      modification: new Attribute({ type: change.type, values: change.values })
    });
  });
};

export default changeParser;
