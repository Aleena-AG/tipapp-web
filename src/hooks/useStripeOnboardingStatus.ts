import { useCallback, useEffect, useState } from "react";
import { QueryClient, useQueryClient } from "react-query";
import { useGetCurrentUser } from "@/api/userDetails";
import { useCheckAccountStatus } from "@/api/withdraw";
import { UserDetails } from "@/utils/types/types";
import { isStripeOnboardingComplete } from "@/utils/constants/enums";

export const CURRENT_USER_QUERY_KEY = ["get_current_user", "v2"] as const;

export function patchCurrentUserOnboarded(queryClient: QueryClient): void {
  queryClient.setQueryData<UserDetails | undefined>(
    CURRENT_USER_QUERY_KEY,
    (old) => (old ? { ...old, isOnboarded: true } : old)
  );
}

export function patchCurrentUserBalance(
  queryClient: QueryClient,
  balance: number
): void {
  queryClient.setQueryData<UserDetails | undefined>(
    CURRENT_USER_QUERY_KEY,
    (old) =>
      old
        ? {
            ...old,
            BalanceOriginal: balance,
            balance,
          }
        : old
  );
}

export function refreshUserBalanceAfterWithdrawal(
  queryClient: QueryClient,
  balance?: number
): void {
  if (balance != null && Number.isFinite(balance)) {
    patchCurrentUserBalance(queryClient, balance);
  }
  void queryClient.invalidateQueries(CURRENT_USER_QUERY_KEY);
}

export function useStripeOnboardingStatus() {
  const queryClient = useQueryClient();
  const { data: currentUser, isLoading } = useGetCurrentUser();
  const { mutateAsync: checkAccountStatus } = useCheckAccountStatus();
  const [apiConfirmedOnboarded, setApiConfirmedOnboarded] = useState(false);

  const connectedBankAccountId = currentUser?.ConnectedBankAccountId;
  const sessionComplete = isStripeOnboardingComplete();
  const isOnboarded =
    sessionComplete ||
    apiConfirmedOnboarded ||
    currentUser?.isOnboarded === true;

  const verifyWithStripe = useCallback(async (): Promise<boolean> => {
    if (!connectedBankAccountId || isOnboarded) return isOnboarded;
    try {
      const status = await checkAccountStatus(connectedBankAccountId);
      if (status) {
        setApiConfirmedOnboarded(true);
        patchCurrentUserOnboarded(queryClient);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [connectedBankAccountId, isOnboarded, checkAccountStatus, queryClient]);

  useEffect(() => {
    if (isOnboarded || !connectedBankAccountId) return;

    let cancelled = false;

    const run = async () => {
      if (cancelled) return;
      await verifyWithStripe();
    };

    void run();
    const interval = setInterval(() => void run(), 5000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [isOnboarded, connectedBankAccountId, verifyWithStripe]);

  const showOnboardingPrompt =
    !isLoading && Boolean(currentUser) && !isOnboarded;

  return {
    currentUser,
    isLoading,
    isOnboarded,
    showOnboardingPrompt,
    verifyWithStripe,
  };
}
