import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SubCategoryType {
  _id: string;
  name: string;
  subSubCategories: SubSubCategoryType[];
  isActive: boolean;
}

interface SubSubCategoryType {
  _id: string;
  name: string;
  isActive: boolean;
}

interface CategoryType {
  _id: string;
  name: string;
  isActive: boolean;
  subCategories: SubCategoryType[];
  createdAt?: string;
  updatedAt?: string;
}

interface CategoryState {
  categoryList: CategoryType[];
  loading: boolean;
  error: string | null;
  categorySearch: string;
  subCategorySearch: string;
  productCategorySearch: string;
}

const initialState: CategoryState = {
  categoryList: [],
  categorySearch: '',
  subCategorySearch: '',
  productCategorySearch: '',
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategoryList(state, action: PayloadAction<CategoryType[]>) {
      state.categoryList = action.payload;
    },
    setCategoryLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setSearchCategory(state, action: PayloadAction<string>) {
      state.categorySearch = action.payload;
    },
    setSearchSubCategory(state, action: PayloadAction<string>) {
      state.subCategorySearch = action.payload;
    },
    setSearchProductCategory(state, action: PayloadAction<string>) {
      state.productCategorySearch = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const {
  setCategoryList,
  setCategoryLoading,
  setError,
  clearError,
  setSearchCategory,
  setSearchSubCategory,
  setSearchProductCategory,
} = categorySlice.actions;

export default categorySlice.reducer;
