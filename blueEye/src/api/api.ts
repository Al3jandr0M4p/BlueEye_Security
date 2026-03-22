import axios, { type InternalAxiosRequestConfig } from "axios";

const BaseUrl = import.meta.env.VITE_API_GATEWAY_URL! as string;

console.log("Base Url: ", BaseUrl);

let accessTokenGetter: (() => string | undefined) | undefined;

export function setAccessTokenGetter(getter: () => string | undefined) {
  accessTokenGetter = getter;
}

const api = axios.create({
  baseURL: BaseUrl,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = accessTokenGetter?.();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
