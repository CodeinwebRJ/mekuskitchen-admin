import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProductState {
  products: any;
  loading: boolean;
  combinations: any;
}

const initialState: ProductState = {
  products: null,
  loading: false,
  combinations: [],
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<any>) => {
      state.products = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCombinations: (state, action: PayloadAction<any>) => {
      state.combinations = [];
      action.payload.forEach((product: any) => {
        product.sku.forEach((sku: any) => {
          const combinations = sku.details?.combinations;
          combinations?.forEach((combination: any) => {
            state.combinations.push(combination);
          });
        });
      });
    },
  },
});

export const { setProducts, setLoading, setCombinations } = productSlice.actions;
export default productSlice.reducer;
