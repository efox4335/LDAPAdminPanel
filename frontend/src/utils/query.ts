/*
 * my justifaction for not just using a lib is that ldap structures the data really bad and i don't need a lot of the fancy features of a query lib
*/
import { searchClient } from '../services/ldapdbsService';
import type { ldapEntry, searchReq, queryFetchRes } from './types';

const baseVisibleChildSearch: searchReq = {
  baseDn: '',
  options: {
    scope: 'one',
    filter: '(objectClass=*)',
    derefAliases: 'always',
    sizeLimit: 0,
    timeLimit: 0,
    paged: false,
    attributes: ['*']
  }
};

const baseOperationalChildSearch: searchReq = {
  baseDn: '',
  options: {
    scope: 'one',
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

export const fetchLdapChildren = async (clientId: string, dn: string): Promise<queryFetchRes[]> => {
  const visibleChildrenRes = await searchClient(clientId, {
    ...baseVisibleChildSearch,
    baseDn: dn
  });

  const operationalChildrenRes = await searchClient(clientId, {
    ...baseOperationalChildSearch,
    baseDn: dn
  });

  if (visibleChildrenRes.searchEntries.length === 0 || operationalChildrenRes.searchEntries.length === 0) {
    return [];
  }

  const entryMap: Record<string, queryFetchRes> = {};

  const entries: queryFetchRes[] = [];

  visibleChildrenRes.searchEntries.forEach((entry) => {
    if (typeof (entry.dn) !== 'string') {
      throw new Error('entry does not have dn');
    }

    if (!entry.objectClass || (!Array.isArray(entry.objectClass) && typeof (entry.objectClass) !== 'string')) {
      throw new Error('entry does not have objectClass');
    }

    delete entry['*'];

    entryMap[entry.dn] = {
      visibleEntry: entry as ldapEntry,
      operationalEntry: {}
    };
  });

  operationalChildrenRes.searchEntries.forEach((entry) => {
    if (typeof (entry.dn) !== 'string') {
      throw new Error('entry does not have dn');
    }

    delete entry['+'];

    entryMap[entry.dn].operationalEntry = entry;
  });

  Object.values(entryMap).forEach((entry) => {
    entries.push(entry);
  });

  return entries;
};

export const fetchLdapEntry = async (clientId: string, dn: string): Promise<queryFetchRes> => {
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

  if (typeof (visibleEntry.dn) !== 'string') {
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
