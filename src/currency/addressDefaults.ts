import countryList from "react-select-country-list";
import { normalizeCountryCode } from "./countryCurrency";
import { currencyForCountry } from "./catalog";
import { getLocationCurrencyState } from "./locationStore";
import {
  extractUserCountryCode,
  extractUserCountryName,
} from "./userCurrency";

let countryNameByCode: Map<string, string> | null = null;

function namesByCode(): Map<string, string> {
  if (!countryNameByCode) {
    countryNameByCode = new Map(
      countryList()
        .getData()
        .map((entry: { value: string; label: string }) => [
          entry.value.toUpperCase(),
          entry.label,
        ])
    );
  }
  return countryNameByCode;
}

export function countryNameForIso(countryCode: string): string {
  const code = normalizeCountryCode(countryCode);
  if (!code) return "";
  return namesByCode().get(code) || "";
}

/** Map a typed or stored country name (or 2-letter code) to an ISO code. */
export function countryCodeFromName(countryName: string): string {
  const trimmed = countryName.trim();
  if (!trimmed) return "";
  if (/^[A-Za-z]{2}$/.test(trimmed)) return trimmed.toUpperCase();

  const name = trimmed.toLowerCase();
  if (name.includes("arab emirates") || name === "uae") return "AE";
  if (name === "united states" || name === "usa" || name === "us") return "US";
  if (
    name === "united kingdom" ||
    name === "great britain" ||
    name === "uk" ||
    name === "england"
  ) {
    return "GB";
  }
  if (name === "sri lanka" || name.includes("sri lanka")) return "LK";

  for (const [code, label] of namesByCode()) {
    if (label.toLowerCase() === name) return code;
  }
  return "";
}

export interface AddressDefaults {
  countryCode: string;
  countryName: string;
  currency: string;
}

export function resolveAddressDefaults(user?: unknown): AddressDefaults {
  const location = getLocationCurrencyState();
  const userCode = extractUserCountryCode(user);
  const countryCode =
    userCode || normalizeCountryCode(location.countryCode) || "GB";

  const countryName =
    extractUserCountryName(user) ||
    location.country.trim() ||
    countryNameForIso(countryCode) ||
    "United Kingdom";

  return {
    countryCode,
    countryName,
    currency: currencyForCountry(countryCode),
  };
}
