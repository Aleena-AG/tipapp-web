import PaymentSucess from "@/assets/svg/payment.svg";
import { PrimaryButton } from "@/components/atoms/buttons/primaryButton";
import { PrimaryTypo } from "@/components/atoms/typo/primaryTypo";
import { SecondaryTypo } from "@/components/atoms/typo/secondaryTypo";
import { Home, Star } from "lucide-react";
import WithdrawInvoiceSuccessCard from "@/components/molecules/service-provider/withdraw-invoice-success-card/WithdrawInvoiceSuccessCard";
import TipSuccessCard from "@/components/molecules/tip-provider/tip-success-card/TipSuccessCard";
import TipSuccessDecorations from "@/components/molecules/tip-provider/tip-success-screen/TipSuccessDecorations";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { useAddTip } from "@/api/tipManagement";
import { getPaymentIntentStatus } from "@/api/managePayments";
import {
  buildTipSuccessSummary,
  clearPendingTipPayment,
  clearTipSuccessSummary,
  getPendingTipPayment,
  getTipSuccessSummary,
  setTipSuccessSummary,
  TipSuccessSummary,
} from "@/utils/pendingTipStorage";
import { WithdrawalSuccessState } from "@/utils/types/types";
import ToastProvider from "@/providers/ToastProvider";
import authFetch from "@/api/axiosInterceptor";
import {
  getUserDisplayName,
  parseKeycloakUserDetailsResponse,
} from "@/utils/userProfile";

const PaymentSucessScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const userRole = localStorage.getItem("userType");
  const hasFinalizedRedirect = useRef(false);
  const hasEnrichedRecipient = useRef(false);

  const withdrawalState = location.state as WithdrawalSuccessState | null;
  const isWithdrawalSuccess = withdrawalState?.flow === "withdrawal";

  const [tipSummary, setTipSummary] = useState<TipSuccessSummary | null>(() => {
    const saved = getTipSuccessSummary();
    if (saved) return saved;

    const pending = getPendingTipPayment();
    if (pending?.tipData) {
      return buildTipSuccessSummary(pending.tipData, "Card");
    }

    return null;
  });

  const { mutate: addTipMutate } = useAddTip();

  useEffect(() => {
    if (isWithdrawalSuccess) return;

    const redirectStatus = searchParams.get("redirect_status");
    const paymentIntentFromUrl = searchParams.get("payment_intent");

    if (
      hasFinalizedRedirect.current ||
      redirectStatus !== "succeeded" ||
      !paymentIntentFromUrl
    ) {
      return;
    }

    const pending = getPendingTipPayment();
    if (!pending || pending.paymentIntentId !== paymentIntentFromUrl) {
      return;
    }

    hasFinalizedRedirect.current = true;

    const finalizeTip = async () => {
      try {
        const statusData = await getPaymentIntentStatus(
          paymentIntentFromUrl,
          pending.clientSecret
        );
        if (statusData?.status !== "succeeded") {
          ToastProvider.error("Payment verification failed.");
          navigate("/tip-provider", { replace: true });
          return;
        }

        addTipMutate(
          {
            ServiceProviderID: pending.tipData.ServiceProviderID,
            paymentIntentId: paymentIntentFromUrl,
            TipDate: pending.tipData.TipDate,
            Rating: pending.tipData.Rating,
            Review: pending.tipData.Review,
          },
          {
            onSuccess: () => {
              const summary = buildTipSuccessSummary(pending.tipData, "Card");
              if (summary) {
                setTipSuccessSummary(summary);
                setTipSummary(summary);
              }
              clearPendingTipPayment();
            },
            onError: () => {
              hasFinalizedRedirect.current = false;
            },
          }
        );
      } catch {
        ToastProvider.error("Could not verify payment.");
        hasFinalizedRedirect.current = false;
      }
    };

    finalizeTip();
  }, [addTipMutate, isWithdrawalSuccess, navigate, searchParams]);

  useEffect(() => {
    if (isWithdrawalSuccess || !tipSummary || hasEnrichedRecipient.current) {
      return;
    }

    const spId =
      tipSummary.serviceProviderId ??
      getPendingTipPayment()?.tipData.ServiceProviderID;
    if (!spId) return;

    let cancelled = false;

    authFetch
      .get(`/user-details/keycloak/${spId}`)
      .then((response) => {
        if (cancelled) return;

        const userData = parseKeycloakUserDetailsResponse(response);
        const displayName = getUserDisplayName(userData);
        if (!displayName) return;

        hasEnrichedRecipient.current = true;

        const updated: TipSuccessSummary = {
          ...tipSummary,
          recipientName: displayName,
          recipientProfileUrl:
            userData?.ProfilePictureURL ?? tipSummary.recipientProfileUrl,
          serviceProviderId: spId,
        };

        setTipSuccessSummary(updated);
        setTipSummary(updated);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [isWithdrawalSuccess, tipSummary]);

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    return !!(token && userType);
  };

  const clearSuccessData = () => {
    clearTipSuccessSummary();
    clearPendingTipPayment();
  };

  const handleRouteHome = () => {
    clearSuccessData();
    if (!isAuthenticated()) {
      navigate("/sign-in");
      return;
    }
    if (isWithdrawalSuccess) {
      navigate("/service-provider", { state: { refreshBalance: true } });
      return;
    }
    if (userRole === "sp") {
      navigate("/service-provider");
    } else if (userRole === "tp") {
      navigate("/tip-provider");
    } else if (userRole === "both") {
      navigate("/user-selection");
    } else {
      navigate("/sign-in");
    }
  };

  const handleSecondaryAction = () => {
    clearSuccessData();
    if (isWithdrawalSuccess) {
      navigate("/service-provider/withdraw-history");
      return;
    }
    if (userRole === "sp") {
      navigate("/service-provider/reviews");
    } else {
      navigate("/tip-provider/service-provider-rating");
    }
  };

  if (isWithdrawalSuccess && withdrawalState.invoice) {
    return (
      <div className="min-h-screen bg-primary-hex flex flex-col justify-center items-center py-40 px-16">
        <img src={PaymentSucess} alt="Success" />
        <PrimaryTypo
          typo={t("payments.withdrawalSuccess")}
          styles="!text-[24px] poppins-semibold text-center mt-10"
        />
        <WithdrawInvoiceSuccessCard
          invoice={withdrawalState.invoice}
          balance={withdrawalState.balance}
          message={withdrawalState.message}
        />
        <PrimaryButton
          handleOnClick={handleRouteHome}
          typo={t("common.backToHome")}
          styles="!rounded-8 !mx-2 text-white max-w-[328px] mt-[29px] w-full text-base poppins-regular"
        />
        <PrimaryButton
          handleOnClick={handleSecondaryAction}
          typo={t("payments.viewWithdrawHistory")}
          styles="!rounded-8 !mx-2 text-white max-w-[328px] mt-[16px] w-full text-base poppins-regular"
        />
      </div>
    );
  }

  if (tipSummary) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#EEF3F9] via-[#F8F7FF] to-[#E8EEF6] px-4 py-12 pt-[88px]">
        <TipSuccessDecorations />
        <div className="relative z-[1] flex w-full max-w-[420px] flex-col items-center">
          <TipSuccessCard summary={tipSummary} />

          <div className="ta-animate-slide-up ta-delay-4 mt-6 flex w-full flex-col gap-3 px-4">
            <button
              type="button"
              onClick={handleRouteHome}
              className="flex h-[50px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#0B538D] text-white shadow-[0_6px_20px_rgba(11,83,141,0.3)] transition-all hover:bg-[#0077B6] active:scale-[0.98]"
            >
              <Home className="h-[18px] w-[18px]" />
              <span className="poppins-semibold text-[15px]">
                {t("common.backToHome")}
              </span>
            </button>
            <button
              type="button"
              onClick={handleSecondaryAction}
              className="flex h-[50px] w-full items-center justify-center gap-2 rounded-[14px] border-2 border-[#0B538D]/20 bg-white text-[#0B538D] transition-colors hover:bg-[#EAF3FA] active:scale-[0.98]"
            >
              <Star className="h-[18px] w-[18px]" />
              <span className="poppins-semibold text-[15px]">
                {t("common.viewReviews")}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-hex flex flex-col justify-center items-center">
      <img src={PaymentSucess} alt="App logo" />
      <PrimaryTypo
        typo={t("common.success")}
        styles="!text-[24px] poppins-semibold text-center mt-10"
      />
      <SecondaryTypo
        typo={t("common.thankYouForUsingTippingApp")}
        styles="!text-[16px] max-w-[200px] text-center mt-4"
      />
      <PrimaryButton
        handleOnClick={handleRouteHome}
        typo={t("common.backToHome")}
        styles="!rounded-8 !mx-2 text-white max-w-[328px] mt-[29px] w-full text-base poppins-regular "
      />
      <PrimaryButton
        handleOnClick={handleSecondaryAction}
        typo={t("common.viewReviews")}
        styles="!rounded-8 !mx-2 text-white max-w-[328px] mt-[16px] w-full text-base poppins-regular "
      />
    </div>
  );
};

export default PaymentSucessScreen;
