import { configureStore } from '@reduxjs/toolkit';

import clientsSlice from './slices/client';
import errorSlice from './slices/error';

const store = configureStore({
  reducer: {
    clients: clientsSlice,
    errors: errorSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
