import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import { channelsApi } from './api/channelsApi.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    [channelsApi.reducerPath]: channelsApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(channelsApi.middleware),
});

export default store;
