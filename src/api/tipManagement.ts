/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "react-query";
import authFetch from "./axiosInterceptor";
import ToastProvider from "@/providers/ToastProvider";
import { CURRENT_USER_QUERY_KEY, refreshUserBalanceAfterWithdrawal } from "@/hooks/useStripeOnboardingStatus";
import {
  GetBalanceAmount,
  GetTipsApiResponse,
  RatingsSummaryResponse,
  TipCommentsType,
  AddWithdrawalType,
  CreateWithdrawalResponse,
  PaginatedWithdrawHistoryResponse,
  WithdrawalInvoice,
  WithdrawHistoryItem,
  BalanceTransferItem,
  PaginatedBalanceTransferResponse,
  MetaDataType,
  RatingsSummaryIDResponse,
} from "@/utils/types/types";

export const useGetTipHistoryDetails =
  (): UseQueryResult<GetTipsApiResponse> => {
    return useQuery({
      queryKey: ["get_Tip_history"],
      queryFn: async () => {
        return await authFetch.get("/tip-management", {});
      },
      select(data) {
        return data?.data?.data;
      },
    });
  };

export const useGetTipHistoryDetailsByTipper =
  (): UseInfiniteQueryResult<GetTipsApiResponse> => {
    return useInfiniteQuery({
      queryKey: ["get_Tip_history_by_tipper"],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await authFetch.get(
          `/tip-management/tipper?page=${pageParam}`,
          {}
        );
        return response?.data?.data;
      },
      getNextPageParam: (lastPage) => {
        const nextPage = lastPage.meta.currentPage + 1;
        return nextPage <= lastPage.meta.totalPages ? nextPage : undefined;
      },
    });
  };

export const useGetTipHistoryDetailsByServiceProvider =
  (): UseInfiniteQueryResult<GetTipsApiResponse> => {
    return useInfiniteQuery({
      queryKey: ["get_Tip_history_by_service_provider"],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await authFetch.get(
          `/tip-management/service-provider?page=${pageParam}`,
          {}
        );
        return response?.data?.data;
      },
      getNextPageParam: (lastPage) => {
        const nextPage = lastPage.meta.currentPage + 1;
        return nextPage <= lastPage.meta.totalPages ? nextPage : undefined;
      },
    });
  };

export const useGetMyTipsPercentage =
  (): UseQueryResult<RatingsSummaryResponse> => {
    return useQuery({
      queryKey: ["get_my_tips_percentage"],
      queryFn: async () => {
        return await authFetch.get("/tip-management/ratings-summary", {});
      },
      select(data) {
        return data?.data?.data;
      },
    });
  };

export const useGetTipsPercentageByID =
  (): UseQueryResult<RatingsSummaryResponse> => {
    return useQuery({
      queryKey: ["get_tips_percentage"],
      queryFn: async () => {
        return await authFetch.get("/tip-management/ratings-summary", {});
      },
      select(data) {
        return data?.data?.data;
      },
    });
  };

export const useGetBalanceAmount = (currency?: string): UseQueryResult<GetBalanceAmount> => {
  return useQuery({
    queryKey: ["get_Tip_balance", currency],
    queryFn: async () => {
      // Fetch user details to get BalanceOriginal
      return await authFetch.get("/user-details/me");
    },
    select(data) {
      const userDetails = data?.data?.data;
      return {
        balance: userDetails?.BalanceOriginal || 0,
        totalEarned:
          userDetails?.TotalTipsOriginal ?? userDetails?.TotalTips ?? 0,
      };
    },
  });
};

