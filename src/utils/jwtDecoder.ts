/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Utility functions for JWT token decoding and Google profile data extraction
 */
import ToastProvider from "@/providers/ToastProvider";

export interface GoogleProfileData {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  profilePictureUrl?: string;
  emailVerified: boolean;
}

/**
 * Decodes a JWT token and extracts the payload
 */
export const decodeJWT = (token: string): any => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT token format");
    }
    const payload = parts[1];

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);

    const decoded = atob(padded);

    return JSON.parse(decoded);
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
};

/**
 * Extracts Google profile data from a JWT token
 */
export const extractGoogleProfileData = (
  idToken: string
): GoogleProfileData | null => {
  try {
    const payload = decodeJWT(idToken);
    if (!payload) {
      ToastProvider.error("Failed to decode JWT token");
      return null;
    }

    const profileData: GoogleProfileData = {
      firstName: payload.given_name || "",
      lastName: payload.family_name || "",
      fullName: payload.name || "",
      email: payload.email || "",
      profilePictureUrl: payload.picture || undefined,
      emailVerified: payload.email_verified || false,
    };

    return profileData;
  } catch (error) {
    console.error("Error extracting Google profile data:", error);
    return null;
  }
};

/**
 * Gets Google profile picture URL from JWT token
 */
export const getGoogleProfilePictureUrl = (
  idToken: string
): string | undefined => {
  const profileData = extractGoogleProfileData(idToken);
  return profileData?.profilePictureUrl;
};

/**
 * Gets Google user name from JWT token
 */
export const getGoogleUserName = (
  idToken: string
): { firstName: string; lastName: string; fullName: string } => {
  const profileData = extractGoogleProfileData(idToken);
  return {
    firstName: profileData?.firstName || "",
    lastName: profileData?.lastName || "",
    fullName: profileData?.fullName || "",
  };
};
