import axios from "axios";

const BaseUrl = import.meta.env.VITE_API_GATEWAY_URL!;

console.log("Base Url: ", BaseUrl);

const api = axios.create({
  baseURL: BaseUrl,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
