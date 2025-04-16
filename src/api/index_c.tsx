import axios from "axios";
import { refreshAccessToken } from "./auth/auth";

export const API = axios.create({
  baseURL: "http://119.219.30.209:6030",
  withCredentials: true,
});

let isRefreshing = false; // 리프레시 중인지 여부
let refreshSubscribers: ((token: string) => void)[] = []; // 리프레시 완료 후 대기 중인 요청들

// 모든 대기 요청을 새로운 토큰으로 다시 실행
function onRefreshed(token: string | null) {
  if (!token) return;
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

API.interceptors.request.use(
  (config) => {
    const skipAuth = config.headers?.skipAuth;

    if (!skipAuth) {
      const token = localStorage.getItem("accesstoken");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    if (config.headers) {
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

    // accessToken 만료로 인한 401 에러
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 이미 리프레시 중이면 대기
        return new Promise((resolve) => {
          refreshSubscribers.push((newToken: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            resolve(API(originalRequest)); // 다시 요청
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await refreshAccessToken();
        const newAccessToken = localStorage.getItem("accesstoken");

        if (newAccessToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        onRefreshed(newAccessToken); // 대기 중이던 요청 전부 다시 실행
        isRefreshing = false;
        return API(originalRequest);
      } catch (refreshError) {
        console.error("토큰 재발급 실패:", refreshError);
        isRefreshing = false;
        localStorage.clear();
        window.location.href = "/login"; // 로그인 페이지로 강제 이동
        return Promise.reject(refreshError);
      }
    }

    // 리프레시 토큰도 만료됐을 경우 403
    if (error.response?.status === 403) {
      console.warn("403 에러 발생, 토큰 무효. 로그아웃합니다.");
      localStorage.clear();
      window.location.href = "/login"; // 로그인 페이지로 강제 이동
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);
