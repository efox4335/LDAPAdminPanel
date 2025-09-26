import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { client, clientStore } from '../utils/types';

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
    }
  },
  selectors: {
    selectClients: (sliceState) => {
      return sliceState;
    }
  }
});

export const { addClient, delClient, addClients } = clientsSlice.actions;
export const { selectClients } = clientsSlice.selectors;

export default clientsSlice.reducer;
