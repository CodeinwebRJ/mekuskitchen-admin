import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CouponType {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  startAt: string;
  expiresAt: string;
  usageLimit: number;
  image: string;
  isActive: boolean;
  termsAndConditions: string;
  description: string;
  category: string[];
  subCategory: string[];
  productCategory: string[];
}

interface CouponState {
  coupons: CouponType[];
  loading: boolean;
  error: string | null;
}

const initialState: CouponState = {
  coupons: [],
  loading: false,
  error: null,
};

const couponSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {
    createCoupon: (state, action: PayloadAction<CouponType>) => {
      state.coupons.push(action.payload);
    },
  },
});

export const { createCoupon } = couponSlice.actions;
export default couponSlice.reducer;