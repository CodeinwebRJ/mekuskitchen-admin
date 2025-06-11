import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import userDetail from '../../utils/localStorage';

interface User {
  name: string | null;
  email: string | null;
  phone: number | null;
  uniqueid: number | null;
  avatar: string | null;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string;
  user: User;
}

const userData: any = userDetail || {};

const initialState: AuthState = {
  isAuthenticated: !!userData.token,
  token: userData.token || '',
  user: {
    phone: userData.phone || null,
    name: userData.name || null,
    email: userData.email || null,
    uniqueid: userData.uniqueid || null,
    avatar: userData.avatar || null,
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<any>) {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = {
        phone: action.payload.phone,
        name: action.payload.name,
        email: action.payload.email,
        uniqueid: action.payload.uniqueid,
        avatar: action.payload.avatar,
      };
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = '';
      state.user = {
        phone: null,
        name: null,
        email: null,
        uniqueid: null,
        avatar: null,
      };
    },
    setUser(state, action: PayloadAction<any>) {
      state.isAuthenticated = !!action.payload.token;
      state.token = action.payload.token;
      state.user = {
        phone: action.payload.admin.phone,
        name: action.payload.admin.name,
        email: action.payload.admin.email,
        uniqueid: action.payload.admin.uniqueid,
        avatar: action.payload.admin.avatar,
      };
    },
  },
});

export const { login, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
