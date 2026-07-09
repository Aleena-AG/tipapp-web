import React, { createContext, useContext, ReactNode } from "react";
import { useGetNotifications } from "@/api/notifications";
import { NotificationsResponse } from "@/utils/types/types";

interface NotificationsContextType {
  notificationsData: NotificationsResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

export const NotificationsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Check if user is authenticated
  // const isAuthenticated = () => {
  //   const token = localStorage.getItem("token");
  //   const userType = localStorage.getItem("userType");
  //   return !!(token && userType);
  // };

  const {
    data: notificationsData,
    isLoading,
    isError,
    refetch,
  } = useGetNotifications();

  return (
    <NotificationsContext.Provider
      value={{ notificationsData, isLoading, isError, refetch }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }
  return context;
};
