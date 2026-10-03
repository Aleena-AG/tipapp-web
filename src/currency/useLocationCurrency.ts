import { useSyncExternalStore } from "react";
import {
  getCurrencyCatalog,
  subscribeCurrencyCatalog,
} from "./catalog";
import {
  getLocationCurrencyState,
  subscribeLocationCurrency,
} from "./locationStore";
import type { CurrencyCatalog, LocationCurrencyState } from "./types";

export function useLocationCurrencyState(): LocationCurrencyState {
  return useSyncExternalStore(
    subscribeLocationCurrency,
    getLocationCurrencyState,
    getLocationCurrencyState
  );
}

export function useCurrencyCatalog(): CurrencyCatalog {
  return useSyncExternalStore(
    subscribeCurrencyCatalog,
    getCurrencyCatalog,
    getCurrencyCatalog
  );
}
