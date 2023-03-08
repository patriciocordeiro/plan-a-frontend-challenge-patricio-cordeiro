import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../../shared/store/store';
import { loginAsync } from './AuthAPI';
import { AuthPayload } from './interfaces/AuthPayload';

const IS_LOGGED_IN = 'isLoggedIn';

export interface AuthSate {
  isLoggedIn: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export const authInitialState: AuthSate = {
  isLoggedIn: JSON.parse(localStorage.getItem(IS_LOGGED_IN)!),
  status: 'idle',
  error: null,
};

export const login = createAsyncThunk('auth/login', async (payload: AuthPayload) => {
  const response = await loginAsync(payload);
  return response.data;
});

export const authSlice = createSlice({
  name: 'auth',

  initialState: authInitialState,

  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      localStorage.removeItem(IS_LOGGED_IN);
    },
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
      action.payload
        ? localStorage.setItem(IS_LOGGED_IN, 'true')
        : localStorage.removeItem(IS_LOGGED_IN);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isLoggedIn = true;
        localStorage.setItem(IS_LOGGED_IN, 'true');
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.error = action.error.message!;
        localStorage.removeItem(IS_LOGGED_IN);
      });
  },
});

export const { logout, setIsLoggedIn } = authSlice.actions;

// actions
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectStatus = (state: RootState) => state.auth.status;
export const selectError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
