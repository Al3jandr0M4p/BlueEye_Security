import axios from "axios";

const BaseUrl = import.meta.env.VITE_API_GATEWAY_URL!;

console.log("Base Url: ", BaseUrl);

const api = axios.create({
  baseURL: BaseUrl,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

export default api;