function coerceNumber(value: unknown): number | undefined {
  if (value == null || value === "") return undefined;
  const parsed = typeof value === "number" ? value : parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function unwrapWithdrawalPayload(raw: unknown): Record<string, unknown> {
  if (!raw || typeof raw !== "object") return {};

  const root = raw as Record<string, unknown>;
  if (root.invoice) return root;

  const nested = root.data;
  if (nested && typeof nested === "object") {
    const nestedRecord = nested as Record<string, unknown>;
    if (nestedRecord.invoice) return nestedRecord;

    const deep = nestedRecord.data;
    if (deep && typeof deep === "object") {
      return deep as Record<string, unknown>;
    }
  }

  return root;
}

function normalizeWithdrawalResponse(raw: unknown): CreateWithdrawalResponse {
  const data = unwrapWithdrawalPayload(raw);
  const invoice = data.invoice as WithdrawalInvoice;
  const currency = String(data.currency || invoice?.Currency || "GBP").toUpperCase();
  const amounts = data.amounts as Record<string, number> | undefined;

  const balance =
    coerceNumber(data.balance) ??
    coerceNumber(data.amount) ??
    coerceNumber(amounts?.[currency]) ??
    coerceNumber(amounts?.GBP) ??
    0;

  const withdrawAmountInAED =
    coerceNumber(data.withdrawAmountInAED) ??
    coerceNumber(data.amountAED) ??
    coerceNumber(amounts?.AED) ??
    0;

  return {
    invoice,
    balance,
    withdrawAmountInAED,
  };
}

export const useAddWithdrawTip = (
  onSuccess: (payload: CreateWithdrawalResponse, message: string) => void,
  onError: (error: string) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AddWithdrawalType & { Currency?: string }) => {
      // CreateInvoiceDto only — UserID comes from JWT on the server.
      const payload = {
        PaymentMethod: data.PaymentMethod,
        TotalAmount: Number(data.TotalAmount),
        Currency: data.Currency || "GBP",
      };
      const response = await authFetch.post("/invoices", payload);
      const body = response.data as {
        data?: unknown;
        message?: string;
      };

      return {
        payload: body?.data ?? response.data,
        message: body?.message ?? "Invoice created successfully",
      };
    },
    onSuccess: ({ payload, message }) => {
      queryClient.invalidateQueries(["get_Withdraw_history"]);
      queryClient.invalidateQueries(["get_Tip_history"]);
      queryClient.invalidateQueries(["get_Tip_balance"]);
      refreshUserBalanceAfterWithdrawal(queryClient, payload.balance);
      onSuccess(normalizeWithdrawalResponse(payload), message);
    },
    onError: (error) => {
      //@ts-expect-error access error
      onError(error?.response?.data?.message);
    },
  });
};

export const useWithdrawFromStripe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      return await authFetch.post("/invoices/withdraw", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["get_Withdraw_history"]);
      queryClient.invalidateQueries(["get_Tip_history"]);
      queryClient.invalidateQueries(["get_Tip_balance"]);
      void queryClient.invalidateQueries(CURRENT_USER_QUERY_KEY);
    },
    onError: (error) => {
      console.error("Withdraw error:", error);
    },
  });
};

export const useAddTip = () => {
  return useMutation<any, any, any>({
    mutationFn: async (data: any) => {
      // Only send CreateTipManagementDto fields (forbidNonWhitelisted).
      // TipperID is set from JWT on the server — do not send identity fields.
      const tipDate =
        data.TipDate instanceof Date
          ? data.TipDate.toISOString()
          : data.TipDate;

      const payload: Record<string, unknown> = {
        ServiceProviderID: data.ServiceProviderID,
        TipDate: tipDate,
      };

      if (data.paymentIntentId) {
        payload.paymentIntentId = data.paymentIntentId;
      }
      if (data.paymentMethodType) {
        payload.paymentMethodType = data.paymentMethodType;
      }
      if (data.Amount != null && data.paymentMethodType === "BALANCE") {
        payload.Amount = data.Amount;
      }
      if (data.Currency && data.paymentMethodType === "BALANCE") {
        payload.Currency = data.Currency;
      }
      if (data.Review != null && data.Review !== "") {
        payload.Review = data.Review;
      }
      if (data.Rating != null && data.Rating > 0) {
        payload.Rating = data.Rating;
      }
      if (data.Comment != null && data.Comment !== "") {
        payload.Comment = data.Comment;
      }
      if (data.FeedBackPictureURL) {
        payload.FeedBackPictureURL = data.FeedBackPictureURL;
      }

      return await authFetch.post("/tip-management", payload);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || "Failed to send tip";
      console.error("Tip error:", errorMessage);
      ToastProvider.error(errorMessage);
    },
  });
};

export const useAddComment = (
  onSuccess: () => void,
  onError: (error: string) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: TipCommentsType) => {
      return await authFetch.patch(
        `/tip-management/${data.TipId}/add-comment`,
        {
          comment: data.Comment,
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["get_Tip_history_by_service_provider"]);
      onSuccess();
    },
    onError: (error) => {
      //@ts-expect-error access error
      onError(error?.response?.data?.message);
    },
  });
};

const defaultWithdrawHistoryMeta: MetaDataType = {
  totalItems: 0,
  itemCount: 0,
  itemsPerPage: 10,
  totalPages: 1,
  currentPage: 1,
};

