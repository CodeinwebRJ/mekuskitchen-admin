import { configureStore } from '@reduxjs/toolkit';
import categorySlice from './Slices/Categories';
import authSlice from './Slices/AdminUser';

export const store = configureStore({
  reducer: {
    category: categorySlice,
    auth: authSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
