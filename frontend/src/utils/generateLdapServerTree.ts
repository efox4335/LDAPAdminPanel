import type { queryFetchRes, serverTreeEntry } from './types';
import getParentDn from './getParentDn';

/*
 * map used otherwise entries with lots of children would slow down the finding of parents
*/
const addEntry = (entryMap: Record<string, serverTreeEntry>, newEntry: serverTreeEntry, treeRoot: string) => {
  if (newEntry.dn === '') {
    newEntry.dn = 'dse';
  }

  if (newEntry.dn in entryMap) {
    const preExistingEntry = entryMap[newEntry.dn];

    preExistingEntry.visible = newEntry.visible;

    if (preExistingEntry.visible === true && newEntry.visible === true) {
      preExistingEntry.entry = newEntry.entry;
      preExistingEntry.operationalEntry = newEntry.operationalEntry;
    }

    return;
  }

  if (newEntry.dn === 'dse' || newEntry.dn === treeRoot) {
    entryMap[newEntry.dn] = newEntry;

    return;
  }

  const parentDn = getParentDn(newEntry.dn);

  if (!(parentDn in entryMap)) {
    const parentEntry: serverTreeEntry = {
      dn: parentDn,
      visible: false,
      children: {}
    };

    addEntry(entryMap, parentEntry, treeRoot);
  }

  const parentEntry = entryMap[parentDn];

  parentEntry.children[newEntry.dn] = newEntry.dn;

  entryMap[newEntry.dn] = newEntry;
};

const generateLdapServerTree = (entryArr: queryFetchRes[], treeRoot: string): Record<string, serverTreeEntry> => {
  const entryMap: Record<string, serverTreeEntry> = {};

  entryArr.forEach((entry) => {
    addEntry(entryMap, {
      dn: entry.visibleEntry.dn,
      isExpanded: false,
      visible: true,
      entry: entry.visibleEntry,
      operationalEntry: entry.operationalEntry,
      children: {}
    }, treeRoot);
  });

  return entryMap;
};

export default generateLdapServerTree;
