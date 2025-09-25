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
    }
  },
  selectors: {
    selectClients: (sliceState) => {
      console.log('here', sliceState);
      return Object.keys(sliceState).map((ele) => sliceState[ele]);
    }
  }
});

export const { addClient, delClient } = clientsSlice.actions;
export const { selectClients } = clientsSlice.selectors;

export default clientsSlice.reducer;
