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

/**
 * Card tip calls stay public. A missing or expired token must not cancel them.
 * A still-valid token is attached so a signed-in tipper is saved as themselves.
 */
const PUBLIC_GUEST_PATHS = [
  "/stripe/create-tip-payment-intent",
  "/stripe/config",
  "/stripe/payment-intent/",
  "/user-details/keycloak/",
  "/tip-management/guest-review",
];

function isPublicGuestRequest(url: string | undefined): boolean {
  const path = requestPath(url);
  return PUBLIC_GUEST_PATHS.some((part) => path.includes(part));
}

export function getValidAccessToken(): string | null {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decodedToken: { exp?: number } = jwtDecode(token);
    if (typeof decodedToken.exp !== "number") return null;
    if (decodedToken.exp < Date.now() / 1000) return null;
    return token;
  } catch {
    return null;
  }
}

function clearStoredSession(): void {
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
    const storedToken = localStorage.getItem("token");
    const validToken = getValidAccessToken();
    const guestCall = isPublicGuestRequest(config.url);

    if (storedToken && !validToken) {
      clearStoredSession();
      if (!guestCall) {
        window.location.reload();
        throw new axios.Cancel("Token expired");
      }
    } else if (validToken) {
      config.headers.Authorization = `Bearer ${validToken}`;
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
