import { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LocateFixed } from "lucide-react";
import ToastProvider from "@/providers/ToastProvider";
import {
  approximateNetworkPlace,
  geocodeAddressQuery,
  reverseGeocode,
  searchAddressSuggestions,
  type ResolvedAddressPlace,
} from "@/utils/addressGeocode";

interface AddressLocationMapProps {
  address: string;
  city?: string;
  country?: string;
  onPlace: (place: ResolvedAddressPlace) => void;
}

interface MapPoint {
  lat: number;
  lng: number;
}

const WORLD_VIEW: MapPoint = { lat: 20, lng: 0 };

const pinIcon = L.divIcon({
  className: "address-map-pin",
  html: `<span style="display:block;width:18px;height:18px;border-radius:999px;background:#d71921;border:3px solid #fff;box-shadow:0 4px 10px rgba(0,0,0,.35)"></span>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function addressLine(place: ResolvedAddressPlace) {
  const street = place.address.trim();
  const city = place.city.trim();
  if (!street) return city;
  if (!city || street.toLowerCase().includes(city.toLowerCase())) return street;
  return `${street}, ${city}`;
}

function readGps(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("unavailable"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 60000,
    });
  });
}

function sameText(left: string, right: string) {
  return left.trim().toLowerCase() === right.trim().toLowerCase();
}

function MapEvents({
  lat,
  lng,
  zoom,
  onPick,
}: MapPoint & { zoom: number; onPick: (point: MapPoint) => void }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([lat, lng], zoom, { duration: 0.35 });
    const timer = window.setTimeout(() => map.invalidateSize(), 50);
    return () => window.clearTimeout(timer);
  }, [lat, lng, zoom, map]);

  useMapEvents({
    click(event) {
      onPick({ lat: event.latlng.lat, lng: event.latlng.lng });
    },
  });

  return null;
}

function PlaceMap({
  lat,
  lng,
  zoom,
  showMarker,
  onPick,
}: MapPoint & {
  zoom: number;
  showMarker: boolean;
  onPick: (point: MapPoint) => void;
}) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={zoom}
      style={{ height: "100%", width: "100%", background: "#d5e3f0" }}
      scrollWheelZoom
    >
      <TileLayer
        attribution="Tiles &copy; Esri"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
      />
      {showMarker ? <Marker position={[lat, lng]} icon={pinIcon} /> : null}
      <MapEvents lat={lat} lng={lng} zoom={zoom} onPick={onPick} />
    </MapContainer>
  );
}

const AddressLocationMap = ({
  address,
  city = "",
  country = "",
  onPlace,
}: AddressLocationMapProps) => {
  const [point, setPoint] = useState<MapPoint | null>(null);
  const [zoom, setZoom] = useState(2);
  const [locating, setLocating] = useState(false);
  const [suggestions, setSuggestions] = useState<ResolvedAddressPlace[]>([]);
  const selectedQuery = useRef("");
  const onPlaceRef = useRef(onPlace);
  const addressRef = useRef(address);
  const cityRef = useRef(city);
  const countryRef = useRef(country);
  onPlaceRef.current = onPlace;
  addressRef.current = address;
  cityRef.current = city;
  countryRef.current = country;

  const showPlace = (place: ResolvedAddressPlace, replaceAddress: boolean) => {
    setPoint({ lat: place.lat, lng: place.lng });
    if (!replaceAddress) return;

    const typedAddress = addressRef.current.trim();
    const nextAddress = addressLine(place);
    const citySame = !place.city || sameText(place.city, cityRef.current);
    const countrySame = !place.country || sameText(place.country, countryRef.current);
    const addressSame = sameText(nextAddress, typedAddress);
    if (citySame && countrySame && addressSame) return;

    onPlaceRef.current({
      ...place,
      address: nextAddress,
    });
  };

  const street = address.trim();

  useEffect(() => {
    if (street.length < 3 || street === selectedQuery.current) {
      setSuggestions([]);
      return undefined;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      void searchAddressSuggestions(street, controller.signal).then((places) => {
        if (controller.signal.aborted) return;
        setSuggestions(places);
      });
    }, 300);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [street]);

  const chooseSuggestion = (place: ResolvedAddressPlace) => {
    selectedQuery.current = addressLine(place);
    setSuggestions([]);
    setZoom(16);
    showPlace(place, true);
  };

  const placeQuery = street
    ? [street, city.trim(), country.trim()].filter(Boolean).join(", ")
    : [city.trim(), country.trim()].filter(Boolean).join(", ");

  useEffect(() => {
    if (placeQuery.length < 3) {
      setPoint(null);
      setZoom(2);
      return undefined;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      void geocodeAddressQuery(placeQuery, controller.signal)
        .then((place) => {
          if (controller.signal.aborted || !place) return;
          setZoom(street ? 16 : city.trim() ? 11 : 5);
          showPlace(place, false);
        })
        .catch((error: unknown) => {
          if (controller.signal.aborted) return;
          if (error instanceof DOMException && error.name === "AbortError") return;
        });
    }, 600);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [placeQuery, street, city]);

  const pickOnMap = async (next: MapPoint) => {
    setPoint(next);
    setZoom(16);
    const place = await reverseGeocode(next.lat, next.lng);
    if (!place) {
      ToastProvider.error("Could not read an address for this point.");
      return;
    }
    showPlace({ ...place, lat: next.lat, lng: next.lng }, true);
  };

  const locateOnMap = async () => {
    setLocating(true);
    try {
      let place: ResolvedAddressPlace | null = null;
      try {
        const position = await readGps();
        place = await reverseGeocode(
          position.coords.latitude,
          position.coords.longitude
        );
      } catch {
        place = null;
      }
      if (!place) place = await approximateNetworkPlace();
      if (!place) {
        ToastProvider.error("Type an address or click the map to set a location.");
        return;
      }
      setZoom(16);
      showPlace(place, true);
    } finally {
      setLocating(false);
    }
  };

  return (
    <div className="address-leaflet-map flex w-full flex-col gap-[8px] [&_.leaflet-container]:z-0 [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full [&_.leaflet-container]:font-[inherit] [&_.address-map-pin]:border-0 [&_.address-map-pin]:bg-transparent">
      {suggestions.length > 0 && (
        <ul className="z-20 max-h-[220px] overflow-y-auto rounded-md border border-border bg-card shadow-lg">
          {suggestions.map((place) => {
            const label = [place.address, place.city, place.country]
              .filter(Boolean)
              .join(", ");
            return (
              <li key={`${place.lat}-${place.lng}-${label}`}>
                <button
                  type="button"
                  className="w-full px-12 py-8 text-left text-[13px] text-[#0B2C4A] hover:bg-[#EAF3FA] dark:text-white dark:hover:bg-white/10"
                  onClick={() => chooseSuggestion(place)}
                >
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <button
        type="button"
        onClick={() => {
          void locateOnMap();
        }}
        disabled={locating}
        className="inline-flex h-[36px] w-fit items-center gap-[6px] rounded-md border border-[#0B538D] px-[12px] text-[13px] font-medium text-[#0B538D] disabled:opacity-60"
      >
        <LocateFixed size={15} aria-hidden />
        {locating ? "Finding location..." : "Use my location"}
      </button>
      <div className="h-[260px] w-full overflow-hidden rounded-md border border-border bg-[#d5e3f0]">
        <PlaceMap
          lat={(point ?? WORLD_VIEW).lat}
          lng={(point ?? WORLD_VIEW).lng}
          zoom={point ? zoom : 2}
          showMarker={Boolean(point)}
          onPick={(next) => {
            void pickOnMap(next);
          }}
        />
      </div>
    </div>
  );
};

export default AddressLocationMap;
