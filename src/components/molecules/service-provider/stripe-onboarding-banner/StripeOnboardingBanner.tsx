import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "@/components/atoms/buttons/primaryButton";
import { useStripeOnboardingStatus } from "@/hooks/useStripeOnboardingStatus";
import { ShieldAlert } from "lucide-react";

const StripeOnboardingBanner = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showOnboardingPrompt } = useStripeOnboardingStatus();

  if (!showOnboardingPrompt) return null;

  return (
    <div className="relative z-10 mx-auto w-full max-w-[1380px] px-20 pt-8 sm:px-32 lg:px-48 xl:px-64">
      <div className="flex flex-col gap-16 rounded-[20px] border border-[#9E2A2B]/35 bg-gradient-to-r from-[#FFF5F5] to-[#FDF8F8] px-20 py-18 shadow-[0_12px_36px_rgba(158,42,43,0.14)] sm:flex-row sm:items-center sm:justify-between sm:px-28 sm:py-20 dark:border-[#F87171]/35 dark:from-[#2a1014]/95 dark:to-[#0a1629]/95 dark:shadow-[0_12px_36px_rgba(0,0,0,0.4)]">
        <div className="flex min-w-0 flex-1 items-start gap-14 sm:items-center">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#9E2A2B] text-white shadow-[0_8px_20px_rgba(158,42,43,0.3)] dark:bg-[#C53030]">
            <ShieldAlert className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <h3 className="poppins-semibold text-[17px] leading-snug text-[#2B0B0B] sm:text-[18px] dark:text-white">
              {t("onboarding.bannerTitle")}
            </h3>
            <p className="poppins-regular mt-6 text-[13px] leading-relaxed text-[#6F7682] sm:text-[14px] dark:text-slate-400">
              {t("onboarding.bannerDescription")}
            </p>
          </div>
        </div>

        <PrimaryButton
          typo={t("onboarding.bannerButton")}
          styles="w-full shrink-0 !rounded-xl bg-[#9E2A2B] hover:bg-[#ce260b] dark:bg-[#C53030] dark:hover:bg-[#9E2A2B] text-white text-[14px] poppins-semibold h-[46px] sm:w-auto sm:min-w-[220px] shadow-[0_10px_24px_rgba(158,42,43,0.28)]"
          handleOnClick={() => navigate("/service-provider/onboarding")}
        />
      </div>
    </div>
  );
};

export default StripeOnboardingBanner;
