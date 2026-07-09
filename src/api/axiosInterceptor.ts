/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { jwtDecode } from "jwt-decode";

/**
 * In dev, use same-origin `/api` so Vite can proxy to `VITE_API_URL` (your real backend).
 * If `VITE_API_URL` points at the Vite port by mistake, signup hits the SPA server → 404.
 */
function resolveApiBaseURL(): string {
  const origin = (
    import.meta.env.VITE_API_URL as string | undefined
  )?.replace(/\/$/, "");
  if (import.meta.env.DEV) {
    return "/api";
  }
  if (!origin) {
    console.warn("VITE_API_URL is not set; API requests will fail in production.");
    return "/api";
  }
  return `${origin}/api`;
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
