/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, UseQueryResult } from "react-query";
import authFetch from "./axiosInterceptor";

function normalizeFooterPayload(payload: unknown): any[] {
  if (Array.isArray(payload)) return payload;
  if (
    payload &&
    typeof payload === "object" &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: any[] }).data;
  }
  return [];
}

export const GetFooterManagementDetails = (): UseQueryResult<any[]> => {
  return useQuery({
    queryKey: ["get_footer_management_details"],
    queryFn: async () => {
      try {
        const response = await authFetch.get<any>(`/footer-management`);
        return normalizeFooterPayload(response?.data);
      } catch (error: any) {
        const status = error?.response?.status;
        console.warn(
          "[footer-management] request failed:",
          status ?? error?.message ?? error
        );
        return [];
      }
    },
    initialData: [],
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};
