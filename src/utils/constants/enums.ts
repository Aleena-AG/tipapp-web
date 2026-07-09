import { resolveUserNameParts } from "@/utils/userProfile";

export enum UserRoles {
  SERVICEPROVIDER = "sp",
  TIPER = "tp",
  BOTH = "both",
}

/** Value is `Date.now()` when user picks SP as new account; expires after 30m. */
export const PENDING_SP_STRIPE_ONBOARDING_KEY = "pendingSpStripeOnboarding";

const PENDING_SP_MAX_MS = 30 * 60 * 1000;

export function isPendingSpStripeOnboarding(): boolean {
  if (typeof window === "undefined") return false;
  const raw = sessionStorage.getItem(PENDING_SP_STRIPE_ONBOARDING_KEY);
  if (!raw) return false;
  const t = Number(raw);
  if (Number.isNaN(t)) return raw === "1";
  return Date.now() - t < PENDING_SP_MAX_MS;
}

export function setPendingSpStripeOnboarding(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PENDING_SP_STRIPE_ONBOARDING_KEY, String(Date.now()));
}

export function clearPendingSpStripeOnboarding(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(PENDING_SP_STRIPE_ONBOARDING_KEY);
}

/** Set when user opened Stripe Connect in another tab — resume polling on return. */
export const STRIPE_ONBOARDING_LINK_OPENED_KEY = "stripeOnboardingLinkOpened";

const STRIPE_LINK_OPENED_MAX_MS = 60 * 60 * 1000;

export function markStripeOnboardingLinkOpened(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STRIPE_ONBOARDING_LINK_OPENED_KEY, String(Date.now()));
}

export function isStripeOnboardingLinkOpened(): boolean {
  if (typeof window === "undefined") return false;
  const raw = sessionStorage.getItem(STRIPE_ONBOARDING_LINK_OPENED_KEY);
  if (!raw) return false;
  const t = Number(raw);
  if (Number.isNaN(t)) return raw === "1";
  return Date.now() - t < STRIPE_LINK_OPENED_MAX_MS;
}

export function clearStripeOnboardingLinkOpened(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STRIPE_ONBOARDING_LINK_OPENED_KEY);
}

/** Parse create-account-link API payloads into a Stripe Connect URL. */
export function isStripeConnectAccountId(value: unknown): boolean {
  return typeof value === "string" && /^acct_[a-zA-Z0-9]+$/.test(value);
}

export function isStripeOnboardingUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  if (isStripeConnectAccountId(value)) return false;
  try {
    const { protocol, hostname } = new URL(value);
    return (
      (protocol === "https:" || protocol === "http:") &&
      (hostname === "connect.stripe.com" || hostname.endsWith(".stripe.com"))
    );
  } catch {
    return false;
  }
}

function collectResponseStrings(value: unknown, out: string[]): void {
  if (typeof value === "string") {
    out.push(value);
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const nested of Object.values(value as Record<string, unknown>)) {
    collectResponseStrings(nested, out);
  }
}

export function parseStripeAccountLinkResponse(
  data: unknown
): string | "already_onboarded" | null {
  if (data === "Account is already onboarded") return "already_onboarded";

  const strings: string[] = [];
  collectResponseStrings(data, strings);

  const httpsUrl = strings.find((value) => isStripeOnboardingUrl(value));
  if (httpsUrl) return httpsUrl;

  return null;
}

/** Set when Stripe Connect onboarding succeeds — user can access SP home. */
export const STRIPE_ONBOARDING_COMPLETE_KEY = "stripeOnboardingComplete";

export function openStripeOnboardingUrl(url: string): Window | null {
  if (!isStripeOnboardingUrl(url)) {
    console.error("Refusing to open invalid Stripe onboarding URL:", url);
    return null;
  }

  // Never navigate the current tab — only open Stripe in a new tab.
  return window.open(url, "_blank", "noopener,noreferrer");
}


export function markStripeOnboardingComplete(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STRIPE_ONBOARDING_COMPLETE_KEY, "1");
  clearPendingSpStripeOnboarding();
  clearStripeOnboardingLinkOpened();
}

