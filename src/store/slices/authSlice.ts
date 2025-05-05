import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTokens(state, action: PayloadAction<AuthState>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    clearTokens(state) {
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const selectAccessToken = (state: RootState): string | null =>
  state.auth.accessToken;

export const selectRefreshToken = (state: RootState): string | null =>
  state.auth.refreshToken;

export const logoutuser = (state: RootState): void => {
  state.auth.accessToken = null;
  state.auth.refreshToken = null;
  localStorage.removeItem("persist:root");
  sessionStorage.removeItem("persist:root");
};
export const { setTokens, clearTokens } = authSlice.actions;
export default authSlice.reducer;
