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
}

const initialState: CategoryState = {
  categoryList: [],
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
    clearError(state) {
      state.error = null;
    },
  },
});

export const { setCategoryList, setCategoryLoading, setError, clearError } = categorySlice.actions;

export default categorySlice.reducer;
