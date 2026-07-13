import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import SPQRCodeContainer from "@/components/organisms/service-provider/SP-QR-CodeContainer/SPQRCodeContainer";
import StripeOnboardingBanner from "@/components/molecules/service-provider/stripe-onboarding-banner/StripeOnboardingBanner";
import SPScreenBackground from "@/components/molecules/service-provider/sp-screen-background/SPScreenBackground";
import ToastProvider from "@/providers/ToastProvider";
import { useGetCurrentUser } from "@/api/userDetails";
import {
  clearStripeOnboardingComplete,
  isStripeOnboardingComplete,
} from "@/utils/constants/enums";

const SPHomeScreen = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { data: currentUser, refetch } = useGetCurrentUser();
  const hasShownSuccessToastRef = useRef(false);

  useEffect(() => {
    void refetch();
  }, [refetch, location.key]);

  useEffect(() => {
    if (!isStripeOnboardingComplete() || hasShownSuccessToastRef.current) return;
    if (sessionStorage.getItem("stripeOnboardingSuccessToastShown") === "1") {
      sessionStorage.removeItem("stripeOnboardingSuccessToastShown");
      hasShownSuccessToastRef.current = true;
      return;
    }
    hasShownSuccessToastRef.current = true;
    ToastProvider.success(t("onboarding.completeSuccess"));
  }, [t]);

  useEffect(() => {
    if (currentUser?.isOnboarded && isStripeOnboardingComplete()) {
      clearStripeOnboardingComplete();
    }
  }, [currentUser?.isOnboarded]);

  return (
    <div className="relative overflow-hidden bg-primary-hex min-h-screen pt-80 pb-50 flex flex-col justify-center sm:justify-start">
      <SPScreenBackground />
      <div className="relative flex flex-col">
        <StripeOnboardingBanner />
        <SPQRCodeContainer />
      </div>
    </div>
  );
};

export default SPHomeScreen;
