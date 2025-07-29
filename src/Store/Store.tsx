import { configureStore } from '@reduxjs/toolkit';
import categorySlice from './Slices/Categories';
import authSlice from './Slices/AdminUser';
import ProductSlice from './Slices/ProductData';
import FilterSlice from './Slices/FilterData';
import tiffinReducer from './Slices/Tiffin';
import orderReducer from './Slices/Orders';

export const store = configureStore({
  reducer: {
    category: categorySlice,
    auth: authSlice,
    product: ProductSlice,
    filterData: FilterSlice,
    orders: orderReducer,
    tiffin: tiffinReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
