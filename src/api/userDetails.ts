import { UserDetails } from "@/utils/types/types";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "react-query";
import authFetch from "./axiosInterceptor";

export const useGetUserDetailsByKeyCloakID = (
  id: string
): UseQueryResult<UserDetails> => {
  return useQuery({
    queryKey: ["get_user_by_keycloak_id", id],
    queryFn: async () => {
      const response = await authFetch.get(`/user-details/keycloak/${id}`);
      return response.data;
    },
    select(data) {
      return data?.data?.data;
    },
  });
};

export const useGetCurrentUser = (): UseQueryResult<UserDetails> => {
  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    return !!(token && userType);
  };

  return useQuery({
    queryKey: ["get_current_user", "v2"],
    queryFn: async () => {
      const response = await authFetch.get(`/user-details/me`);
      return response.data.data;
    },
    select(data) {
      const userData = data;

      // Check if there's Google profile data in localStorage
      const googleProfileData = localStorage.getItem("googleProfileData");

      if (googleProfileData && userData) {
        try {
          const googleData = JSON.parse(googleProfileData);

          // Merge Google profile data with database data
          // Only use Google data if database doesn't have the field or it's empty/null
          const mergedData = {
            ...userData,
            ProfilePictureURL:
              userData.ProfilePictureURL ||
              googleData.profilePictureUrl ||
              userData.ProfilePictureURL,
            FirstName:
              userData.FirstName || googleData.firstName || userData.FirstName,
            LastName:
              userData.LastName || googleData.lastName || userData.LastName,
          };

          return mergedData;
        } catch (error) {
          console.error("Error parsing Google profile data:", error);
          return userData;
        }
      }

      return userData;
    },
    enabled: isAuthenticated(),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 2,
    retryDelay: 1000,
    refetchOnMount: true,
  });
};

export const useUpdateUser = (
  onSuccess: () => void,
  onError: (error: string) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UserDetails) => {
      // Gender is UI-only (avatar filter) — never send to backend
      const { Gender: _gender, ...payload } = data as UserDetails & {
        Gender?: string | null;
      };
      return await authFetch.patch(`/user-details`, payload);
    },
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries(["get_current_user", "v2"]);
      queryClient.invalidateQueries(["get_all_user_list"]);
    },
    onError: (error) => {
      //@ts-expect-error access error message
      onError(error.response?.data?.message || "An error occurred");
    },
  });
};

export const useCreateStripeAccount = () => {
  return useMutation(async () => {
    const response = await authFetch.post("/user-details/create-stripe-account");
    return response.data.data.connectedAccountId;
  });
};
