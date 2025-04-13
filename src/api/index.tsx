import axios from "axios";

const API = axios.create({
  baseURL: "http://119.219.30.209:6030",
});

// 요청마다 skipAuth 옵션을 체크
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
      delete config.headers.skipAuth; // 서버에 보내지 않게 제거
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export { API };
