import axios from "axios";
import { refreshAccessToken } from "./auth/auth";

export const API = axios.create({
  baseURL: "http://119.219.30.209:6030",
  withCredentials: true,
});

let isRefreshing = false;
let subscribers: ((token: string) => void)[] = [];

// 새 토큰을 받아 모든 대기 요청 재시도
function onRefreshed(token: string) {
  subscribers.forEach((callback) => callback(token));
  subscribers = [];
}

// 대기 중인 요청을 구독시킴
function addSubscriber(callback: (token: string) => void) {
  subscribers.push(callback);
}

API.interceptors.request.use(
  (config) => {
    const skipAuth = config.headers?.skipAuth;

    // 헤더에 { headers: { skipAuth: true } }를 추가하면 토근 검사를 안함
    // 그렇지 않으면 자동으로 헤더에 accesstoken을 추가함
    if (!skipAuth) {
      const token = localStorage.getItem("accesstoken");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    if (config.headers?.skipAuth !== undefined) {
      delete config.headers.skipAuth;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const status = error.response?.status;
    const errorMessage = error.response?.data?.message || "";

    if (status === 401 && !originalRequest._retry) {
      // accessToken 만료로 인한 401
      if (isRefreshing) {
        return new Promise((resolve) => {
          addSubscriber((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(API(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await refreshAccessToken();
        const newToken = localStorage.getItem("accesstoken");
        if (!newToken) throw new Error("재발급 실패");

        onRefreshed(newToken);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        console.error("토큰 재발급 실패:", refreshError);
        isRefreshing = false;
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // 403 또는 기타 에러를 무조건 로그아웃시키지 말자
    if (status === 403) {
      // 진짜 "토큰 관련" 에러만 로그아웃
      if (errorMessage.includes("Token") || errorMessage.includes("권한")) {
        console.warn("권한 문제로 로그아웃합니다.");
        localStorage.clear();
        window.location.href = "/login";
      }
      // 아니면 단순히 에러 처리만
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);
