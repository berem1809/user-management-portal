import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';

// We will add reducers here later as we create slices for auth and users
export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
  },
  // Optional: Redux Toolkit automatically adds thunk middleware, but you can customize it here if needed
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
