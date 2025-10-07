/*
 * my justifaction for not just using a lib is that ldap structures the data really bad and i don't need a lot of the fancy features of a query lib
*/
import { searchClient } from '../services/ldapdbsService';
import type { ldapEntry, operationalLdapEntry, searchReq } from './types';

const baseVisibleTreeSearch: searchReq = {
  baseDn: '',
  options: {
    scope: 'sub',
    filter: '(objectClass=*)',
    derefAliases: 'always',
    sizeLimit: 0,
    timeLimit: 0,
    paged: false,
    attributes: ['*']
  }
};

const baseOperationalTreeSearch: searchReq = {
  baseDn: '',
  options: {
    scope: 'sub',
    filter: '(objectClass=*)',
    derefAliases: 'always',
    sizeLimit: 0,
    timeLimit: 0,
    paged: false,
    attributes: ['+']
  }
};

const baseVisibleEntrySearch: searchReq = {
  baseDn: '',
  options: {
    scope: 'base',
    filter: '(objectClass=*)',
    derefAliases: 'always',
    sizeLimit: 0,
    timeLimit: 0,
    paged: false,
    attributes: ['*']
  }
};

const baseOperationalEntrySearch: searchReq = {
  baseDn: '',
  options: {
    scope: 'base',
    filter: '(objectClass=*)',
    derefAliases: 'always',
    sizeLimit: 0,
    timeLimit: 0,
    paged: false,
    attributes: ['+']
  }
};

export const fetchAllLdapEntries = async (clientId: string): Promise<{ visibleEntry: ldapEntry; operationalEntry: operationalLdapEntry; }[]> => {
  const entries: { visibleEntry: ldapEntry, operationalEntry: operationalLdapEntry }[] = [];

  const visibleDseRes = await searchClient(clientId, baseVisibleEntrySearch);
  const operationalDseRes = await searchClient(clientId, baseOperationalEntrySearch);

  if (visibleDseRes.searchEntries.length !== 1 || operationalDseRes.searchEntries.length !== 1) {
    throw new Error('failed to locate root dse');
  }

  if (!('dn' in visibleDseRes.searchEntries[0]) || !('dn' in operationalDseRes.searchEntries[0])) {
    throw new Error('root dse does not have dn');
  }

  if (!('objectClass' in visibleDseRes.searchEntries[0])) {
    throw new Error('root dse does not have objectClass');
  }

  const visibleDse = visibleDseRes.searchEntries[0] as ldapEntry;
  const operationalDse = operationalDseRes.searchEntries[0] as operationalLdapEntry;

  delete visibleDse['*'];
  delete operationalDse['+'];

  entries.push({ visibleEntry: visibleDse, operationalEntry: operationalDse });

  if (!operationalDse.namingContexts) {
    throw new Error('root dse does not have namingContexts');
  }

  let ditNamingContexts: string[];

  if (Array.isArray(operationalDse.namingContexts)) {
    ditNamingContexts = operationalDse.namingContexts;
  } else {
    ditNamingContexts = [operationalDse.namingContexts];
  }

  for (const dit of ditNamingContexts) {
    const visibleTreeRes = await searchClient(clientId, { ...baseVisibleTreeSearch, baseDn: dit });
    const operationalTreeRes = await searchClient(clientId, { ...baseOperationalTreeSearch, baseDn: dit });

    const entryMap: Record<string, { visibleEntry: ldapEntry, operationalEntry: operationalLdapEntry }> = {};

    visibleTreeRes.searchEntries.forEach((ele) => {
      if (!ele.dn || typeof (ele.dn) !== 'string') {
        throw new Error('entry does not have dn');
      }

      if (!ele.objectClass) {
        throw new Error('entry does not have objectClass');
      }

      delete ele['*'];

      entryMap[ele.dn] = {
        visibleEntry: ele as ldapEntry,
        operationalEntry: {}
      };
    });

    operationalTreeRes.searchEntries.forEach((ele) => {
      if (!ele.dn || typeof (ele.dn) !== 'string') {
        throw new Error('entry does not have dn');
      }

      delete ele['+'];

      entryMap[ele.dn].operationalEntry = ele;
    });

    Object.values(entryMap).forEach((entry) => {
      entries.push(entry);
    });
  }

  return entries;
};

export const fetchLdapEntry = async (clientId: string, dn: string): Promise<{ visibleEntry: ldapEntry; operationalEntry: operationalLdapEntry; }> => {
  const visibleEntryRes = await searchClient(clientId, {
    ...baseVisibleEntrySearch,
    baseDn: dn
  });

  const operationalEntryRes = await searchClient(clientId, {
    ...baseOperationalEntrySearch,
    baseDn: dn
  });

  if (visibleEntryRes.searchEntries.length !== 1 || operationalEntryRes.searchEntries.length !== 1) {
    throw new Error('failed to find entry');
  }

  const visibleEntry = visibleEntryRes.searchEntries[0];

  if (!visibleEntry.dn || typeof (visibleEntry.dn) !== 'string') {
    throw new Error('entry does not have dn');
  }

  if (!visibleEntry.objectClass) {
    throw new Error('entry does not have objectClass');
  }

  delete visibleEntry['*'];
  delete operationalEntryRes.searchEntries[0]['+'];

  return {
    visibleEntry: visibleEntry as ldapEntry,
    operationalEntry: operationalEntryRes.searchEntries[0]
  };
};
