/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { refreshAccessToken } from "./auth/auth";
import { store } from "../store";
import { selectAccessToken, clearTokens } from "../store/slices/authSlice";
import { showModal } from "../store/slices/modalSlice";

// 환경변수에서 API 기본 URL 가져오기
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const IS_DEVELOPMENT = import.meta.env.VITE_APP_ENV === 'development';
const ENABLE_API_LOGS = import.meta.env.VITE_ENABLE_API_LOGS === 'true';

// API 로깅 함수
const logAPICall = (message: string, data?: any) => {
  if (IS_DEVELOPMENT && ENABLE_API_LOGS) {
    console.log(`[API] ${message}`, data);
  }
};

export const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000, // 30초 타임아웃
  headers: {
    'Content-Type': 'application/json',
  }
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

    if (config.headers && (config.headers as any).skipAuth !== undefined) {
      delete (config.headers as any).skipAuth;
    }

    // API 호출 로깅
    logAPICall(`REQUEST: ${config.method?.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      data: config.data
    });

    return config;
  },
  (error) => {
    logAPICall('REQUEST ERROR:', error);
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    // 성공 응답 로깅
    logAPICall(`RESPONSE: ${response.status} ${response.config.url}`, {
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    const status = error.response?.status;
    const errorMessage = (error.response?.data as any)?.message || "";

    // 에러 응답 로깅
    logAPICall(`ERROR: ${status} ${originalRequest?.url}`, {
      message: errorMessage,
      response: error.response?.data
    });

    if (!IS_DEVELOPMENT) {
      console.warn("API 에러:", status, errorMessage);
    }

    if (status === 401) {
      if (isRefreshing) {
        logAPICall("토큰 재발급 중, 대기 중...");
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

        if (!newToken) throw new Error("새 토큰 없음");

        onRefreshed(newToken);
        isRefreshing = false;

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        return API(originalRequest);
      } catch (refreshError) {
        logAPICall("토큰 재발급 실패", refreshError);
        isRefreshing = false;

        store.dispatch(clearTokens());
        store.dispatch(
          showModal({
            title: "세션 만료",
            message: "세션이 만료되었습니다. 다시 로그인해주세요.",
            type: "error",
          })
        );
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // 403 처리
    if (status === 403 && !errorMessage) {
      store.dispatch(
        showModal({
          title: "접근 권한 오류",
          message: "로그인이 필요하거나 권한이 없습니다.",
          type: "error",
        })
      );
    }

    return Promise.reject(error);
  }
);
