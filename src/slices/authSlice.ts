import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UserDetail {
  id: number;
  username: string;
  role: string;
  createdDate: string;
  updatedDate: string;
}

interface AuthState {
  token: string | null;
  user: UserDetail | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogin: (state, action: PayloadAction<{ token: string; user: UserDetail }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { setLogin, logout } = authSlice.actions;
export default authSlice.reducer;