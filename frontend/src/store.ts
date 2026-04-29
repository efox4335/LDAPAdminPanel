import { configureStore } from '@reduxjs/toolkit';

import serversSlice from './slices/server';
import errorSlice from './slices/error';
import settingsSlice from './slices/settings';

const store = configureStore({
  reducer: {
    servers: serversSlice,
    errors: errorSlice,
    settings: settingsSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
