import { CurrencyRates } from "@/utils/types/types";

export const fetchConversionRates = async (): Promise<CurrencyRates> => {
  const response = await fetch(`${import.meta.env.VITE_EXCHANGE_RATE_API}EUR`);
  const data = await response.json();
  return data.rates;
};
