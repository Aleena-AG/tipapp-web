/** Eurozone ISO codes that display EUR. */
const EUROZONE = new Set([
  "AT",
  "BE",
  "CY",
  "DE",
  "EE",
  "ES",
  "FI",
  "FR",
  "GR",
  "HR",
  "IE",
  "IT",
  "LT",
  "LU",
  "LV",
  "MT",
  "NL",
  "PT",
  "SI",
  "SK",
]);

const CURRENCY_TO_COUNTRY: Record<string, string> = {
  AED: "AE",
  USD: "US",
  EUR: "DE",
  GBP: "GB",
  LKR: "LK",
};

export function isIsoCountryCode(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z]{2}$/.test(value.trim());
}

export function normalizeCountryCode(value: unknown): string {
  if (!isIsoCountryCode(value)) return "";
  return value.trim().toUpperCase();
}

export function normalizeCurrencyCode(value: unknown): string {
  if (typeof value !== "string") return "";
  const code = value.trim().toUpperCase();
  if (!code || code.length > 8) return "";
  return code;
}

/**
 * Country → display currency.
 * Unknown countries use `fallback` (catalog default, or GBP before the catalog loads).
 */
export function currencyForCountryCode(
  countryCode: string,
  fallback = "GBP"
): string {
  const code = normalizeCountryCode(countryCode);
  if (code === "AE") return "AED";
  if (code === "US") return "USD";
  if (code === "GB") return "GBP";
  if (code === "LK") return "LKR";
  if (EUROZONE.has(code)) return "EUR";
  const safeFallback = normalizeCurrencyCode(fallback) || "GBP";
  return safeFallback;
}

/**
 * Manual currency pick → country. Returns null when the currency has no mapping
 * so the caller can leave the country unchanged.
 */
export function countryCodeForCurrency(currency: string): string | null {
  const code = normalizeCurrencyCode(currency);
  return CURRENCY_TO_COUNTRY[code] ?? null;
}
