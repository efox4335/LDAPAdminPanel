import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { client, clientStore, ldapEntry, operationalLdapEntry, serverTreeEntry } from '../utils/types';
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
      action.payload.forEach((client) => state[client.id] = client);
    },

    addEntry: (state, action: PayloadAction<{ clientId: string, parentDn: string, entry: ldapEntry, operationalEntry: operationalLdapEntry }>) => {
      const map = state[action.payload.clientId].entryMap;

      if (map === undefined) {
        console.log('tried to add entry before server tree is fetched');

        return;
      }

      map[action.payload.entry.dn] = {
        dn: action.payload.entry.dn,
        visible: true,
        children: {},
        entry: action.payload.entry,
        operationalEntry: action.payload.operationalEntry
      };

      map[action.payload.parentDn].children[action.payload.entry.dn] = action.payload.entry.dn;
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

      if (!parentEntry) {
        console.log('parent entry does not exist');

        return;
      }

      delete parentEntry.children[action.payload.dn];

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
      updateEntry.entry = action.payload.entry;
      updateEntry.operationalEntry = action.payload.operationalEntry;
    }
  },
  selectors: {
    selectClients: (sliceState) => {
      return sliceState;
    },

    selectLdapEntry: (sliceState, id: string, dn: string) => {
      if (!sliceState[id].entryMap) {
        return undefined;
      }

      return sliceState[id].entryMap[dn];
    }
  }
});

export const { addClient, delClient, addClients, addEntry, delEntry, updateEntry } = clientsSlice.actions;
export const { selectClients, selectLdapEntry } = clientsSlice.selectors;

export default clientsSlice.reducer;