export function isStripeOnboardingComplete(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(STRIPE_ONBOARDING_COMPLETE_KEY) === "1";
}

export function clearStripeOnboardingComplete(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STRIPE_ONBOARDING_COMPLETE_KEY);
}

/** Backend / storage may use `sp`, enum value, or legacy `SERVICEPROVIDER`. */
export function isServiceProviderRole(
  role: string | undefined | null
): boolean {
  if (role == null || role === "") return false;
  const r = String(role).trim();
  const lower = r.toLowerCase().replace(/[\s_-]/g, "");
  return (
    r === UserRoles.SERVICEPROVIDER ||
    r === "sp" ||
    r === "SERVICEPROVIDER" ||
    lower === "serviceprovider"
  );
}

/** Map API / legacy values to `sp` | `tp` | `both` for comparisons and localStorage. */
export function normalizeToCanonicalUserType(
  role: string | undefined | null
): string | undefined {
  if (role == null || role === "") return undefined;
  if (isServiceProviderRole(role)) return UserRoles.SERVICEPROVIDER;
  if (role === UserRoles.TIPER || role === "tp" || role === "TIPER") {
    return UserRoles.TIPER;
  }
  if (role === UserRoles.BOTH || role === "both" || role === "BOTH") {
    return UserRoles.BOTH;
  }
  return role;
}

export function isUserRegistrationComplete(
  user: { FirstName?: string; LastName?: string } | null | undefined
): boolean {
  // Profile may be complete in localStorage/Google cache before /me reflects it.
  const { firstName } = resolveUserNameParts(user);
  return Boolean(firstName);
}

export function getRegisterRoleForUser(
  user: { Role?: string } | null | undefined,
  activeUserType?: string | null,
  fallback: "sp" | "tp" = "tp"
): "sp" | "tp" {
  if (
    isServiceProviderRole(user?.Role) ||
    activeUserType === UserRoles.SERVICEPROVIDER ||
    activeUserType === "sp"
  ) {
    return "sp";
  }
  if (
    user?.Role === UserRoles.TIPER ||
    user?.Role === "tp" ||
    activeUserType === UserRoles.TIPER ||
    activeUserType === "tp"
  ) {
    return "tp";
  }
  return fallback;
}

/**
 * Incomplete profile: route to Stripe onboarding when user chose / is SP.
 * Prefer backend `Role`; if missing, trust `localStorage.userType` (set at user-selection).
 */
export function shouldIncompleteProfileUseStripeOnboarding(
  user: { Role?: string } | null | undefined
): boolean {
  const ut =
    typeof window !== "undefined" ? localStorage.getItem("userType") : null;
  if (user?.Role === UserRoles.TIPER || user?.Role === "tp") return false;
  if (ut === UserRoles.TIPER || ut === "tp") return false;
  if (isStripeOnboardingComplete()) return false;
  if (isPendingSpStripeOnboarding()) return true;
  if (isServiceProviderRole(user?.Role)) return true;
  return ut === UserRoles.SERVICEPROVIDER || ut === "sp";
}

/** Onboarding page + Stripe actions (handles `both` when acting as SP). */
export function canAccessServiceProviderStripeUi(
  user:
    | { Role?: string; ConnectedBankAccountId?: string }
    | null
    | undefined
): boolean {
  if (!user) return false;
  const ut =
    typeof window !== "undefined" ? localStorage.getItem("userType") : null;
  const actingAsSp = ut === UserRoles.SERVICEPROVIDER || ut === "sp";

  if (user.Role === UserRoles.BOTH || user.Role === "both") {
    return actingAsSp;
  }

  if (user.Role === UserRoles.TIPER || user.Role === "tp") {
    return (
      actingAsSp ||
      isPendingSpStripeOnboarding() ||
      Boolean(user.ConnectedBankAccountId)
    );
  }

  if (isPendingSpStripeOnboarding() && actingAsSp) {
    return true;
  }

  return isServiceProviderRole(user.Role) || actingAsSp;
}
