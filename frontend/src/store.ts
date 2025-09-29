import { configureStore } from '@reduxjs/toolkit';

import clientsSlice from './slices/client';
import errorSlice from './slices/error';

const store = configureStore({
  reducer: {
    clients: clientsSlice,
    errors: errorSlice
  }
});

export default store;
