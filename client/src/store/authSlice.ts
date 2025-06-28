
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { IUser } from '../types';

interface AuthState {
  isLogin: boolean;
  user: IUser | null;

}



const initialState: AuthState = {
  isLogin: !!localStorage.getItem('user'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: IUser }>) => {
      state.isLogin = true;
      state.user = action.payload.user;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
 
    },
    logout: (state) => {
      state.isLogin = false;
      state.user = null;
      localStorage.clear();
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
