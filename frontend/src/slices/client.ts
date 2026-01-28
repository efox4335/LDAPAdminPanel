import { createSlice, createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { client, clientStore, ldapEntry, operationalLdapEntry, serverTreeEntry, openLdapEntry } from '../utils/types';
import getParentDn from '../utils/getParentDn';

const initialState: clientStore = {};

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    addClient: (state, action: PayloadAction<client>) => {
      state[action.payload.id] = action.payload;
    },

    delClient: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },

    addClients: (state, action: PayloadAction<client[]>) => {
      action.payload.forEach((client) => state[client.id] = { ...client, openEntries: [], openEntryMap: {} });
    },

    concatEntryMap: (state, action: PayloadAction<{ clientId: string, parentDn: string, subtreeRootDn: string, entryMap: Record<string, serverTreeEntry> }>) => {
      const existingMap = state[action.payload.clientId].entryMap;

      if (existingMap === undefined) {
        console.log('tried to concat with undefined map');

        return;
      }

      const parentEntry = existingMap[action.payload.parentDn];

      if (parentEntry && action.payload.parentDn !== action.payload.subtreeRootDn) {
        parentEntry.children[action.payload.subtreeRootDn] = action.payload.subtreeRootDn;
      }

      Object.values(action.payload.entryMap).forEach((entry) => {
        const existingEntry = existingMap[entry.dn];

        if (existingEntry) {
          if (entry.visible) {
            if (existingEntry.visible) {
              existingEntry.entry = entry.entry;
              existingEntry.operationalEntry = entry.operationalEntry;
            } else {
              const newEntry: Extract<serverTreeEntry, { visible: true }> = {
                visible: true,
                entry: entry.entry,
                operationalEntry: entry.operationalEntry,
                isExpanded: false,
                children: existingEntry.children,
                dn: entry.dn
              };

              existingMap[entry.dn] = newEntry;
            }
          }

          const curEntry = existingMap[entry.dn];

          Object.values(entry.children).forEach((childDn) => curEntry.children[childDn] = childDn);
        } else {
          existingMap[entry.dn] = entry;
        }
      });
    },

    updateOrAddEntry: (state, action: PayloadAction<{ clientId: string, parentDn: string, entry: ldapEntry, operationalEntry: operationalLdapEntry }>) => {
      const map = state[action.payload.clientId].entryMap;

      if (map === undefined) {
        console.log('tried to add entry before server tree is fetched');

        return;
      }

      const existingEntry = map[action.payload.entry.dn];

      if (existingEntry && existingEntry.visible) {
        existingEntry.entry = action.payload.entry;

        existingEntry.operationalEntry = action.payload.operationalEntry;
      } else {
        map[action.payload.entry.dn] = {
          isExpanded: false,
          dn: action.payload.entry.dn,
          visible: true,
          children: {},
          entry: action.payload.entry,
          operationalEntry: action.payload.operationalEntry
        };
      }

      const parentEntry = map[action.payload.parentDn];

      if (parentEntry) {
        parentEntry.children[action.payload.entry.dn] = action.payload.entry.dn;
      }
    },

    addEntry: (state, action: PayloadAction<{ clientId: string, parentDn: string, entry: ldapEntry, operationalEntry: operationalLdapEntry }>) => {
      const map = state[action.payload.clientId].entryMap;

      if (map === undefined) {
        console.log('tried to add entry before server tree is fetched');

        return;
      }

      map[action.payload.entry.dn] = {
        isExpanded: false,
        dn: action.payload.entry.dn,
        visible: true,
        children: {},
        entry: action.payload.entry,
        operationalEntry: action.payload.operationalEntry
      };

      const parentEntry = map[action.payload.parentDn];

      if (parentEntry) {
        parentEntry.children[action.payload.entry.dn] = action.payload.entry.dn;
      }
    },

    delEntry: (state, action: PayloadAction<{ clientId: string, dn: string }>) => {
      const map = state[action.payload.clientId].entryMap;

      if (!map) {
        console.log('tried to delete entry before server tree is fetched');

        return;
      }

      const delEntry = map[action.payload.dn];

      if (!delClient) {
        console.log('tried to delete non-existent entry');

        return;
      }

      const parentDn = getParentDn(delEntry.dn);

      const parentEntry = map[parentDn];

      if (parentEntry) {
        delete parentEntry.children[action.payload.dn];
      }

      const delChildren: string[] = Object.values(delEntry.children);

      delChildren.forEach((childDn, _index, arr) => {
        const childEntry = map[childDn];

        if (!childEntry) {
          console.log('child of delEntry does not exists');

          return;
        }

        Object.values(childEntry.children).forEach((val) => arr.push(val));

        delete map[childDn];
      });

      delete map[action.payload.dn];
    },

    collapseEntry: (state, action: PayloadAction<{ clientId: string, entryDn: string }>) => {
      const map = state[action.payload.clientId].entryMap;

      if (!map) {
        console.log('tried to collapse before server fetched');

        return;
      }

      const collapseEntry = map[action.payload.entryDn];

      if (!collapseEntry) {
        console.log('tried to collapse non-existent entry');

        return;
      }

      if (!collapseEntry.visible) {
        console.log('tried to collapse hidden entry');

        return;
      }

      collapseEntry.isExpanded = false;
    },

    expandEntry: (state, action: PayloadAction<{ clientId: string, entryDn: string }>) => {
      const map = state[action.payload.clientId].entryMap;

      if (!map) {
        console.log('tried to expand before server fetched');

        return;
      }

      const expandEntry = map[action.payload.entryDn];

      if (!expandEntry) {
        console.log('tried to update non-existent entry');

        return;
      }

      if (!expandEntry.visible) {
        console.log('tried to expand hidden entry');

        return;
      }

      expandEntry.isExpanded = true;
    },

    updateEntry: (state, action: PayloadAction<{ clientId: string, entry: ldapEntry, operationalEntry: operationalLdapEntry }>) => {
      const map = state[action.payload.clientId].entryMap;

      if (!map) {
        console.log('tried to update before server fetched');

        return;
      }

      const updateEntry = map[action.payload.entry.dn] as Extract<serverTreeEntry, { visible: true }> | undefined;

      if (!updateEntry) {
        console.log('tried to update non-existent entry');

        return;
      }

      updateEntry.visible = true;
      updateEntry.isExpanded = false;
      updateEntry.entry = action.payload.entry;
      updateEntry.operationalEntry = action.payload.operationalEntry;
    },

    addOpenEntry: (state, action: PayloadAction<{ clientId: string, entry: openLdapEntry }>) => {
      const client = state[action.payload.clientId];

      if (!client) {
        console.log('tried to open entry on invalid client');

        return;
      }

      if (action.payload.entry.entryType === 'existingEntry') {
        if (client.openEntryMap[action.payload.entry.entryDn] !== undefined) {
          return;
        }

        client.openEntryMap[action.payload.entry.entryDn] = action.payload.entry.entryDn;
      }

      client.openEntries.push(action.payload.entry);
    },

    closeOpenEntry: (state, action: PayloadAction<{ clientId: string, entry: openLdapEntry }>) => {
      const client = state[action.payload.clientId];

      if (!client) {
        console.log('tried to delete open entry on invalid client');

        return;
      }

      const curEntry = action.payload.entry;

      if (curEntry.entryType === 'existingEntry') {
        delete client.openEntryMap[curEntry.entryDn];

        const entryIndex = client.openEntries.findIndex((val) => {
          if (val.entryType === 'newEntry') {
            return false;
          }

          if (val.entryDn === curEntry.entryDn) {
            return true;
          }

          return false;
        });

        if (entryIndex === -1) {
          console.log(`tried to close non open entry ${curEntry.entryDn}`);

          return;
        }

        client.openEntries.splice(entryIndex, 1);
      } else {
        const entryIndex = client.openEntries.findIndex((val) => {
          if (val.entryType === 'existingEntry') {
            return false;
          }

          if (val.id === curEntry.id) {
            return true;
          }

          return false;
        });

        if (entryIndex === -1) {
          return;
        }

        client.openEntries.splice(entryIndex, 1);
      }
    }
  },
  selectors: {
    selectClients: (sliceState) => {
      return sliceState;
    },

    selectLdapEntry: (sliceState, clientId: string, dn: string) => {
      if (!sliceState[clientId].entryMap) {
        return undefined;
      }

      return sliceState[clientId].entryMap[dn];
    },

    selectOpenEntriesByClientId: createSelector(
      [(sliceState: clientStore, clientId: string) => {
        return sliceState[clientId].entryMap;
      },
      (sliceState: clientStore, clientId: string) => {
        return sliceState[clientId].openEntries;
      },
      (sliceState: clientStore, clientId: string) => {
        return sliceState[clientId].openEntryMap;
      }],

      (entryMap, openEntries, openEntryMap) => {
        if (!entryMap) {
          console.log('no entry map');

          return [];
        }

        if (!openEntries) {
          console.log('no open entries');

          return [];
        }

        if (!openEntryMap) {
          console.log('no open entry map');

          return [];
        }

        return openEntries;
      }
    ),

    selectNamingContextsByClientId: createSelector(
      [(sliceState: clientStore, clientId: string) => {
        if (!sliceState[clientId]) {
          return undefined;
        }

        if (!sliceState[clientId].entryMap) {
          return undefined;
        }

        return sliceState[clientId].entryMap['dse'];
      }],
      (rootEntry) => {
        if (!rootEntry) {
          return [];
        }

        if (!rootEntry.visible) {
          return [];
        }

        const namingContext = rootEntry.operationalEntry['namingContexts'];

        if (!namingContext) {
          return [];
        }

        if (Array.isArray(namingContext)) {
          return namingContext;
        }

        return [namingContext];
      }
    )
  }
});

export const { addClient, delClient, addClients, addEntry, delEntry, expandEntry, collapseEntry, updateEntry, concatEntryMap, addOpenEntry, closeOpenEntry, updateOrAddEntry } = clientsSlice.actions;
export const { selectClients, selectLdapEntry, selectOpenEntriesByClientId, selectNamingContextsByClientId } = clientsSlice.selectors;

export default clientsSlice.reducer;
