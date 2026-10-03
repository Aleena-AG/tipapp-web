import { normalizeCurrencyCode } from "./countryCurrency";
import { extractUserDisplayCurrency } from "./userCurrency";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function coerceNumber(value: unknown): number | undefined {
  if (value == null || value === "") return undefined;
  const parsed = typeof value === "number" ? value : parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : undefined;
}

export interface DisplayFinancial {
  amount: number;
  currency: string;
}

/**
 * Display-currency figure from `financials.<key>` on the current-user payload.
 * Falls back to `TotalTipsGiven` / `TotalTipsGivenAED` style fields.
 */
export function readDisplayFinancial(
  user: unknown,
  key: "balance" | "totalTips" | "totalTipsGiven" | "availableWithdraw"
): DisplayFinancial {
  const record = asRecord(user);
  const financials = asRecord(record?.financials) ?? asRecord(record?.Financials);
  const bucket = asRecord(financials?.[key]);
  const currency =
    normalizeCurrencyCode(bucket?.displayCurrency) ||
    normalizeCurrencyCode(bucket?.currency) ||
    extractUserDisplayCurrency(user) ||
    "GBP";

  const amounts = asRecord(bucket?.amounts);
  const fromBucket =
    coerceNumber(bucket?.displayAmount) ??
    coerceNumber(bucket?.amount) ??
    (amounts ? coerceNumber(amounts[currency]) : undefined);

  if (fromBucket != null) {
    return { amount: fromBucket, currency };
  }

  if (key === "totalTipsGiven" && record) {
    const keyed = coerceNumber(record[`TotalTipsGiven${currency}`]);
    return {
      amount: keyed ?? coerceNumber(record.TotalTipsGiven) ?? 0,
      currency,
    };
  }

  if (key === "balance" && record) {
    return {
      amount: coerceNumber(record.balance) ?? coerceNumber(record.BalanceOriginal) ?? 0,
      currency,
    };
  }

  return { amount: 0, currency };
}
