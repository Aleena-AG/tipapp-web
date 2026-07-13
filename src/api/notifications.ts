/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "react-query";
import { NotificationsResponse } from "@/utils/types/types";
import authFetch from "./axiosInterceptor";

export const useGetNotifications = (
  page: number = 1,
  limit: number = 20
): UseQueryResult<NotificationsResponse> => {
  return useQuery({
    queryKey: ["get_notifications_list", page, limit],
    queryFn: async () => {
      const response = await authFetch.get(
        `/notifications?page=${page}&limit=${limit}`
      );
      return response.data;
    },
    select(data) {
      return data?.data || data;
    },
    enabled: !!localStorage.getItem("token"), // Only fetch if user is authenticated
  });
};

export const useMarkNotificationAsRead = (
  onSuccess: () => void,
  onError: (error: string) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notificationId: string) => {
      return await authFetch.patch(`/notifications/${notificationId}`, {
        IsRead: true,
      });
    },
    onSuccess() {
      onSuccess();
      queryClient.invalidateQueries(["get_notifications_list"]);
    },
    onError(error: any) {
      onError(
        error?.response?.data?.message || "Failed to mark notification as read"
      );
    },
  });
};

export const useAddDeviceToken = (
  onSuccess: () => void,
  onError: (error: string) => void
) => {
  return useMutation({
    mutationFn: async (deviceData: {
      token: string;
      deviceUniqueId: string;
      deviceType: string;
    }) => {
      // UserID is set from JWT on the server — do not send it in the body.
      return await authFetch.post("/device-info", {
        token: deviceData.token,
        deviceUniqueId: deviceData.deviceUniqueId,
        deviceType: deviceData.deviceType,
      });
    },
    onSuccess,
    onError,
  });
};

export const logoutDevice = async (deviceUniqueId: string) => {
  return authFetch.post("/device-info/logout", { deviceUniqueId });
};
