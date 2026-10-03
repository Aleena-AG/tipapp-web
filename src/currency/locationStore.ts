import {
  countryCodeForCurrency,
  normalizeCountryCode,
  normalizeCurrencyCode,
} from "./countryCurrency";
import type { LocationCurrencyState, ResolvedLocation } from "./types";

export const LOCATION_CURRENCY_STORAGE_KEY = "location_currency";

const EMPTY_STATE: LocationCurrencyState = {
  displayCurrency: "GBP",
  countryCode: "",
  country: "",
  userOverride: false,
};

type Listener = () => void;

const listeners = new Set<Listener>();

function readStoredState(): LocationCurrencyState {
  if (typeof localStorage === "undefined") return { ...EMPTY_STATE };
  try {
    const raw = localStorage.getItem(LOCATION_CURRENCY_STORAGE_KEY);
    if (!raw) return { ...EMPTY_STATE };
    const parsed = JSON.parse(raw) as Partial<LocationCurrencyState>;
    return {
      displayCurrency: normalizeCurrencyCode(parsed.displayCurrency) || "GBP",
      countryCode: normalizeCountryCode(parsed.countryCode),
      country: typeof parsed.country === "string" ? parsed.country : "",
      userOverride: parsed.userOverride === true,
    };
  } catch {
    return { ...EMPTY_STATE };
  }
}

let state: LocationCurrencyState = readStoredState();

function persist(next: LocationCurrencyState) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(LOCATION_CURRENCY_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore quota / private-mode failures.
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

function commit(next: LocationCurrencyState) {
  const same =
    next.displayCurrency === state.displayCurrency &&
    next.countryCode === state.countryCode &&
    next.country === state.country &&
    next.userOverride === state.userOverride;
  state = next;
  persist(next);
  if (!same) emit();
}

export function getLocationCurrencyState(): LocationCurrencyState {
  return state;
}

export function subscribeLocationCurrency(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** GPS / IP result. A signed-in override keeps displayCurrency. */
export function applyResolvedLocation(result: ResolvedLocation) {
  const current = state;
  const displayCurrency = normalizeCurrencyCode(result.displayCurrency);
  if (!displayCurrency) return;

  const countryCode = normalizeCountryCode(result.countryCode);
  const country = result.country?.trim() || "";

  if (!current.userOverride) {
    commit({
      displayCurrency,
      countryCode: countryCode || current.countryCode,
      country: country || current.country,
      userOverride: false,
    });
    return;
  }

  if (!current.countryCode && countryCode) {
    commit({
      ...current,
      countryCode,
      country: country || current.country,
    });
  }
}

/**
 * Signed-in user currency replaces detection and blocks later GPS/IP updates.
 * Missing user country fields are left as-is so a later location result can fill them.
 */
export function lockUserDisplayCurrency(input: {
  displayCurrency: string;
  countryCode?: string;
  country?: string;
}) {
  const displayCurrency = normalizeCurrencyCode(input.displayCurrency);
  if (!displayCurrency) return;

  const countryCode = normalizeCountryCode(input.countryCode);
  const country = input.country?.trim() || "";

  commit({
    displayCurrency,
    countryCode: countryCode || state.countryCode,
    country: country || state.country,
    userOverride: true,
  });
}

/** Manual currency selection. Mapped currencies also set the country. */
export function applyManualCurrency(currency: string) {
  const displayCurrency = normalizeCurrencyCode(currency);
  if (!displayCurrency) return;
  const mapped = countryCodeForCurrency(displayCurrency);
  commit({
    displayCurrency,
    userOverride: true,
    countryCode: mapped ?? state.countryCode,
    country: mapped ? "" : state.country,
  });
}

/** Logout / expired session: detection may update the currency again. */
export function releaseUserCurrencyOverride() {
  if (!state.userOverride) return;
  commit({ ...state, userOverride: false });
}
