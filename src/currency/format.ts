import { symbolForCurrency } from "./catalog";
import { normalizeCurrencyCode } from "./countryCurrency";
import { getLocationCurrencyState } from "./locationStore";

/** Payload currency, otherwise the location store (user lock included), otherwise GBP. */
export function resolveDisplayCurrency(payloadCurrency?: unknown): string {
  const fromPayload = normalizeCurrencyCode(payloadCurrency);
  if (fromPayload) return fromPayload;
  return (
    normalizeCurrencyCode(getLocationCurrencyState().displayCurrency) || "GBP"
  );
}

function toAmount(amount: number | string): number {
  const value = typeof amount === "number" ? amount : parseFloat(amount);
  return Number.isFinite(value) ? value : 0;
}

function groupAmount(amount: number): string {
  const [whole, fraction] = amount.toFixed(2).split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${grouped}.${fraction}`;
}

/** `{symbol}{amount.toFixed(2)} {CODE}` */
export function formatMoney(
  amount: number | string,
  payloadCurrency?: unknown
): string {
  const code = resolveDisplayCurrency(payloadCurrency);
  const symbol = symbolForCurrency(code);
  return `${symbol}${toAmount(amount).toFixed(2)} ${code}`;
}

/** `{CODE} {grouped amount}` for balance labels. */
export function formatBalanceLabel(
  amount: number | string,
  payloadCurrency?: unknown
): string {
  const code = resolveDisplayCurrency(payloadCurrency);
  return `${code} ${groupAmount(toAmount(amount))}`;
}
