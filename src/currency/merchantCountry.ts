import { countryCodeForCurrency, normalizeCountryCode } from "./countryCurrency";
import { getLocationCurrencyState } from "./locationStore";

/** Location country, otherwise the currency's merchant country, otherwise GB. */
export function resolveMerchantCountry(currency?: string): string {
  const located = normalizeCountryCode(getLocationCurrencyState().countryCode);
  if (located) return located;
  return countryCodeForCurrency(currency || "") || "GB";
}
