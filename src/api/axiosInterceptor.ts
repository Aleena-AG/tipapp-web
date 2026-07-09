/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { jwtDecode } from "jwt-decode";

/**
 * Always call same-origin `/api`:
 * - Dev: Vite proxies to `VITE_API_URL` (see vite.config.ts)
 * - Prod (Vercel): vercel.json rewrites `/api` → backend (avoids CORS)
 */
function resolveApiBaseURL(): string {
  return "/api";
}

const authFetch = axios.create({
  baseURL: resolveApiBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
});

authFetch.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userType");
        localStorage.removeItem("userId");
        localStorage.removeItem("email");
        localStorage.removeItem("displaySwitch");
        localStorage.removeItem("notification_token");  
        localStorage.removeItem("userEmail");  
        localStorage.removeItem("selectedCurrency");
        window.location.reload();
        throw new axios.Cancel("Token expired");
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default authFetch;
