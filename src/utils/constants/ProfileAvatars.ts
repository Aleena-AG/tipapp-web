export type AvatarGender = "male" | "female";

export type ProfileAvatarOption = {
  id: string;
  label: string;
  path: string;
};

export const PROFILE_AVATARS: Record<AvatarGender, ProfileAvatarOption[]> = {
  male: [
    { id: "m-tipapp-blue", label: "TipTapp Blue", path: "/avatars/male/tipapp-blue.png" },
    { id: "m-tipapp-red", label: "TipTapp Red", path: "/avatars/male/tipapp-red.png" },
    { id: "m-hoodie-blue", label: "Casual Blue", path: "/avatars/male/hoodie-blue.png" },
    { id: "m-hoodie-red", label: "Casual Red", path: "/avatars/male/hoodie-red.png" },
    { id: "m-blazer", label: "Professional", path: "/avatars/male/blazer.png" },
    { id: "m-laptop", label: "Office", path: "/avatars/male/laptop.png" },
    { id: "m-driver", label: "Driver", path: "/avatars/male/driver.png" },
    { id: "m-chauffeur", label: "Chauffeur", path: "/avatars/male/chauffeur.png" },
    { id: "m-doctor", label: "Doctor", path: "/avatars/male/doctor.png" },
    { id: "m-chef", label: "Chef", path: "/avatars/male/chef.png" },
    { id: "m-barber", label: "Barber", path: "/avatars/male/barber.png" },
    { id: "m-cleaner", label: "Cleaner", path: "/avatars/male/cleaner.png" },
    { id: "m-bellhop", label: "Bellhop", path: "/avatars/male/bellhop.png" },
  ],
  female: [
    { id: "f-individual", label: "Individual", path: "/avatars/female/individual.png" },
    { id: "f-student", label: "Student", path: "/avatars/female/student.png" },
    { id: "f-business-owner", label: "Business Owner", path: "/avatars/female/business-owner.png" },
    { id: "f-freelancer", label: "Freelancer", path: "/avatars/female/freelancer.png" },
    { id: "f-service-provider", label: "Service Provider", path: "/avatars/female/service-provider.png" },
    { id: "f-delivery-partner", label: "Delivery Partner", path: "/avatars/female/delivery-partner.png" },
    { id: "f-driver", label: "Driver", path: "/avatars/female/driver.png" },
    { id: "f-hotel-porter", label: "Hotel Porter", path: "/avatars/female/hotel-porter.png" },
    { id: "f-airport-porter", label: "Airport Porter", path: "/avatars/female/airport-porter.png" },
    { id: "f-teacher", label: "Teacher", path: "/avatars/female/teacher.png" },
    { id: "f-chef", label: "Chef", path: "/avatars/female/chef.png" },
    { id: "f-casual", label: "Casual", path: "/avatars/female/casual.png" },
    { id: "f-teen", label: "Teen", path: "/avatars/female/teen.png" },
    { id: "f-stylist", label: "Stylist", path: "/avatars/female/stylist.png" },
    { id: "f-cleaner", label: "Cleaner", path: "/avatars/female/cleaner.png" },
    { id: "f-concierge", label: "Concierge", path: "/avatars/female/concierge.png" },
  ],
};

/** Keep built-in avatar paths relative so they always load from the current app. */
export function toAvatarRelativePath(urlOrPath?: string | null): string | null {
  if (!urlOrPath) return null;
  const match = urlOrPath.match(/\/avatars\/(male|female)\/[^/?#]+/i);
  return match ? match[0] : null;
}

export function isBuiltInAvatar(urlOrPath?: string | null): boolean {
  return Boolean(toAvatarRelativePath(urlOrPath));
}

/** Use for <img src>. Built-in avatars use local relative paths. */
export function resolveAvatarDisplaySrc(urlOrPath?: string | null): string {
  if (!urlOrPath) return "";
  const relative = toAvatarRelativePath(urlOrPath);
  if (relative) return relative;
  return urlOrPath;
}

/**
 * Value to store in backend ProfilePictureURL.
 * Built-in avatars are stored as absolute URLs using the current origin.
 */
export function resolveAvatarStorageUrl(urlOrPath: string): string {
  if (!urlOrPath) return urlOrPath;
  if (
    (urlOrPath.startsWith("http://") || urlOrPath.startsWith("https://")) &&
    !toAvatarRelativePath(urlOrPath)
  ) {
    return urlOrPath;
  }

  const relative = toAvatarRelativePath(urlOrPath) || urlOrPath;
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : (
          (import.meta.env.VITE_APP_URL as string | undefined) || ""
        ).replace(/\/$/, "");

  if (!origin) return relative;
  return `${origin}${relative.startsWith("/") ? relative : `/${relative}`}`;
}

export function getAvatarsForGender(gender: AvatarGender): ProfileAvatarOption[] {
  return PROFILE_AVATARS[gender] ?? [];
}

export function findAvatarByUrl(url?: string | null): ProfileAvatarOption | null {
  if (!url) return null;
  const relative = toAvatarRelativePath(url) || url;
  const all = [...PROFILE_AVATARS.male, ...PROFILE_AVATARS.female];
  return all.find((avatar) => relative.includes(avatar.path) || relative === avatar.path) ?? null;
}

export function inferGenderFromAvatarUrl(
  url?: string | null
): AvatarGender | null {
  if (!url) return null;
  if (url.includes("/avatars/female/")) return "female";
  if (url.includes("/avatars/male/")) return "male";
  return null;
}

export const PROFILE_GENDER_STORAGE_KEY = "profileGender";
