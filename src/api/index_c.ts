/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosRequestConfig } from "axios"; // 타입 추가
import { refreshAccessToken } from "./auth/auth";
import { store } from "../store"; // Redux 스토어 임포트 (경로 주의!)
import { clearTokens } from "../store/slices/authSlice"; // 관련 액션/Thunk 임포트 (경로 주의!)
// import { selectAccessToken } from "../store/slices/authSlice"; // 필요 시 AccessToken Selector 임포트

// Axios 인스턴스 생성은 동일
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
// 요청 인터셉터터
API.interceptors.request.use(
  (config) => {
    const skipAuth = (config.headers as any)?.skipAuth;

    if (!skipAuth) {
      const token = store.getState().auth.accessToken;
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

// 응답 인터셉터터
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

    // --- 401 처리 (AccessToken 만료) ---
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 토큰 재발급 중일 때 대기열에 추가
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
        // 1. 토큰 재발급 시도. 이 함수는 성공 시 내부적으로
        //    Redux 스토어의 토큰(setTokens)도 업데이트해야 함!
        //    만약 refreshAccessToken이 토큰 객체를 반환한다면 여기서 dispatch 가능
        const refreshResult = await refreshAccessToken();

        // -- 만약 refreshAccessToken이 토큰을 반환하고 여기서 dispatch 해야 한다면 --
        // if (refreshResult && refreshResult.accessToken) {
        //   store.dispatch(setTokens({
        //       accessToken: refreshResult.accessToken,
        //       refreshToken: refreshResult.refreshToken, // 리프레시 토큰도 있다면 같이 업데이트
        //   }));
        // }
        // ---------------------------------------------------------------------

        const newToken = store.getState().auth.accessToken;
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
