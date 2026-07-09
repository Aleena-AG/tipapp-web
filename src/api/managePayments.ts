/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "react-query";
import authFetch from "./axiosInterceptor";

export interface StripeConfigResponse {
  publishableKey: string;
}

export interface CreateTipPaymentIntentPayload {
  amount: number;
  currency: string;
  serviceProviderId: string;
}

export interface TipPaymentIntentResult {
  clientSecret: string;
  paymentIntentId: string;
}

export const useGetStripeConfig = (): UseQueryResult<StripeConfigResponse> => {
  return useQuery({
    queryKey: ["stripe_config"],
    queryFn: async () => {
      const response = await authFetch.get("/stripe/config");
      return response.data?.data as StripeConfigResponse;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateTipPaymentIntent = (
  onSuccess?: (result: TipPaymentIntentResult) => void,
  onError?: (error: string) => void
) => {
  return useMutation({
    mutationFn: async (data: CreateTipPaymentIntentPayload) => {
      const response = await authFetch.post(
        "/stripe/create-tip-payment-intent",
        data
      );
      return response.data?.data as TipPaymentIntentResult;
    },
    onSuccess: (result) => {
      onSuccess?.(result);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || error.message || "Failed to create payment";
      console.error("Tip payment intent error:", message);
      onError?.(message);
    },
  });
};

export const getPaymentIntentStatus = async (paymentIntentId: string) => {
  const response = await authFetch.get(
    `/stripe/payment-intent/${paymentIntentId}/status`
  );
  return response.data?.data;
};

export const useCreatePaymentMethod = (
  onSuccess: () => void,
  onError: (error: string) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      return await authFetch.post("/stripe/add-payment-method", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["get_card_details"]);
      onSuccess();
    },
    onError: (error: any) => {
      console.error(
        "Card details error:",
        error.response?.data?.message || error.message
      );
      onError(error.response?.data?.message || error.message);
    },
  });
};

export const useCreatePaymentIntent = (
  onSuccess: (paymentIntentId: string) => void,
  onError: (error: string) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      return await authFetch.post("/stripe/create-payment-intent", data);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries(["get_card_details"]);
      onSuccess(response.data.paymentIntentId);
    },
    onError: (error: any) => {
      console.error(
        "Card details error:",
        error.response?.data?.message || error.message
      );
      onError(error.response?.data?.message || error.message);
    },
  });
};

export const useGetPayementMethods = (): UseQueryResult<any> => {
  return useQuery({
    queryKey: ["get_card_details"],
    queryFn: async () => {
      const response = await authFetch.get("/stripe/get-payment-methods");
      return response?.data?.data;
    },
  });
};

export const useConfirmPayment = (
  onSuccess: () => void,
  onError: (error: string) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      return await authFetch.post("/stripe/confirm-payment-intent", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["get_card_details"]);
      onSuccess();
    },
    onError: (error: any) => {
      console.error(
        "Card details error:",
        error.response?.data?.message || error.message
      );
      onError(error.response?.data?.message || error.message);
    },
  });
};

export const useCreatePaypalOrder = (
  onSuccess: (approvalLink: string) => void,
  onError: (error: string) => void
) => {
  return useMutation({
    mutationFn: async (data: { amount: number; currencyCode: string }) => {
      return await authFetch.post("/paypal/create-order", data);
    },
    onSuccess: (response) => {
      const approvalLink = response.data.orderId.approvalLink;
      if (approvalLink) {
        onSuccess(approvalLink);
      } else {
        onError("Approval link not found");
      }
    },
    onError: (error: any) => {
      console.error(
        "PayPal order creation error:",
        error.response?.data?.message || error.message
      );
      onError(error.response?.data?.message || error.message);
    },
  });
};
