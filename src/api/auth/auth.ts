import { SignupPayload } from "../../types/signup";
import { API } from "../index_c";
import { setTokens, clearTokens } from "../../store/slices/authSlice";
import { store } from "../../store";

export const login = async (email: string, password: string) => {
  const res = await API.post(
    "/api/v1/auth/login",
    { email, password },
    { headers: { skipAuth: true } }
  ); // 첫 번째 인자는 base url에서 파생된 요청할 주소임
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
  const res = await API.get("/api/v1/auth/me");
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
  try {
    const refreshToken = store.getState().auth.refreshToken;

    if (!refreshToken) {
      throw new Error("리프레시 토큰이 없습니다.");
    }

    const res = await API.post(
      "/api/v1/auth/refresh",
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          skipAuth: true,
        },
      }
    );

    const { accessToken, refreshToken: newRefreshToken } = res.data;

    if (accessToken && newRefreshToken) {
      store.dispatch(setTokens({ accessToken, refreshToken: newRefreshToken }));

      console.log(" 토큰 재발급 성공");
    } else {
      throw new Error("재발급된 토큰이 없습니다.");
    }
  } catch (error) {
    console.error(" 토큰 재발급 실패:", error);

    store.dispatch(clearTokens());

    localStorage.clear();
    sessionStorage.clear();

    // 로그인 페이지로 이동
    window.location.href = "/login";
    throw error;
  }
}
