import axios from "axios";

export const QApi = axios.create({
  baseURL: "http://localhost:8084",
  headers: {
    "Content-Type": "application/json",
  },
});


// Request interceptor - add logs
QApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    
    // DEBUG LOGS
    console.log("=== API REQUEST ===");
    console.log("URL:", config.url);
    console.log("Token from localStorage:", token ? "EXISTS" : "NULL");
    console.log("Token value:", token);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Authorization header SET:", config.headers.Authorization);
    } else {
      console.warn("NO TOKEN - Request will fail with 401");
    }
    
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

