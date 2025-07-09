import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TiffinItem {
  _id: string;
  name: string;
  price: string;
  quantity: number;
  quantityUnit: string;
  description: string;
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
  aboutItem: any[];
  Active: boolean;
  image_url: string[];
}

interface TiffinState {
  data: Tiffin | [];
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
    setTiffin: (state, action: PayloadAction<Tiffin>) => {
      state.data = action.payload;
    },
  },
});

export const { setTiffin } = tiffinSlice.actions;
export default tiffinSlice.reducer;
