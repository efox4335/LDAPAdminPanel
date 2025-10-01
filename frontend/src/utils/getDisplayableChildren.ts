import type { serverTreeEntry, displayChild } from './types';
import getDisplayDc from './getDisplayDc';

const getDisplayableChildren = (parentDn: string, children: serverTreeEntry[]): displayChild[] => {
  const retArr: displayChild[] = children.reduce((arr: displayChild[], entry: serverTreeEntry) => {
    if (!entry.visible) {
      const visibleChildren = getDisplayableChildren(parentDn, entry.children);

      return arr.concat(visibleChildren);
    }

    return arr.concat([
      {
        displayDc: getDisplayDc(parentDn, entry.dn),
        entry: entry
      }
    ]);
  }, []);

  return retArr;
};

export default getDisplayableChildren;
