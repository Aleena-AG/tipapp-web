import { UserDetails } from "@/utils/types/types";

/**
 * Get user data from localStorage
 * @returns UserDetails object or null if not found
 */
export const getUserFromLocalStorage = (): UserDetails | null => {
  try {
    const userData = localStorage.getItem("user");
    if (userData) {
      return JSON.parse(userData) as UserDetails;
    }
    return null;
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    return null;
  }
};

/**
 * Get user type from localStorage
 * @returns string or null if not found
 */
export const getUserTypeFromLocalStorage = (): string | null => {
  try {
    return localStorage.getItem("userType");
  } catch (error) {
    console.error("Error getting userType from localStorage:", error);
    return null;
  }
};

/**
 * Get token from localStorage
 * @returns string or null if not found
 */
export const getTokenFromLocalStorage = (): string | null => {
  try {
    return localStorage.getItem("token");
  } catch (error) {
    console.error("Error getting token from localStorage:", error);
    return null;
  }
};
