import SPTipWithdrawContainer from "@/components/organisms/service-provider/SP-Tip-WithdrawContainer/SPTipWithdrawContainer";
import StripeOnboardingBanner from "@/components/molecules/service-provider/stripe-onboarding-banner/StripeOnboardingBanner";
import SPSubScreenLayout from "@/layout/SPSubScreenLayout";

const SPWithdrawMoney = () => {
  return (
    <SPSubScreenLayout>
      <StripeOnboardingBanner />
      <SPTipWithdrawContainer />
    </SPSubScreenLayout>
  );
};

export default SPWithdrawMoney;
