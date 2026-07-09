 
 
import {
  useMutation,
  // useQueryClient,
} from "react-query";
import authFetch from "./axiosInterceptor";
import { getStripeOnboardingReturnUrl } from "@/utils/appUrl";

// export const useCreateAccountLink = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (data: any) => {
//       return await authFetch.post("/stripe/create-account-link", {
//         connectedAccountId: data.connectedAccountId,
//       });
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(["get_Withdraw_history"]);
//       queryClient.invalidateQueries(["get_Tip_history"]);
//       queryClient.invalidateQueries(["get_Tip_balance"]);
//     },
//     onError: (error) => {
//       console.error("Withdraw error:", error);
//     },
//   });
// };

export const useCreateAccountLink = () => {
  return useMutation(async (connectedAccountId: string) => {
    const returnUrl = getStripeOnboardingReturnUrl();
    const response = await authFetch.post("/stripe/create-account-link", {
      connectedAccountId,
      returnUrl,
      refreshUrl: returnUrl,
      return_url: returnUrl,
      refresh_url: returnUrl,
    });
    return response.data?.data ?? response.data;
  });
};

export const useCheckAccountStatus = () => {
  return useMutation(async (connectedAccountId: string) => {
    const response = await authFetch.post("/stripe/check-onboarding-status", {
      connectedAccountId,
    });
    const payload = response.data?.data ?? response.data;
    return Boolean(
      payload?.isOnboarded ??
        payload?.is_onboarded ??
        response.data?.isOnboarded
    );
  });
};

