import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TiffinItem {
  _id: string;
  name: string;
  price: string;
  quantity: number;
  weightUnit: string;
  weight: string;
  description: string;
}

export interface TiffinImage {
  url: string;
  isPrimary: boolean;
}

export interface Tiffin {
  _id: string;
  day: string;
  items: TiffinItem[];
  date: string;
  subTotal: string;
  totalAmount: string;
  description: string;
  category: string;
  aboutItem: string[];
  Active: boolean;
  image_url: TiffinImage[];
}

interface TiffinState {
  data: Tiffin[];
  search: string;
  dat: string;
  Active: string;
}

const initialState: TiffinState = {
  data: [],
  search: '',
  dat: '',
  Active: '',
};

const tiffinSlice = createSlice({
  name: 'tiffin',
  initialState,
  reducers: {
    setTiffin: (state, action: PayloadAction<Tiffin[]>) => {
      state.data = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setDat: (state, action: PayloadAction<string>) => {
      state.dat = action.payload;
    },
    setActive: (state, action: PayloadAction<string>) => {
      state.Active = action.payload;
    },
  },
});

export const { setTiffin, setSearch, setDat, setActive } = tiffinSlice.actions;
export default tiffinSlice.reducer;
