/** Origin used for Stripe/OAuth return URLs (must match the port you run the dev server on). */
export function getFrontendOrigin(): string {
  const fromEnv = import.meta.env.VITE_APP_URL as string | undefined;
  if (fromEnv?.trim()) {
    return fromEnv.trim().replace(/\/$/, "");
  }
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "";
}

export function getStripeOnboardingReturnUrl(): string {
  return `${getFrontendOrigin()}/service-provider/onboarding?stripe_return=1`;
}