function normalizeWithdrawHistoryPage(
  raw: unknown
): PaginatedWithdrawHistoryResponse {
  if (!raw || typeof raw !== "object") {
    return { items: [], meta: defaultWithdrawHistoryMeta };
  }

  const root = raw as Record<string, unknown>;

  if (Array.isArray(root.items)) {
    const meta = (root.meta as Partial<MetaDataType>) ?? {};
    return {
      items: root.items as WithdrawHistoryItem[],
      meta: {
        totalItems: Number(meta.totalItems ?? root.items.length),
        itemCount: Number(meta.itemCount ?? root.items.length),
        itemsPerPage: Number(meta.itemsPerPage ?? root.items.length ?? 10),
        totalPages: Number(meta.totalPages ?? 1),
        currentPage: Number(meta.currentPage ?? 1),
      },
    };
  }

  if (root.data && typeof root.data === "object") {
    return normalizeWithdrawHistoryPage(root.data);
  }

  const list =
    (Array.isArray(root.withdrawals) && root.withdrawals) ||
    (Array.isArray(root.invoices) && root.invoices) ||
    (Array.isArray(root.results) && root.results) ||
    (Array.isArray(raw) ? raw : []);

  const metaSource = (root.meta ?? root.pagination ?? {}) as Partial<MetaDataType>;
  const items = list as WithdrawHistoryItem[];

  return {
    items,
    meta: {
      totalItems: Number(metaSource.totalItems ?? items.length),
      itemCount: Number(metaSource.itemCount ?? items.length),
      itemsPerPage: Number(metaSource.itemsPerPage ?? items.length ?? 10),
      totalPages: Number(metaSource.totalPages ?? 1),
      currentPage: Number(metaSource.currentPage ?? 1),
    },
  };
}

export const useGetWithdrawHistoryByServiceProvider =
  (): UseInfiniteQueryResult<PaginatedWithdrawHistoryResponse> => {
    return useInfiniteQuery({
      queryKey: ["get_Withdraw_history"],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await authFetch.get(
          `/invoices/withdrawals?page=${pageParam}`
        );
        const raw = response?.data?.data ?? response?.data;
        return normalizeWithdrawHistoryPage(raw);
      },
      getNextPageParam: (lastPage) => {
        if (!lastPage?.meta) return undefined;
        const nextPage = Number(lastPage.meta.currentPage) + 1;
        return nextPage <= Number(lastPage.meta.totalPages) ? nextPage : undefined;
      },
    });
  };

function normalizeBalanceTransferPage(
  raw: unknown
): PaginatedBalanceTransferResponse {
  if (!raw || typeof raw !== "object") {
    return { items: [], meta: defaultWithdrawHistoryMeta };
  }

  const root = raw as Record<string, unknown>;

  if (Array.isArray(root.items)) {
    const meta = (root.meta as Partial<MetaDataType>) ?? {};
    return {
      items: root.items as BalanceTransferItem[],
      meta: {
        totalItems: Number(meta.totalItems ?? root.items.length),
        itemCount: Number(meta.itemCount ?? root.items.length),
        itemsPerPage: Number(meta.itemsPerPage ?? root.items.length ?? 10),
        totalPages: Number(meta.totalPages ?? 1),
        currentPage: Number(meta.currentPage ?? 1),
      },
    };
  }

  if (root.data && typeof root.data === "object") {
    return normalizeBalanceTransferPage(root.data);
  }

  return { items: [], meta: defaultWithdrawHistoryMeta };
}

export const useGetBalanceTransfers =
  (): UseInfiniteQueryResult<PaginatedBalanceTransferResponse> => {
    return useInfiniteQuery({
      queryKey: ["get_Balance_transfers"],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await authFetch.get(
          `/tip-management/balance-transfers?page=${pageParam}`
        );
        const raw = response?.data?.data ?? response?.data;
        return normalizeBalanceTransferPage(raw);
      },
      getNextPageParam: (lastPage) => {
        if (!lastPage?.meta) return undefined;
        const nextPage = Number(lastPage.meta.currentPage) + 1;
        return nextPage <= Number(lastPage.meta.totalPages) ? nextPage : undefined;
      },
    });
  };

  export const useGetRatingSummaryByID = (
    userID: string
  ): UseQueryResult<RatingsSummaryIDResponse> => {
    return useQuery({
      queryKey: ["get_rating_summary", userID],
      queryFn: async () => {
        return await authFetch.get(`/tip-management/ratings-summary/${userID}`);
      },
      select(data) {
        return data?.data?.data;
      },
    });
  };


export const useWithdrawAndTipLimit =()=>{
    return useQuery({
      queryKey: ["get_withdraw_limit"],
      queryFn: async () => {
        return await authFetch.get(`/settings-gateway/tip-settings`);
      },
      select(data) {
        return data?.data?.data;
      },
    });
  }


  export const useTipinglimit =()=>{

    return useQuery({
      queryKey: ["get_tip_limit"],
      queryFn: async () => {
        return await authFetch.get(`/settings-gateway/tip-settings`);
      },
      select(data) {
        return data?.data?.data;
      },
    });
  }

