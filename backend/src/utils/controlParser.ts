import { Control } from 'ldapts';

import { control } from './types';

const controlParser = (args: control): Control[] | undefined => {
  if (args.control === undefined) {
    return undefined;
  }

  if (Array.isArray(args.control)) {
    return args.control.map((controls) => new Control(controls.type, { critical: controls.critical }));
  } else {
    return [new Control(args.control.type, { critical: args.control.critical })];
  }
};

export default controlParser;
