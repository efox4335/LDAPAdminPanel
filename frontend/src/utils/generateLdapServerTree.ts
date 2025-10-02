import type { serverTreeEntry, searchRes } from './types';
import { searchClient } from '../services/ldapdbsService';

const getParentDn = (dn: string) => {
  // see https://stackoverflow.com/questions/4607745/split-string-only-on-first-instance-of-specified-character
  const res = dn.split(/,(.*)/s);

  if (res.length === 1) {
    return 'dse';
  }

  return res[1];
};

/*
 * map used otherwise entries with lots of children would slow down the finding of parents
*/
const addEntry = (entryMap: Record<string, serverTreeEntry>, newEntry: serverTreeEntry) => {
  if (newEntry.dn in entryMap) {
    const preExistingEntry = entryMap[newEntry.dn];

    preExistingEntry.visible = newEntry.visible;

    if (preExistingEntry.visible === true && newEntry.visible === true) {
      preExistingEntry.entry = newEntry.entry;
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

  const dseSearch: searchRes = await searchClient(id, {
    baseDn: '',
    options: {
      scope: 'base',
      filter: '(objectClass=*)',
      derefAliases: 'always',
      sizeLimit: 0,
      timeLimit: 0,
      paged: false,
      attributes: ['*', '+']
    }
  });

  const rootTreeEntry: Extract<serverTreeEntry, { visible: true }> = {
    dn: 'dse',
    visible: true,
    entry: dseSearch.searchEntries[0],
    children: {}
  };

  entryMap[rootTreeEntry.dn] = rootTreeEntry;

  if (!dseSearch.searchEntries[0].namingContexts) {
    throw new Error('root DSE has no namingContexts');
  }

  let ditNamingContexts: string[];

  if (Array.isArray(dseSearch.searchEntries[0].namingContexts)) {
    ditNamingContexts = dseSearch.searchEntries[0].namingContexts;
  } else {
    ditNamingContexts = [dseSearch.searchEntries[0].namingContexts];
  }

  for (const dit of ditNamingContexts) {
    const ditSearch = await searchClient(id, {
      baseDn: dit,
      options: {
        scope: 'sub',
        filter: '(objectClass=*)',
        derefAliases: 'always',
        sizeLimit: 0,
        timeLimit: 0,
        paged: false,
        attributes: ['*', '+']
      }
    });

    ditSearch.searchEntries.forEach((entry) => {
      addEntry(entryMap, {
        dn: entry.dn,
        visible: true,
        entry: entry,
        children: {}
      });
    });
  }

  return entryMap;
};

export default generateLdapServerTree;
