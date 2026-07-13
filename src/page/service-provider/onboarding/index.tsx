import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "react-query";
import { PrimaryButton } from "@/components/atoms/buttons/primaryButton";
import { SecondaryTypo } from "@/components/atoms/typo/secondaryTypo";
import { useCheckAccountStatus, useCreateAccountLink } from "@/api/withdraw";
import { useGetCurrentUser, useUpdateUser } from "@/api/userDetails";
import { useCreateStripeAccount } from "@/api/userDetails";
import ToastProvider from "@/providers/ToastProvider";
import SpinLoaderButton from "@/components/atoms/laoder/spin-loader-secondary";
import SwitchAccount from "@/components/molecules/common/switch-account/switchAccount";
import {
  canAccessServiceProviderStripeUi,
  isUserRegistrationComplete,
  markStripeOnboardingComplete,
  markStripeOnboardingLinkOpened,
  clearStripeOnboardingLinkOpened,
  parseStripeAccountLinkResponse,
  openStripeOnboardingUrl,
  isStripeOnboardingUrl,
  isStripeConnectAccountId,
  setPendingSpStripeOnboarding,
  UserRoles,
} from "@/utils/constants/enums";
import { useTranslation } from "react-i18next";
import { patchCurrentUserOnboarded } from "@/hooks/useStripeOnboardingStatus";

function detectStripeReturnPending(): boolean {
  if (typeof window === "undefined") return false;
  return (
    new URLSearchParams(window.location.search).get("stripe_return") === "1"
  );
}

const OnboardingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [onboardingIncomplete, setOnboardingIncomplete] = useState(false);
  const [awaitingStripeConfirmation, setAwaitingStripeConfirmation] =
    useState(detectStripeReturnPending);
  const [startingOnboarding, setStartingOnboarding] = useState(false);
  const [stripeOnboardingUrl, setStripeOnboardingUrl] = useState<string | null>(
    null
  );
  const [spModePrepared, setSpModePrepared] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const roleUpgradeAttemptedRef = useRef(false);

  const {
    data: user,
    isLoading: userQueryLoading,
    isError: userQueryError,
    refetch: refetchUser,
  } = useGetCurrentUser();

  const { mutate: upgradeToBothRole } = useUpdateUser(
    () => {
      void queryClient.invalidateQueries(["get_current_user", "v2"]);
      void refetchUser();
    },
    () => {
      ToastProvider.error(
        "Could not enable Service Provider account. Please try again."
      );
      roleUpgradeAttemptedRef.current = false;
    }
  );

  const connectedBankAccountId = user?.ConnectedBankAccountId;

  const { mutate: checkAccountStatus } = useCheckAccountStatus();
  const { mutateAsync: createAccountLinkAsync } = useCreateAccountLink();
  const pollAccountIdRef = useRef<string | null>(null);
  const hasRedirectedRef = useRef(false);
  const falsePollCountRef = useRef(0);
  const pendingStripeReturnCheckRef = useRef(detectStripeReturnPending());
  const isProcessing =
    startingOnboarding || awaitingStripeConfirmation || isOnboarded;

  const OnboardingShell = ({
    children,
    fullScreen = false,
    showSwitchAccount = true,
  }: {
    children: ReactNode;
    fullScreen?: boolean;
    showSwitchAccount?: boolean;
  }) => (
    <div className="bg-primary-hex min-h-screen w-full pt-80 pb-50 flex flex-col justify-center sm:justify-start">
      {showSwitchAccount ? (
        <div className="fixed right-3 top-[64px] z-30 sm:right-4 sm:top-[70px] lg:right-8 lg:top-[76px]">
          <SwitchAccount role={t("userSelection.serviceProvider")} />
        </div>
      ) : null}
      <div
        className={`px-20 mx-auto w-full max-w-[527px] ${
          fullScreen
            ? "flex justify-center items-center flex-grow"
            : "pt-[40px] pb-[117px]"
        }`}
      >
        {children}
      </div>
    </div>
  );

  const handleOnboardingComplete = () => {
    patchCurrentUserOnboarded(queryClient);
    setIsOnboarded(true);
    setAwaitingStripeConfirmation(false);
    setStartingOnboarding(false);
    setOnboardingIncomplete(false);
  };

  const handleOnboardingIncomplete = () => {
    setAwaitingStripeConfirmation(false);
    setStartingOnboarding(false);
    setOnboardingIncomplete(true);
    pollAccountIdRef.current = null;
    falsePollCountRef.current = 0;
    pendingStripeReturnCheckRef.current = false;
    clearStripeOnboardingLinkOpened();
  };

  const resetOnboardingWaitState = () => {
    clearStripeOnboardingLinkOpened();
    pendingStripeReturnCheckRef.current = false;
    pollAccountIdRef.current = null;
    falsePollCountRef.current = 0;
    setAwaitingStripeConfirmation(false);
    setStartingOnboarding(false);
    setStripeOnboardingUrl(null);
    setOnboardingIncomplete(false);
  };

  const runStatusCheck = (accountId: string) => {
    checkAccountStatus(accountId, {
      onSuccess: (status: boolean) => {
        if (status) {
          falsePollCountRef.current = 0;
          pendingStripeReturnCheckRef.current = false;
          handleOnboardingComplete();
          return;
        }

        // Keep waiting while Stripe confirmation is in progress — never bounce
        // the user back to the start screen just because one poll is still false.
        falsePollCountRef.current += 1;
        const maxPolls = pendingStripeReturnCheckRef.current ? 45 : 30;
        if (falsePollCountRef.current >= maxPolls) {
          pendingStripeReturnCheckRef.current = false;
          handleOnboardingIncomplete();
        }
      },
      onError: (error) => {
        console.error("Account status check failed:", error);
      },
    });
  };

  useLayoutEffect(() => {
    if (!user) return;

    const isTipperOnly =
      user.Role === UserRoles.TIPER || user.Role === "tp";
    const isBothRole =
      user.Role === UserRoles.BOTH || user.Role === "both";
    const currentUserType = localStorage.getItem("userType");

    if (isTipperOnly || isBothRole) {
      if (currentUserType !== UserRoles.SERVICEPROVIDER && currentUserType !== "sp") {
        localStorage.setItem("userType", UserRoles.SERVICEPROVIDER);
        localStorage.setItem("displaySwitch", "true");
        setPendingSpStripeOnboarding();
      }

      if (isTipperOnly && !roleUpgradeAttemptedRef.current) {
        roleUpgradeAttemptedRef.current = true;
        upgradeToBothRole({ Role: UserRoles.BOTH });
      }
    }

    setSpModePrepared(true);
  }, [user, upgradeToBothRole]);

  useEffect(() => {
    const isStripeReturn = searchParams.get("stripe_return") === "1";

    if (isStripeReturn) {
      markStripeOnboardingLinkOpened();
      setAwaitingStripeConfirmation(true);
      setOnboardingIncomplete(false);
      pendingStripeReturnCheckRef.current = true;
      falsePollCountRef.current = 0;
      pollAccountIdRef.current = null;

      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("stripe_return");
      setSearchParams(nextParams, { replace: true });
      return;
    }

    // Do NOT clear awaitingStripeConfirmation here.
    // After Stripe return we strip ?stripe_return=1; clearing awaiting would
    // flash the "Start Onboarding" card again before success/incomplete.
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (user?.isOnboarded) {
      handleOnboardingComplete();
      return;
    }

    if (!awaitingStripeConfirmation || userQueryLoading) return;

    void refetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.isOnboarded, awaitingStripeConfirmation, userQueryLoading, refetchUser]);

  useEffect(() => {
    if (!awaitingStripeConfirmation || !connectedBankAccountId) return;

    runStatusCheck(connectedBankAccountId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [awaitingStripeConfirmation, connectedBankAccountId]);

  useEffect(() => {
    if (!awaitingStripeConfirmation || userQueryLoading || !user) return;
    if (!connectedBankAccountId) return;

    if (pollAccountIdRef.current === connectedBankAccountId) return;
    pollAccountIdRef.current = connectedBankAccountId;

    let cancelled = false;

    const poll = () => {
      if (cancelled) return;
      runStatusCheck(connectedBankAccountId);
    };

    poll();
    const interval = setInterval(poll, 2000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [awaitingStripeConfirmation, userQueryLoading, connectedBankAccountId, user]);

  useEffect(() => {
    if (!awaitingStripeConfirmation || !connectedBankAccountId) return;

    // Keep polling on focus — do not mark incomplete until Stripe confirms
    // success or polling times out. Premature incomplete made users "come back"
    // without ever seeing the success message.
    const handleFocus = () => {
      void refetchUser();
      runStatusCheck(connectedBankAccountId);
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [awaitingStripeConfirmation, connectedBankAccountId, refetchUser]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/sign-in", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (!isOnboarded || hasRedirectedRef.current) return;
    hasRedirectedRef.current = true;
    markStripeOnboardingComplete();
    sessionStorage.setItem("stripeOnboardingSuccessToastShown", "1");
    ToastProvider.success(t("onboarding.completeSuccess"));

    // Stay on the success screen until the user has time to see the message.
    const redirectTimer = setTimeout(() => {
      navigate("/service-provider", { replace: true });
    }, 3500);

    return () => clearTimeout(redirectTimer);
  }, [isOnboarded, navigate, t]);

  const { mutateAsync: createStripeAccount } = useCreateStripeAccount();

  const handleStartOnboarding = async () => {
    if (!canAccessServiceProviderStripeUi(user)) {
      ToastProvider.error("This page is only for service providers.");
      return;
    }
    if (isProcessing) return;

    setOnboardingIncomplete(false);
    setStartingOnboarding(true);

    const stripeWindow = window.open("about:blank", "_blank");
    let keepProcessing = false;

    try {
      let accountId = connectedBankAccountId;

      if (!accountId) {
        accountId = await createStripeAccount();
      }

      if (!accountId) {
        stripeWindow?.close();
        ToastProvider.error("No connected account found. Please contact support.");
        return;
      }

      const data = await createAccountLinkAsync(accountId);
      const parsed = parseStripeAccountLinkResponse(data);

      if (parsed === "already_onboarded") {
        stripeWindow?.close();
        keepProcessing = true;
        handleOnboardingComplete();
        void queryClient.invalidateQueries(["get_current_user", "v2"]);
        return;
      }

      if (parsed && isStripeOnboardingUrl(parsed)) {
        keepProcessing = true;
        setStripeOnboardingUrl(parsed);
        markStripeOnboardingLinkOpened();
        setAwaitingStripeConfirmation(true);
        if (stripeWindow && !stripeWindow.closed) {
          stripeWindow.opener = null;
          stripeWindow.location.href = parsed;
        } else {
          const opened = openStripeOnboardingUrl(parsed);
          if (!opened) {
            ToastProvider.error(t("common.stripePopupBlocked"));
            keepProcessing = false;
          }
        }
        void queryClient.invalidateQueries(["get_current_user", "v2"]);
        return;
      }

      stripeWindow?.close();
      console.error("Unexpected onboarding link response:", data);
      if (
        isStripeConnectAccountId(data) ||
        isStripeConnectAccountId(accountId)
      ) {
        ToastProvider.error(t("common.stripeOnboardingLinkError"));
      } else {
        ToastProvider.error("Failed to start onboarding. Please try again.");
      }
    } catch (error) {
      stripeWindow?.close();
      console.error("Failed to start onboarding:", error);
      ToastProvider.error("Failed to start onboarding. Please try again.");
    } finally {
      if (!keepProcessing) {
        setStartingOnboarding(false);
      }
    }
  };

  const OnboardingActionCard = ({
    title,
    description,
    showProfileHint = false,
    buttonLabel,
  }: {
    title: string;
    description: string;
    showProfileHint?: boolean;
    buttonLabel: string;
  }) => (
    <div className="bg-white rounded-2xl p-6 min-h-[311px] flex flex-col justify-center items-center">
      <SecondaryTypo typo={title} styles="text-center text-[18px] mb-4" />
      <div className="text-center w-full">
        <SecondaryTypo
          typo={description}
          styles="text-gray-600 mb-4 max-w-md mx-auto"
        />
        {showProfileHint && !isUserRegistrationComplete(user) && (
          <SecondaryTypo
            typo="After payment setup, complete your profile from the menu or here to use all features."
            styles="text-gray-500 text-sm mb-4 max-w-md mx-auto"
          />
        )}
        {showProfileHint && !isUserRegistrationComplete(user) && (
          <button
            type="button"
            className="mb-4 text-sm text-[#9E2A2B] underline poppins-medium hover:opacity-80"
            onClick={() => navigate("/register", { state: { role: "sp" } })}
            disabled={startingOnboarding}
          >
            Complete your profile
          </button>
        )}
        <PrimaryButton
          typo={
            startingOnboarding ? (
              <div className="flex items-center justify-center gap-2">
                <SpinLoaderButton isLoading={true} />
                <span>{t("onboarding.startingOnboarding")}</span>
              </div>
            ) : (
              buttonLabel
            )
          }
          styles="w-full bg-[#9E2A2B] hover:bg-[#ce260b] max-w-[328px] mx-auto flex !rounded-8 text-white text-base poppins-regular h-[48px]"
          handleOnClick={() => void handleStartOnboarding()}
          isDisable={startingOnboarding}
        />
      </div>
    </div>
  );

  const ProcessingCard = ({
    title,
    description,
    showReopenLink = false,
    showStartButton = false,
  }: {
    title: string;
    description: string;
    showReopenLink?: boolean;
    showStartButton?: boolean;
  }) => (
    <div className="bg-white rounded-2xl p-6 min-h-[311px] flex flex-col justify-center items-center gap-4">
      <SpinLoaderButton isLoading={true} />
      <SecondaryTypo typo={title} styles="text-center text-[18px]" />
      <SecondaryTypo
        typo={description}
        styles="text-center text-gray-500 text-sm max-w-md"
      />
      {showReopenLink && stripeOnboardingUrl ? (
        <a
          href={stripeOnboardingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[#9E2A2B] underline poppins-medium hover:opacity-80"
        >
          {t("onboarding.openStripeOnboarding")}
        </a>
      ) : null}
      {showStartButton ? (
        <PrimaryButton
          typo={t("onboarding.startOnboardingButton")}
          styles="w-full bg-[#9E2A2B] hover:bg-[#ce260b] max-w-[328px] mx-auto flex !rounded-8 text-white text-base poppins-regular h-[48px]"
          handleOnClick={() => {
            resetOnboardingWaitState();
            void handleStartOnboarding();
          }}
        />
      ) : null}
    </div>
  );

  if (userQueryLoading && !user && !awaitingStripeConfirmation) {
    return (
      <OnboardingShell fullScreen>
        <SpinLoaderButton isLoading={true} />
      </OnboardingShell>
    );
  }

  if (isOnboarded) {
    return (
      <OnboardingShell showSwitchAccount={false}>
        <div className="bg-white rounded-2xl p-6 min-h-[311px] flex flex-col justify-center items-center gap-4">
          <SecondaryTypo
            typo={t("onboarding.onboardingComplete")}
            styles="text-center text-[18px] text-[#0B538D]"
          />
          <SecondaryTypo
            typo={t("onboarding.completeSuccess")}
            styles="text-center text-gray-600 text-sm max-w-md"
          />
          <SecondaryTypo
            typo={t("onboarding.redirectingToDashboard")}
            styles="text-center text-gray-500 text-sm max-w-md"
          />
        </div>
      </OnboardingShell>
    );
  }

  if (startingOnboarding && !awaitingStripeConfirmation) {
    return (
      <OnboardingShell showSwitchAccount={false}>
        <ProcessingCard
          title={t("onboarding.startingOnboarding")}
          description={t("onboarding.preparingLink")}
        />
      </OnboardingShell>
    );
  }

  if (awaitingStripeConfirmation) {
    const isConfirmingReturn =
      userQueryLoading || !connectedBankAccountId || !user;

    return (
      <OnboardingShell showSwitchAccount={false}>
        <ProcessingCard
          title={
            isConfirmingReturn
              ? t("onboarding.confirmingReturn")
              : t("onboarding.waitingForStripe")
          }
          description={
            isConfirmingReturn
              ? t("onboarding.confirmingReturnHint")
              : t("onboarding.waitingForStripeHint")
          }
          showReopenLink={Boolean(stripeOnboardingUrl)}
          // Never show Start Onboarding while we are waiting for Stripe
          // success or incomplete result after return.
          showStartButton={false}
        />
      </OnboardingShell>
    );
  }

  if (onboardingIncomplete && user && canAccessServiceProviderStripeUi(user)) {
    return (
      <OnboardingShell>
        <OnboardingActionCard
          title={t("onboarding.incompleteTitle")}
          description={t("onboarding.incompleteDescription")}
          showProfileHint
          buttonLabel={t("onboarding.completeOnboarding")}
        />
      </OnboardingShell>
    );
  }

  if (userQueryError || !user) {
    return (
      <OnboardingShell>
        <div className="bg-white rounded-2xl p-6 min-h-[311px] flex flex-col justify-center items-center gap-4">
          <SecondaryTypo
            typo="We could not load your account."
            styles="text-center text-[18px]"
          />
          <PrimaryButton
            typo="Retry"
            styles="max-w-[200px] mx-auto"
            handleOnClick={() => void refetchUser()}
          />
        </div>
      </OnboardingShell>
    );
  }

  if (!spModePrepared && userQueryLoading) {
    return (
      <OnboardingShell fullScreen>
        <SpinLoaderButton isLoading={true} />
      </OnboardingShell>
    );
  }

  if (!canAccessServiceProviderStripeUi(user)) {
    return (
      <OnboardingShell>
        <div className="bg-white rounded-2xl p-6 min-h-[311px] flex flex-col justify-center items-center gap-4">
          <SecondaryTypo
            typo={t("onboarding.enableSpTitle")}
            styles="text-center text-[18px]"
          />
          <SecondaryTypo
            typo={t("onboarding.enableSpDescription")}
            styles="text-center text-gray-600"
          />
          <PrimaryButton
            typo={t("onboarding.enableSpButton")}
            styles="max-w-[328px] mx-auto w-full"
            handleOnClick={() => {
              localStorage.setItem("userType", UserRoles.SERVICEPROVIDER);
              localStorage.setItem("displaySwitch", "true");
              setPendingSpStripeOnboarding();
              if (
                user?.Role === UserRoles.TIPER ||
                user?.Role === "tp"
              ) {
                upgradeToBothRole({ Role: UserRoles.BOTH });
              }
              setSpModePrepared(true);
            }}
          />
        </div>
      </OnboardingShell>
    );
  }

  return (
    <OnboardingShell>
      <OnboardingActionCard
        title="Stripe Onboarding"
        description="Complete your Stripe onboarding to start receiving payments."
        showProfileHint
        buttonLabel="Start Onboarding"
      />
    </OnboardingShell>
  );
};

export default OnboardingPage;
