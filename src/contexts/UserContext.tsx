import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { useGetCurrentUser } from "@/api/userDetails";
import { UserDetails } from "@/utils/types/types";
import { lockUserDisplayCurrency } from "@/currency/locationStore";
import {
  extractUserCountryCode,
  extractUserCountryName,
  extractUserDisplayCurrency,
} from "@/currency/userCurrency";

interface UserContextType {
  userDetails: UserDetails | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const {
    data: userDetails,
    isLoading,
    isError,
    refetch,
  } = useGetCurrentUser();

  useEffect(() => {
    const displayCurrency = extractUserDisplayCurrency(userDetails);
    if (!displayCurrency) return;
    lockUserDisplayCurrency({
      displayCurrency,
      countryCode: extractUserCountryCode(userDetails),
      country: extractUserCountryName(userDetails),
    });
  }, [userDetails]);

  return (
    <UserContext.Provider value={{ userDetails, isLoading, isError, refetch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

