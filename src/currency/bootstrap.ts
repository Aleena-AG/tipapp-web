import { loadCurrencyCatalog } from "./catalog";
import { releaseUserCurrencyOverride } from "./locationStore";
import { startLocationCurrencyResolution } from "./resolveLocation";

let started = false;

/** Load the public currency catalog and resolve the visitor location once per page. */
export function bootstrapCurrency() {
  if (started) return;
  started = true;
  // A previous signed-in lock must not freeze currency after logout.
  if (typeof localStorage === "undefined" || !localStorage.getItem("token")) {
    releaseUserCurrencyOverride();
  }
  void loadCurrencyCatalog();
  startLocationCurrencyResolution();
}
