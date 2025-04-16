import { SignupPayload } from "../../types/signup";
import { API } from "../index_c";

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

export async function refreshAccessToken() {
  try {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      throw new Error("리프레시 토큰이 없습니다.");
    }

    const res = await API.post(
      "/api/v1/auth/refresh-token",
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
      localStorage.setItem("accesstoken", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      console.log("토큰 재발급 성공");
    } else {
      throw new Error("재발급된 토큰이 없습니다.");
    }
  } catch (error) {
    console.error("❌ 토큰 재발급 실패:", error);
    localStorage.clear();
    window.location.href = "/login"; // 실패시 강제 로그아웃
    throw error;
  }
}
