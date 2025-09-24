import { Control } from 'ldapts';

import { control } from './types';

const controlParser = (args: control): Control[] | undefined => {
  if (args.control === undefined) {
    return undefined;
  }

  return args.control.map((controls) => new Control(controls.type, { critical: controls.critical }));
};

export default controlParser;
