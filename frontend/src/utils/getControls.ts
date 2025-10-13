import type { controlObject, newControlObject } from './types';

const getControls = (newControls: newControlObject[]): controlObject[] | undefined => {
  const filteredControls = newControls.filter((control) => control.type !== '');

  if (filteredControls.length === 0) {
    return undefined;
  }

  return filteredControls.map((control) => {
    return {
      type: control.type,
      critical: control.critical
    };
  });
};

export default getControls;
