import { UserDetails } from "@/utils/types/types";

export type UserNameParts = {
  firstName: string;
  lastName: string;
  fullName: string;
};

function readStoredUser(): Pick<UserDetails, "FirstName" | "LastName"> | null {
  try {
    const stored = localStorage.getItem("user");
    return stored ? (JSON.parse(stored) as UserDetails) : null;
  } catch {
    return null;
  }
}

function readGoogleProfile(): { firstName?: string; lastName?: string } | null {
  try {
    const googleProfile = localStorage.getItem("googleProfileData");
    return googleProfile
      ? (JSON.parse(googleProfile) as { firstName?: string; lastName?: string })
      : null;
  } catch {
    return null;
  }
}

export function resolveUserNameParts(
  user?: Pick<UserDetails, "FirstName" | "LastName"> | null
): UserNameParts {
  const stored = readStoredUser();
  const google = readGoogleProfile();

  const firstName =
    user?.FirstName?.trim() ||
    stored?.FirstName?.trim() ||
    google?.firstName?.trim() ||
    "";

  const lastName =
    user?.LastName?.trim() ||
    stored?.LastName?.trim() ||
    google?.lastName?.trim() ||
    "";

  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  return { firstName, lastName, fullName };
}

export function isUserProfileComplete(
  user?: Pick<UserDetails, "FirstName" | "LastName"> | null
): boolean {
  return Boolean(resolveUserNameParts(user).firstName);
}

export function toQrDownloadFileName(fullName: string): string {
  const safe = fullName
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .trim()
    .replace(/\s+/g, "_");
  return safe ? `${safe}_QRCode.png` : "QRCode.png";
}

/** Unwrap user-details/keycloak payloads (axios body may nest `data` several levels). */
export function parseKeycloakUserDetailsResponse(
  response: unknown
): UserDetails | null {
  if (!response || typeof response !== "object") return null;

  const root = response as Record<string, unknown>;
  const body =
    "data" in root && root.data && typeof root.data === "object"
      ? (root.data as Record<string, unknown>)
      : root;

  const candidates: unknown[] = [
    body,
    body.data,
    (body.data as Record<string, unknown> | undefined)?.data,
  ];

  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== "object") continue;
    const user = candidate as UserDetails;
    if (
      user.FirstName?.trim() ||
      user.LastName?.trim() ||
      user.Username?.trim()
    ) {
      return user;
    }
  }

  return null;
}

export function getUserDisplayName(
  user?: Pick<UserDetails, "FirstName" | "LastName" | "Username"> | null
): string {
  const firstName = user?.FirstName?.trim() || "";
  const lastName = user?.LastName?.trim() || "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  if (fullName) return fullName;
  return user?.Username?.trim() || "";
}
