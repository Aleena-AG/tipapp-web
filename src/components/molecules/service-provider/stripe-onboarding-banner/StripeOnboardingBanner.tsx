import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "@/components/atoms/buttons/primaryButton";
import { PrimaryTypo } from "@/components/atoms/typo/primaryTypo";
import { SecondaryTypo } from "@/components/atoms/typo/secondaryTypo";
import { useStripeOnboardingStatus } from "@/hooks/useStripeOnboardingStatus";

const StripeOnboardingBanner = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showOnboardingPrompt } = useStripeOnboardingStatus();

  if (!showOnboardingPrompt) return null;

  return (
    <div className="max-w-[477px] mx-auto px-20 sm:px-0 mb-25">
      <div className="rounded-2xl border border-[#d71921] bg-white shadow-[0_0_15px_0_rgba(215,25,33,0.5)] px-24 py-24 flex flex-col gap-16">
        <PrimaryTypo
          typo={t("onboarding.bannerTitle")}
          styles="text-center !text-[20px] sm:!text-[22px] text-black"
        />
        <SecondaryTypo
          typo={t("onboarding.bannerDescription")}
          styles="text-center text-[#4A4A4A] text-sm sm:text-base leading-relaxed"
        />
        <PrimaryButton
          typo={t("onboarding.bannerButton")}
          styles="w-full !rounded-8 bg-[#9E2A2B] hover:bg-[#ce260b] text-white text-base poppins-regular h-[48px] shadow-xl"
          handleOnClick={() => navigate("/service-provider/onboarding")}
        />
      </div>
    </div>
  );
};

export default StripeOnboardingBanner;
