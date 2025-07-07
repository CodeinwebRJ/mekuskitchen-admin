import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: [],
  subCategories: [],
  productCategories: [],
  Brands: [],
  price: [0, 2000],
  attributes: {},
  search: '',
  sortBy: '',
  variation: 'product',
  page: '1',
  limit: '10',
  isActive: true,
};

const filterDataSlice = createSlice({
  name: 'filterData',
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setSubCategories: (state, action) => {
      state.subCategories = action.payload;
    },
    setProductCategories: (state, action) => {
      state.productCategories = action.payload;
    },
    setBrands: (state, action) => {
      state.Brands = action.payload;
    },
    setPrices: (state, action) => {
      state.price = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setAttributes: (state, action) => {
      state.attributes = action.payload;
    },
    setVariation: (state, action) => {
      state.variation = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
    },
    setIsActive: (state, action) => {
      state.isActive = action.payload;
    },
    resetFilters: (state) => {
      state.categories = [];
      state.subCategories = [];
      state.productCategories = [];
      state.Brands = [];
      state.price = [0, 2000];
      state.attributes = {};
      state.isActive = true;
    },
  },
});

export const {
  setCategories,
  setSubCategories,
  setProductCategories,
  setBrands,
  setPrices,
  setIsActive,
  setAttributes,
  setSearch,
  setPage,
  setLimit,
  setVariation,
  resetFilters,
} = filterDataSlice.actions;

export default filterDataSlice.reducer;
