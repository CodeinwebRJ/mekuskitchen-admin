import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Item {
  _id: string;
  name: string;
  weight: string;
  weightUnit: string;
  price: number;
  description:string;
  status: boolean;
}

interface ItemMasterState {
  items: Item[];
  loading: boolean;
}

const initialState: ItemMasterState = {
  items: [],
  loading: false,
};

const itemMasterSlice = createSlice({
  name: 'itemMaster',
  initialState,
  reducers: {

    setItems: (state, action: PayloadAction<Item[]>) => {
      state.items = action.payload;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    updateItemStatus: (state, action: PayloadAction<{ id: string; status: boolean }>) => {
      const item = state.items.find((i) => i._id === action.payload.id);
      if (item) {
        item.status = action.payload.status;
      }
    },
    
    deleteItemFromState: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i._id !== action.payload);
    },
  },
});

export const { setItems, setLoading, updateItemStatus, deleteItemFromState } =
  itemMasterSlice.actions;

export default itemMasterSlice.reducer;
