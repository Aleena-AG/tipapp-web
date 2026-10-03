import { normalizeCountryCode, normalizeCurrencyCode } from "./countryCurrency";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function nestedCurrency(value: unknown): string {
  const record = asRecord(value);
  if (!record) return "";
  return normalizeCurrencyCode(
    record.currency ?? record.displayCurrency ?? record.Currency
  );
}

/**
 * Read a saved display currency from a current-user payload.
 * Order: currency, displayCurrency, Currency, then financials balance / tips.
 */
export function extractUserDisplayCurrency(user: unknown): string {
  const record = asRecord(user);
  if (!record) return "";

  const direct = normalizeCurrencyCode(
    record.currency ?? record.displayCurrency ?? record.Currency
  );
  if (direct) return direct;

  const financials =
    asRecord(record.financials) ?? asRecord(record.Financials) ?? {};

  return (
    nestedCurrency(financials.balance) ||
    nestedCurrency(financials.totalTips) ||
    nestedCurrency(financials.totalTipsGiven) ||
    nestedCurrency(record.balance) ||
    nestedCurrency(record.totalTips) ||
    nestedCurrency(record.totalTipsGiven) ||
    ""
  );
}

export function extractUserCountryCode(user: unknown): string {
  const record = asRecord(user);
  if (!record) return "";
  return (
    normalizeCountryCode(record.countryCode) ||
    normalizeCountryCode(record.CountryCode) ||
    normalizeCountryCode(record.Country) ||
    normalizeCountryCode(record.country)
  );
}

export function extractUserCountryName(user: unknown): string {
  const record = asRecord(user);
  if (!record) return "";
  const candidates = [record.country, record.Country];
  for (const candidate of candidates) {
    if (typeof candidate !== "string") continue;
    const trimmed = candidate.trim();
    if (!trimmed || normalizeCountryCode(trimmed)) continue;
    return trimmed;
  }
  return "";
}
