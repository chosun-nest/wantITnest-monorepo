/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { refreshAccessToken } from "./auth/auth";
import { store } from "../store";
import {
  selectAccessToken,
  clearTokens /*, setTokens */,
} from "../store/slices/authSlice";

export const API = axios.create({
  baseURL: "http://119.219.30.209:6030",
  withCredentials: true,
});

let isRefreshing = false;
let subscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
  subscribers.forEach((callback) => callback(token));
  subscribers = [];
}

function addSubscriber(callback: (token: string) => void) {
  subscribers.push(callback);
}

API.interceptors.request.use(
  (config) => {
    const skipAuth = (config.headers as any)?.skipAuth;

    if (!skipAuth) {
      const token = selectAccessToken(store.getState());
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    if ((config.headers as any)?.skipAuth !== undefined) {
      delete (config.headers as any).skipAuth;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };
    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const errorMessage = (error.response?.data as any)?.message || "";

    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          addSubscriber((newToken) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            resolve(API(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await refreshAccessToken();

        const newToken = selectAccessToken(store.getState());
        if (!newToken)
          throw new Error("토큰 재발급 후 스토어에서 토큰을 찾을 수 없음");

        onRefreshed(newToken);
        isRefreshing = false;

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return API(originalRequest);
      } catch (refreshError) {
        console.error("토큰 재발급 실패:", refreshError);
        isRefreshing = false;

        store.dispatch(clearTokens());

        return Promise.reject(refreshError);
      }
    }

    // --- 403 처리 ---
    if (status === 403) {
      if (errorMessage.includes("Token") || errorMessage.includes("권한")) {
        console.warn("권한 문제(403).");

        store.dispatch(clearTokens());
      }
      // 그 외 403 에러는 그대로 반환
      return Promise.reject(error);
    }

    // 그 외 모든 에러는 그대로 반환
    return Promise.reject(error);
  }
);
