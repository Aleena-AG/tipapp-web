/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { getLocationCurrencyState, releaseUserCurrencyOverride } from "@/currency/locationStore";
import { normalizeCountryCode } from "@/currency/countryCurrency";

/**
 * Always call same-origin `/api`:
 * - Dev: Vite proxies to `VITE_API_URL` (see vite.config.ts)
 * - Prod (Vercel): vercel.json rewrites `/api` → backend (avoids CORS)
 */
function resolveApiBaseURL(): string {
  return "/api";
}

function requestPath(url: string | undefined): string {
  if (!url) return "";
  const path = url.startsWith("http")
    ? new URL(url).pathname
    : url.split("?")[0];
  return path.replace(/\/+$/, "");
}

/** GPS and IP lookups. An explicit ?countryCode= call is the cached last resort. */
function isVisitorLocationLookup(config: {
  url?: string;
  params?: Record<string, unknown>;
}): boolean {
  if (!requestPath(config.url).endsWith("/location")) return false;
  const params = config.params ?? {};
  const countryCode = params.countryCode ?? params.CountryCode;
  return !(typeof countryCode === "string" && countryCode.trim());
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
        releaseUserCurrencyOverride();
        window.location.reload();
        throw new axios.Cancel("Token expired");
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Location discovery must not send a cached country. The backend treats
    // X-Country-Code as the answer for IP lookups, which would freeze a stale GB.
    if (!isVisitorLocationLookup(config)) {
      const countryCode = normalizeCountryCode(
        getLocationCurrencyState().countryCode
      );
      if (countryCode) {
        config.headers["X-Country-Code"] = countryCode;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default authFetch;
