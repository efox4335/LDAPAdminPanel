import type { serverTreeEntry, searchRes } from './types';
import { searchClient } from '../services/ldapdbsService';

const getParentDn = (dn: string) => {
  // see https://stackoverflow.com/questions/4607745/split-string-only-on-first-instance-of-specified-character
  const res = dn.split(/,(.*)/s);

  if (res.length === 1) {
    return '';
  }

  return res[1];
};

/*
 * map used otherwise entries with lots of children would slow down the finding of parents
*/
const addEntry = (entryMap: Map<string, serverTreeEntry>, newEntry: serverTreeEntry) => {
  const preExistingEntry = entryMap.get(newEntry.dn);

  if (preExistingEntry !== undefined) {
    preExistingEntry.visible = newEntry.visible;

    if (preExistingEntry.visible === true && newEntry.visible === true) {
      preExistingEntry.entry = newEntry.entry;
    }

    return;
  }

  if (newEntry.dn === '') {
    entryMap.set(newEntry.dn, newEntry);

    return;
  }

  const parentDn = getParentDn(newEntry.dn);

  let parentEntry = entryMap.get(parentDn);

  if (parentEntry === undefined) {
    parentEntry = {
      dn: parentDn,
      visible: false,
      children: []
    };

    addEntry(entryMap, parentEntry);
  }

  parentEntry.children.push(newEntry);

  entryMap.set(newEntry.dn, newEntry);
};

const generateLdapServerTree = async (id: string): Promise<serverTreeEntry> => {
  const entryMap = new Map<string, serverTreeEntry>();

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

  const rootTreeEntry: serverTreeEntry = {
    dn: dseSearch.searchEntries[0].dn,
    visible: true,
    entry: dseSearch.searchEntries[0],
    children: []
  };

  addEntry(entryMap, rootTreeEntry);

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
        children: []
      });
    });
  }

  return rootTreeEntry;
};

export default generateLdapServerTree;
