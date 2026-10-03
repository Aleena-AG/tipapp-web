import { countryNameForIso } from "@/currency/addressDefaults";
import { normalizeCountryCode } from "@/currency/countryCurrency";

export interface ResolvedAddressPlace {
  address: string;
  city: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
}

interface NominatimAddress {
  house_number?: string;
  road?: string;
  pedestrian?: string;
  footway?: string;
  residential?: string;
  neighbourhood?: string;
  suburb?: string;
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  city_district?: string;
  county?: string;
  country?: string;
  country_code?: string;
}

interface NominatimResult {
  lat?: string;
  lon?: string;
  display_name?: string;
  address?: NominatimAddress;
}

function firstText(...values: Array<string | undefined>): string {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return "";
}

function placeFromNominatim(body: NominatimResult): ResolvedAddressPlace | null {
  const lat = Number(body.lat);
  const lng = Number(body.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  const details = body.address ?? {};
  const countryCode = normalizeCountryCode(details.country_code);
  const country = countryNameForIso(countryCode) || details.country?.trim() || "";
  const city = firstText(
    details.city,
    details.town,
    details.village,
    details.municipality,
    details.city_district,
    details.suburb,
    details.county
  );
  const road = firstText(
    details.road,
    details.pedestrian,
    details.residential,
    details.footway,
    details.neighbourhood
  );
  const street = [details.house_number?.trim(), road].filter(Boolean).join(" ");
  const address = street || body.display_name?.split(",")[0]?.trim() || "";
  if (!address && !city && !country) return null;

  return { address, city, country, countryCode, lat, lng };
}

interface PhotonFeature {
  geometry?: { coordinates?: [number, number] };
  properties?: {
    name?: string;
    street?: string;
    housenumber?: string;
    city?: string;
    district?: string;
    country?: string;
    countrycode?: string;
  };
}

function placeFromPhoton(feature: PhotonFeature | undefined): ResolvedAddressPlace | null {
  const coords = feature?.geometry?.coordinates;
  if (!coords) return null;
  const [lng, lat] = coords;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  const props = feature?.properties ?? {};
  const countryCode = normalizeCountryCode(props.countrycode);
  const country = countryNameForIso(countryCode) || props.country?.trim() || "";
  const city = firstText(props.city, props.district);
  const street = [props.housenumber?.trim(), props.street?.trim()].filter(Boolean).join(" ");
  const address = street || props.name?.trim() || "";
  if (!address && !city && !country) return null;

  return { address, city, country, countryCode, lat, lng };
}

async function readPhoton(
  url: URL,
  signal: AbortSignal
): Promise<ResolvedAddressPlace | null> {
  const response = await fetch(url.toString(), { signal });
  if (!response.ok) return null;
  const body = (await response.json()) as { features?: PhotonFeature[] };
  return placeFromPhoton(body.features?.[0]);
}

async function readNominatim(
  url: URL,
  signal: AbortSignal
): Promise<ResolvedAddressPlace | null> {
  const response = await fetch(url.toString(), {
    signal,
    headers: { Accept: "application/json" },
  });
  if (!response.ok) return null;
  const body = (await response.json()) as NominatimResult | NominatimResult[];
  const result = Array.isArray(body) ? body[0] : body;
  if (!result) return null;
  return placeFromNominatim(result);
}

function preferReadablePlace(
  first: ResolvedAddressPlace | null,
  second: ResolvedAddressPlace | null
): ResolvedAddressPlace | null {
  if (!first) return second;
  if (!second) return first;
  const firstLatin = /[A-Za-z]/.test(first.address);
  const secondLatin = /[A-Za-z]/.test(second.address);
  if (firstLatin !== secondLatin) return firstLatin ? first : second;
  return first;
}

export async function reverseGeocode(
  lat: number,
  lng: number,
  signal?: AbortSignal
): Promise<ResolvedAddressPlace | null> {
  const active = signal ?? new AbortController().signal;
  const photon = new URL("https://photon.komoot.io/reverse");
  photon.searchParams.set("lat", String(lat));
  photon.searchParams.set("lon", String(lng));
  photon.searchParams.set("lang", "en");

  const nominatim = new URL("https://nominatim.openstreetmap.org/reverse");
  nominatim.searchParams.set("lat", String(lat));
  nominatim.searchParams.set("lon", String(lng));
  nominatim.searchParams.set("format", "json");
  nominatim.searchParams.set("addressdetails", "1");
  nominatim.searchParams.set("accept-language", "en");

  const [fromPhoton, fromNominatim] = await Promise.all([
    readPhoton(photon, active).catch(() => null),
    readNominatim(nominatim, active).catch(() => null),
  ]);
  return preferReadablePlace(fromNominatim, fromPhoton);
}

/** Approximate place from the network when the browser blocks GPS. */
export async function approximateNetworkPlace(): Promise<ResolvedAddressPlace | null> {
  try {
    const response = await fetch("https://ipapi.co/json/", {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return null;
    const body = (await response.json()) as {
      city?: string;
      country_name?: string;
      country_code?: string;
      latitude?: number;
      longitude?: number;
    };
    const lat = Number(body.latitude);
    const lng = Number(body.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    const countryCode = normalizeCountryCode(body.country_code);
    const country = countryNameForIso(countryCode) || body.country_name?.trim() || "";
    const city = body.city?.trim() || "";
    const address = [city, country].filter(Boolean).join(", ");
    if (!address) return null;
    return { address, city, country, countryCode, lat, lng };
  } catch {
    return null;
  }
}

export async function searchAddressSuggestions(
  query: string,
  signal?: AbortSignal
): Promise<ResolvedAddressPlace[]> {
  const trimmed = query.trim();
  if (trimmed.length < 3) return [];
  const active = signal ?? new AbortController().signal;
  const url = new URL("https://photon.komoot.io/api/");
  url.searchParams.set("q", trimmed);
  url.searchParams.set("limit", "5");
  url.searchParams.set("lang", "en");

  try {
    const response = await fetch(url.toString(), { signal: active });
    if (!response.ok) return [];
    const body = (await response.json()) as { features?: PhotonFeature[] };
    const seen = new Set<string>();
    const places: ResolvedAddressPlace[] = [];
    for (const feature of body.features ?? []) {
      const place = placeFromPhoton(feature);
      if (!place) continue;
      const key = `${place.address}|${place.city}|${place.country}`.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      places.push(place);
    }
    return places;
  } catch {
    return [];
  }
}

export async function geocodeAddressQuery(
  query: string,
  signal?: AbortSignal
): Promise<ResolvedAddressPlace | null> {
  const trimmed = query.trim();
  if (trimmed.length < 3) return null;
  const active = signal ?? new AbortController().signal;

  const photon = new URL("https://photon.komoot.io/api/");
  photon.searchParams.set("q", trimmed);
  photon.searchParams.set("limit", "1");
  photon.searchParams.set("lang", "en");
  const fromPhoton = await readPhoton(photon, active).catch(() => null);
  if (fromPhoton) return fromPhoton;

  const nominatim = new URL("https://nominatim.openstreetmap.org/search");
  nominatim.searchParams.set("q", trimmed);
  nominatim.searchParams.set("format", "json");
  nominatim.searchParams.set("addressdetails", "1");
  nominatim.searchParams.set("limit", "1");
  nominatim.searchParams.set("accept-language", "en");
  return readNominatim(nominatim, active);
}
