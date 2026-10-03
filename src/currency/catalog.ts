import authFetch from "@/api/axiosInterceptor";
import type { CurrencyCatalog, CurrencyDefinition } from "./types";
import {
  currencyForCountryCode,
  normalizeCurrencyCode,
} from "./countryCurrency";

export const CURRENCY_CATALOG_STORAGE_KEY = "currency_catalog";

const FALLBACK_SYMBOLS: Record<string, string> = {
  GBP: "£",
  EUR: "€",
  USD: "$",
  AED: "AED",
  LKR: "Rs",
};

const FALLBACK_MINIMUMS: Record<string, number> = {
  GBP: 1,
  AED: 2,
  USD: 1,
  EUR: 1,
  LKR: 100,
};

export const FALLBACK_CURRENCY_CATALOG: CurrencyCatalog = {
  defaultCurrency: "GBP",
  currencies: [
    { code: "GBP", name: "British Pound", symbol: "£", minimumTip: 1 },
    { code: "AED", name: "UAE Dirham", symbol: "AED", minimumTip: 2 },
    { code: "USD", name: "US Dollar", symbol: "$", minimumTip: 1 },
    { code: "EUR", name: "Euro", symbol: "€", minimumTip: 1 },
    { code: "LKR", name: "Sri Lankan Rupee", symbol: "Rs", minimumTip: 100 },
  ],
};

type Listener = () => void;

let catalog: CurrencyCatalog = readCachedCatalog() ?? FALLBACK_CURRENCY_CATALOG;
const listeners = new Set<Listener>();
let loadPromise: Promise<CurrencyCatalog> | null = null;

function notify() {
  listeners.forEach((listener) => listener());
}

function readCachedCatalog(): CurrencyCatalog | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(CURRENCY_CATALOG_STORAGE_KEY);
    if (!raw) return null;
    return normalizeCatalog(JSON.parse(raw));
  } catch {
    return null;
  }
}

function persistCatalog(next: CurrencyCatalog) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(CURRENCY_CATALOG_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore quota / private-mode failures. Memory still holds the catalog.
  }
}

function unwrapRecord(payload: unknown): Record<string, unknown> {
  let current: unknown = payload;
  for (let depth = 0; depth < 4; depth += 1) {
    if (!current || typeof current !== "object" || Array.isArray(current)) break;
    const record = current as Record<string, unknown>;
    const looksLikeCatalog =
      Array.isArray(record.currencies) ||
      Array.isArray(record.Currencies) ||
      typeof record.defaultCurrency === "string" ||
      typeof record.DefaultCurrency === "string";
    if (looksLikeCatalog) return record;
    if (record.data && typeof record.data === "object") {
      current = record.data;
      continue;
    }
    return record;
  }
  return {};
}

export function normalizeCatalog(payload: unknown): CurrencyCatalog | null {
  const record = unwrapRecord(payload);
  const list = Array.isArray(record.currencies)
    ? record.currencies
    : Array.isArray(record.Currencies)
      ? record.Currencies
      : [];

  const seen = new Set<string>();
  const currencies: CurrencyDefinition[] = [];

  for (const entry of list) {
    if (!entry || typeof entry !== "object") continue;
    const item = entry as Record<string, unknown>;
    const code = normalizeCurrencyCode(item.code ?? item.Code);
    if (!code || seen.has(code)) continue;
    seen.add(code);

    const minimumRaw = Number(item.minimumTip ?? item.MinimumTip);
    currencies.push({
      code,
      name: String(item.name ?? item.Name ?? code).trim() || code,
      symbol:
        String(item.symbol ?? item.Symbol ?? "").trim() ||
        FALLBACK_SYMBOLS[code] ||
        code,
      minimumTip: Number.isFinite(minimumRaw)
        ? minimumRaw
        : (FALLBACK_MINIMUMS[code] ?? 1),
    });
  }

  if (currencies.length === 0) return null;

  let defaultCurrency = normalizeCurrencyCode(
    record.defaultCurrency ?? record.DefaultCurrency
  );
  if (!currencies.some((item) => item.code === defaultCurrency)) {
    defaultCurrency = currencies[0].code;
  }

  return { defaultCurrency, currencies };
}

export function getCurrencyCatalog(): CurrencyCatalog {
  return catalog;
}

export function getCatalogDefaultCurrency(): string {
  return catalog.defaultCurrency || "GBP";
}

export function currencyForCountry(countryCode: string): string {
  return currencyForCountryCode(countryCode, getCatalogDefaultCurrency());
}

export function subscribeCurrencyCatalog(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function symbolForCurrency(currencyCode: string): string {
  const code = normalizeCurrencyCode(currencyCode) || "GBP";
  const match = catalog.currencies.find((item) => item.code === code);
  if (match?.symbol) return match.symbol;
  return FALLBACK_SYMBOLS[code] || code;
}

export function minimumTipForCurrency(currencyCode: string): number {
  const code = normalizeCurrencyCode(currencyCode) || "GBP";
  const match = catalog.currencies.find((item) => item.code === code);
  if (match && Number.isFinite(match.minimumTip)) return match.minimumTip;
  return FALLBACK_MINIMUMS[code] ?? 1;
}

function setCatalog(next: CurrencyCatalog) {
  catalog = next;
  notify();
}

export async function loadCurrencyCatalog(): Promise<CurrencyCatalog> {
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    try {
      const response = await authFetch.get("/currencies");
      const normalized = normalizeCatalog(response.data);
      if (!normalized) {
        setCatalog(FALLBACK_CURRENCY_CATALOG);
        return FALLBACK_CURRENCY_CATALOG;
      }
      setCatalog(normalized);
      persistCatalog(normalized);
      return normalized;
    } catch {
      setCatalog(FALLBACK_CURRENCY_CATALOG);
      return FALLBACK_CURRENCY_CATALOG;
    } finally {
      loadPromise = null;
    }
  })();

  return loadPromise;
}
