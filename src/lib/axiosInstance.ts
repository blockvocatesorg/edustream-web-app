// src/lib/axiosInstance.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://edustream.somee.com/api/v1",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
