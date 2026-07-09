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
