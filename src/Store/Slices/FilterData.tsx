import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  subCategories: [],
  productCategories: [],
  Brands: [],
  ratings: [],
  price: [0, 2000],
  attributes: {},
  search: "",
  sortBy: "",
  page: "1",
  limit: "10",
  grid: 3,
};

const filterDataSlice = createSlice({
  name: "filterData",
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
    setRatings: (state, action) => {
      state.ratings = action.payload;
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
    setGrid: (state, action) => {
      state.grid = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
    },
    resetFilters: (state) => {
      state.categories = [];
      state.subCategories = [];
      state.productCategories = [];
      state.Brands = [];
      state.ratings = [];
      state.price = [0, 2000];
      state.attributes = {};
    },
  },
});

export const {
  setCategories,
  setSubCategories,
  setProductCategories,
  setBrands,
  setRatings,
  setPrices,
  setAttributes,
  setSearch,
  setGrid,
  setPage,
  setLimit,
  resetFilters,
} = filterDataSlice.actions;

export default filterDataSlice.reducer;
