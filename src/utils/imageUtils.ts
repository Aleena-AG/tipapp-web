import defaultProfileImage from "@/assets/svg/profile-icon.svg";
import tipperLogo from "@/assets/images/tipper_logo.png";
import spLogo from "@/assets/images/sp_logo.png";
import appLogo from "@/assets/images/appLogo.png";
import tipperAvatar from "@/assets/images/tp-avatar.png";
import spAvatar from "@/assets/images/character-1.png";

export const DEFAULT_PROFILE_IMAGE = defaultProfileImage;
export const TIPPER_AVATAR = tipperAvatar;

const LEGACY_FIREBASE_HOST = "firebasestorage.googleapis.com";
const LEGACY_EHOSPITAL_BUCKET = "e-hospital";

/** Old e-hospital Firebase Storage URLs (billing disabled — do not request). */
export function isLegacyFirebaseImageUrl(
  url: string | null | undefined
): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  return (
    lower.includes(LEGACY_FIREBASE_HOST) &&
    lower.includes(LEGACY_EHOSPITAL_BUCKET)
  );
}

export function getRoleNavLogo(role: string | null | undefined): string {
  if (role === "tp") return tipperLogo;
  if (role === "sp") return spLogo;
  return appLogo;
}

export function getRoleAvatarFallback(role: string | null | undefined): string {
  if (role === "tp") return tipperAvatar;
  if (role === "sp") return spAvatar;
  return tipperAvatar;
}

/** Use local placeholder for missing or legacy Firebase profile URLs. */
export function resolveProfileImageSrc(
  url: string | null | undefined,
  fallback: string = DEFAULT_PROFILE_IMAGE
): string {
  if (!url?.trim()) return fallback;
  if (isLegacyFirebaseImageUrl(url)) return fallback;
  return url;
}
