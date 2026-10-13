/**
 * Origin used for Stripe return URLs.
 * Prefer the current browser origin so live (Vercel) and local always return
 * to the site the user started onboarding from.
 */
export function getFrontendOrigin(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin.replace(/\/$/, "");
  }
  const fromEnv = (import.meta.env.VITE_APP_URL as string | undefined)?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }
  return "";
}

export function getStripeOnboardingReturnUrl(): string {
  return `${getFrontendOrigin()}/service-provider/onboarding?stripe_return=1`;
}

/** Public guest tip page. A phone camera must open this URL in the browser. */
export function getPublicTipUrl(keycloakId: string): string {
  const id = keycloakId.trim();
  return `${getFrontendOrigin()}/tip/${encodeURIComponent(id)}`;
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function decodePathPart(part: string): string {
  try {
    return decodeURIComponent(part).trim();
  } catch {
    return part.trim();
  }
}

/** Provider id from a scanned tip link, or from a raw Keycloak UUID. */
export function providerIdFromScan(raw: string): string {
  const value = raw.replace(/^\uFEFF/, "").trim();
  if (!value) return "";

  const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(candidate);
    const segments = url.pathname.split("/").filter(Boolean).map(decodePathPart);
    const tipIndex = segments.lastIndexOf("tip");
    const id = tipIndex >= 0 ? segments[tipIndex + 1] : "";
    if (id) return id;
  } catch {
    // Not a link. A bare UUID is still a provider id.
  }

  return UUID_PATTERN.test(value) ? value : "";
}
