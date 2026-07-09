import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js';

export function isValidPhoneNumber(value?: string, defaultCountry?: CountryCode): boolean {
  if (!value) return false;
  const phone = parsePhoneNumberFromString(value, defaultCountry);
  return phone ? phone.isValid() : false;
}
