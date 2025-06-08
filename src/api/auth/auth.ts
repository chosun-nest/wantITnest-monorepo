import axios from "axios";
import { SignupPayload } from "../../types/signup";
import { API } from "..";
import { setTokens } from "../../store/slices/authSlice";
import { store } from "../../store";

export const login = async (email: string, password: string) => {
  const res = await API.post(
    "/api/v1/auth/login",
    { email, password },
    { headers: { skipAuth: true } }
  ); // 첫 번째 인자는 base url에서 파생된 요청할 주소임
  console.log("로그인 응답:", res.data);
  return res.data;
};

export const signup = async (payload: SignupPayload) => {
  const res = await API.post("/api/v1/auth/signup", payload, {
    headers: { skipAuth: true },
  });
  return res.data;
};

export const sendcode = async (email: string) => {
  const res = await API.post(
    "/api/v1/auth/send-code",
    { email },
    { headers: { skipAuth: true } }
  );
  return res.data;
};

export const verifycode = async (email: string, code: string) => {
  const res = await API.post(
    "/api/v1/auth/verify-code",
    { email, code },
    { headers: { skipAuth: true } }
  );
  return res.data;
};

export const checkTokenValidity = async (): Promise<{ memberId: string }> => {
  const res = await API.get("/api/v1/auth/me", {
    headers: { skipAuth: false },
  });
  return res.data;
};

export const sendResetPasswordLink = async (email: string) => {
  const res = await API.post("/api/v1/auth/password-reset-link-request", {
    email,
  });
  return res.data;
};

export const passwordReset = async (token: string, newPassword: string) => {
  const res = await API.post(
    "/api/v1/auth/password-reset",
    { token, newPassword },
    { headers: { skipAuth: true } }
  );
  return res.data;
};

export async function refreshAccessToken() {
  const refreshToken = store.getState().auth.refreshToken;
  if (!refreshToken) {
    throw new Error("리프레시 토큰 없음");
  }

  const rawAxios = axios.create();
  console.log("리프레시 중");
  const res = await rawAxios.post(
    `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/refresh`,
    {},
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    }
  );

  const { accessToken, refreshToken: newRefreshToken, userId } = res.data;

  if (!accessToken || !newRefreshToken) {
    throw new Error("재발급된 토큰 없음");
  }

  store.dispatch(
    setTokens({
      accessToken,
      refreshToken: newRefreshToken,
      userId,
    })
  );
}
