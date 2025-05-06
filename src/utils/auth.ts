import { store } from "../store";

export const getAccessToken = (): string => {
  const token = store.getState().auth.accessToken;
  if (!token) throw new Error("No access token");
  return token;
};
