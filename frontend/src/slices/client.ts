import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { client, clientStore, ldapEntry } from '../utils/types';

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

    addEntry: (state, action: PayloadAction<{ clientId: string, parentDn: string, entry: ldapEntry }>) => {
      const map = state[action.payload.clientId].entryMap;

      if (map === undefined) {
        console.log('tried to add entry before server tree is fetched');

        return;
      }

      map[action.payload.entry.dn] = {
        dn: action.payload.entry.dn,
        visible: true,
        children: {},
        entry: action.payload.entry
      };

      map[action.payload.parentDn].children[action.payload.entry.dn] = action.payload.entry.dn;
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

export const { addClient, delClient, addClients, addEntry } = clientsSlice.actions;
export const { selectClients, selectLdapEntry } = clientsSlice.selectors;

export default clientsSlice.reducer;
