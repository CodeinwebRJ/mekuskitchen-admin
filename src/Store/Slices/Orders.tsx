import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../Store';

interface Combination {
  [key: string]: string;
}

interface SKU {
  skuName?: string;
  color?: string;
  images?: string[];
}

interface ProductDetails {
  name: string;
  images: { url: string }[];
}

interface CartItem {
  sku?: SKU;
  productDetails: ProductDetails;
  combination?: Combination;
  quantity: number;
  price: number;
  name: string;
}

export interface Order {
  _id: string;
  user: string;
  userImg: string;
  orderId: string;
  Orderdate: string;
  orderStatus: string;
  status: string;
  totalAmount: number;
  grandTotal: number;
  cartItems: CartItem[];
}

interface FilterState {
  search: string;
  startDate: string;
  endDate: string;
  dateRange: string;
  specificDate: string;
  orderStatus: string;
  orderId: string;
  orderFilters: string;
}

interface OrderState {
  orders: Order[];
  loading: boolean;
  filter: FilterState;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  filter: {
    search: '',
    startDate: '',
    endDate: '',
    dateRange: '',
    specificDate: '',
    orderStatus: '',
    orderId: '',
    orderFilters: 'product',
  },
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setFilter: (state, action: PayloadAction<Partial<FilterState>>) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    resetFilter: (state) => {
      state.filter = initialState.filter;
    },
  },
});

export const { setOrders, setLoading, setFilter, resetFilter } = orderSlice.actions;

export const selectOrders = (state: RootState) => state.orders.orders;
export const selectLoading = (state: RootState) => state.orders.loading;
export const selectFilter = (state: RootState) => state.orders.filter;

export default orderSlice.reducer;
