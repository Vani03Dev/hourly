import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@supabase/supabase-js';

interface AuthState {
  isAuthenticated: boolean;
  isOnboarded: boolean;
  token: string | null;
  user: User | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isOnboarded: false,
  token: null,
  user: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ user: User | null; token: string | null; isOnboarded?: boolean }>) => {
      state.isAuthenticated = !!action.payload.user;
      state.user = action.payload.user;
      state.token = action.payload.token;
      if (action.payload.isOnboarded !== undefined) {
        state.isOnboarded = action.payload.isOnboarded;
      }
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.isOnboarded = false;
      state.user = null;
      state.token = null;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;

export default authSlice.reducer;
