import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import biodataReducer from '../features/biodata/biodataSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    biodata: biodataReducer,
  },
});

export default store;
