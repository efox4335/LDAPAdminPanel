import type { serverTreeEntry } from './types';
import { fetchAllLdapEntries } from './query';
import getParentDn from './getParentDn';

/*
 * map used otherwise entries with lots of children would slow down the finding of parents
*/
const addEntry = (entryMap: Record<string, serverTreeEntry>, newEntry: serverTreeEntry) => {
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

  if (newEntry.dn === 'dse') {
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

    addEntry(entryMap, parentEntry);
  }

  const parentEntry = entryMap[parentDn];

  parentEntry.children[newEntry.dn] = newEntry.dn;

  entryMap[newEntry.dn] = newEntry;
};

const generateLdapServerTree = async (id: string): Promise<Record<string, serverTreeEntry>> => {
  const entryMap: Record<string, serverTreeEntry> = {};

  const entryArr = await fetchAllLdapEntries(id);

  entryArr.forEach((entry) => {
    addEntry(entryMap, {
      dn: entry.visibleEntry.dn,
      visible: true,
      entry: entry.visibleEntry,
      operationalEntry: entry.operationalEntry,
      children: {}
    });
  });

  return entryMap;
};

export default generateLdapServerTree;
