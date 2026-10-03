export interface CurrencyDefinition {
  code: string;
  name: string;
  symbol: string;
  minimumTip: number;
}

export interface CurrencyCatalog {
  defaultCurrency: string;
  currencies: CurrencyDefinition[];
}

export interface LocationCurrencyState {
  displayCurrency: string;
  countryCode: string;
  country: string;
  userOverride: boolean;
}

export interface ResolvedLocation {
  countryCode: string;
  country: string;
  displayCurrency: string;
}
