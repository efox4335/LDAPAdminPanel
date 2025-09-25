import { configureStore } from '@reduxjs/toolkit';

import clientsSlice from './slices/client';

const store = configureStore({ reducer: { clients: clientsSlice } });

export default store;
