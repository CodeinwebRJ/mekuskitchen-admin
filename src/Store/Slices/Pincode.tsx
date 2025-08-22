import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PincodeType {
  _id: string;
  code: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface PincodeState {
  pincodeList: PincodeType[];
  loading: boolean;
  error: string | null;
  pincodeSearch: string;
}

const initialState: PincodeState = {
  pincodeList: [],
  loading: false,
  error: null,
  pincodeSearch: '',
};

const pincodeSlice = createSlice({
  name: 'pincode',
  initialState,
  reducers: {
    setPincodeList(state, action: PayloadAction<PincodeType[]>) {
      state.pincodeList = action.payload;
    },
    setPincodeLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    setSearchPincode(state, action: PayloadAction<string>) {
      state.pincodeSearch = action.payload;
    },
  },
});

export const {
  setPincodeList,
  setPincodeLoading,
  setError,
  clearError,
  setSearchPincode,
} = pincodeSlice.actions;

export default pincodeSlice.reducer;
