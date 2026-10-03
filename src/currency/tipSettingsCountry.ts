import { normalizeCountryCode } from "./countryCurrency";

function readName(user: Record<string, unknown> | null): string {
  if (!user) return "";
  const raw = user.country ?? user.Country;
  return typeof raw === "string" ? raw.trim().toLowerCase() : "";
}

/**
 * Country query for tip settings.
 * Returns undefined when the query should be omitted (the location header still goes out).
 */
export function tipSettingsCountryCode(user: unknown): string | undefined {
  if (!user || typeof user !== "object") return undefined;
  const record = user as Record<string, unknown>;
  const name = readName(record);

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
  if (name === "sri lanka") return "LK";

  const explicit =
    normalizeCountryCode(record.countryCode) ||
    normalizeCountryCode(record.CountryCode);
  if (explicit) return explicit;

  const countryField =
    normalizeCountryCode(record.Country) || normalizeCountryCode(record.country);
  if (countryField) return countryField;

  return undefined;
}
