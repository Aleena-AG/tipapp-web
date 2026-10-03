import authFetch from "@/api/axiosInterceptor";
import { currencyForCountry } from "./catalog";
import {
  applyResolvedLocation,
  getLocationCurrencyState,
} from "./locationStore";
import { normalizeCountryCode, normalizeCurrencyCode } from "./countryCurrency";
import type { ResolvedLocation } from "./types";

const NOMINATIM_USER_AGENT = "TipApp-Web/1.0 (location-currency)";

function unwrapRecord(payload: unknown): Record<string, unknown> {
  let current: unknown = payload;
  for (let depth = 0; depth < 4; depth += 1) {
    if (!current || typeof current !== "object" || Array.isArray(current)) break;
    const record = current as Record<string, unknown>;
    const looksLikeLocation =
      typeof record.countryCode === "string" ||
      typeof record.CountryCode === "string" ||
      typeof record.displayCurrency === "string" ||
      typeof record.DisplayCurrency === "string" ||
      typeof record.country === "string" ||
      typeof record.Country === "string";
    if (looksLikeLocation) return record;
    if (record.data && typeof record.data === "object") {
      current = record.data;
      continue;
    }
    return record;
  }
  return {};
}

function readString(record: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

export function normalizeLocationPayload(payload: unknown): ResolvedLocation | null {
  const record = unwrapRecord(payload);
  const countryCode = normalizeCountryCode(
    readString(record, ["countryCode", "CountryCode"])
  );
  const country = readString(record, ["country", "Country"]);
  let displayCurrency = normalizeCurrencyCode(
    readString(record, ["displayCurrency", "DisplayCurrency"])
  );

  if (!displayCurrency && countryCode) {
    displayCurrency = currencyForCountry(countryCode);
  }
  if (!displayCurrency) return null;

  return { countryCode, country, displayCurrency };
}

function withTimeout(ms: number): { signal: AbortSignal; cancel: () => void } {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return {
    signal: controller.signal,
    cancel: () => clearTimeout(timer),
  };
}

async function readGps(): Promise<{ lat: number; lng: number } | null> {
  if (typeof navigator === "undefined" || !navigator.geolocation) return null;

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => resolve(null),
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });
}

function locationSource(payload: unknown): string {
  return readString(unwrapRecord(payload), ["source", "Source"]).toLowerCase();
}

/** A "header" source is the cached country echoed back, not a fresh fix. */
function freshLocation(payload: unknown): ResolvedLocation | null {
  if (locationSource(payload) === "header") return null;
  return normalizeLocationPayload(payload);
}

async function locationFromCoordinates(
  lat: number,
  lng: number
): Promise<ResolvedLocation | null> {
  try {
    const response = await authFetch.get("/location", {
      params: { lat, lng },
    });
    const normalized = freshLocation(response.data);
    if (normalized) return normalized;
  } catch {
    // Fall through to Nominatim.
  }

  const timeout = withTimeout(5000);
  try {
    const url = new URL("https://nominatim.openstreetmap.org/reverse");
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lng));
    url.searchParams.set("format", "json");
    const headers = new Headers({ Accept: "application/json" });
    try {
      headers.set("User-Agent", NOMINATIM_USER_AGENT);
    } catch {
      // Browsers forbid overriding User-Agent. Nominatim still receives the browser UA.
    }
    const response = await fetch(url.toString(), {
      signal: timeout.signal,
      headers,
    });
    if (!response.ok) return null;
    const body = (await response.json()) as {
      address?: { country_code?: string; country?: string };
    };
    const countryCode = normalizeCountryCode(body.address?.country_code);
    if (!countryCode) return null;
    return {
      countryCode,
      country: body.address?.country?.trim() || "",
      displayCurrency: currencyForCountry(countryCode),
    };
  } catch {
    return null;
  } finally {
    timeout.cancel();
  }
}

async function locationFromIp(): Promise<ResolvedLocation | null> {
  try {
    const response = await authFetch.get("/location");
    const normalized = freshLocation(response.data);
    if (normalized) return normalized;
  } catch {
    // Fall through to ipapi.
  }

  const timeout = withTimeout(4000);
  try {
    const response = await fetch("https://ipapi.co/json/", {
      signal: timeout.signal,
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return null;
    const body = (await response.json()) as {
      country_code?: string;
      country_name?: string;
    };
    const countryCode = normalizeCountryCode(body.country_code);
    if (!countryCode) return null;
    return {
      countryCode,
      country: body.country_name?.trim() || "",
      displayCurrency: currencyForCountry(countryCode),
    };
  } catch {
    return null;
  } finally {
    timeout.cancel();
  }
}

async function locationFromCachedCountry(): Promise<ResolvedLocation | null> {
  const cached = normalizeCountryCode(getLocationCurrencyState().countryCode);
  if (!cached) return null;

  try {
    const response = await authFetch.get("/location", {
      params: { countryCode: cached },
    });
    const normalized = normalizeLocationPayload(response.data);
    if (normalized) return normalized;
  } catch {
    // Map the cached code locally.
  }

  return {
    countryCode: cached,
    country: getLocationCurrencyState().country,
    displayCurrency: currencyForCountry(cached),
  };
}

let runId = 0;

/**
 * GPS, then IP, then a cached country as a last resort.
 * A cached country is never returned before GPS and IP are tried.
 */
export async function resolveVisitorLocation(): Promise<void> {
  const id = ++runId;

  const gps = await readGps();
  if (id !== runId) return;

  if (gps) {
    const fromGps = await locationFromCoordinates(gps.lat, gps.lng);
    if (id !== runId) return;
    if (fromGps) {
      applyResolvedLocation(fromGps);
      return;
    }
  }

  const fromIp = await locationFromIp();
  if (id !== runId) return;
  if (fromIp) {
    applyResolvedLocation(fromIp);
    return;
  }

  const fromCache = await locationFromCachedCountry();
  if (id !== runId) return;
  if (fromCache) applyResolvedLocation(fromCache);
}

let listenerAttached = false;
let visibilityTimer: number | undefined;
let lastImmediateResolve = 0;

function onVisibilityChange() {
  if (typeof document === "undefined") return;
  if (document.visibilityState !== "visible") return;
  if (visibilityTimer) window.clearTimeout(visibilityTimer);
  visibilityTimer = window.setTimeout(() => {
    visibilityTimer = undefined;
    void resolveVisitorLocation();
  }, 8000);
}

/** First load resolves immediately. Later tab focuses wait 8 seconds. */
export function startLocationCurrencyResolution() {
  if (typeof document !== "undefined" && !listenerAttached) {
    listenerAttached = true;
    document.addEventListener("visibilitychange", onVisibilityChange);
  }

  const now = Date.now();
  if (now - lastImmediateResolve < 1000) return;
  lastImmediateResolve = now;
  void resolveVisitorLocation();
}
