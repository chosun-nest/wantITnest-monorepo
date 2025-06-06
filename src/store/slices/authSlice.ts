import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../types/store";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  userId: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTokens(state, action: PayloadAction<AuthState>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.userId = action.payload.userId;
    },
    clearTokens(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.userId = null;
    },
  },
});

export const selectAccessToken = (state: RootState): string | null =>
  state.auth.accessToken;

export const selectRefreshToken = (state: RootState): string | null =>
  state.auth.refreshToken;

export const selectUserId = (state: RootState): string | null =>
  state.auth.userId;

export const selectIsLoggedIn = (state: RootState): boolean =>
  !!state.auth.accessToken;

export const { setTokens, clearTokens } = authSlice.actions;
export default authSlice.reducer;
