import { useGetBalanceAmount, useGetWithdrawHistoryByServiceProvider } from "@/api/tipManagement";
import { PrimaryButton } from "@/components/atoms/buttons/primaryButton";
import ViewHistoryCardSection from "@/components/molecules/service-provider/view-history-card-section copy/viewTipHistoryCardSection";
import TipBalanceCardSection from "@/components/molecules/tip-provider/tipBalance-card-section/tipBalanceCardSection";
import { Button } from "@/components/ui/button";
import { handleScrollTop } from "@/hooks/hooks";
import ToastProvider from "@/providers/ToastProvider";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SPTipBalanceContainer = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const currency = 'GBP'; // Should be dynamic based on user preference or location

  const { data: tipBalance, isLoading: isBalanceLoading } =
    useGetBalanceAmount(currency);

  const { data: withdrawHistory } = useGetWithdrawHistoryByServiceProvider();

  const hasWithdrawals = withdrawHistory?.pages.some(page => page.items.length > 0) || false;

  useEffect(() => {
    setLoading(isBalanceLoading);
  }, [isBalanceLoading]);

  const navigate = useNavigate();

  const handleNavigateWithdrawMoney = () => {
    navigate("/service-provider/withdraw-money");
  };
  const handleNavigateWithdrawHistory = () => {
    navigate("/service-provider/withdraw-history");
  };

  return (
    <div className="flex flex-col">
      <TipBalanceCardSection
        TotalTips={tipBalance?.balance}
        isLoading={loading}
        currency={currency}
      />

      <ViewHistoryCardSection key={tipBalance?.balance} />

      <PrimaryButton
        typo={t("payments.withdrawMoney")}
        styles="w-full bg-[#9E2A2B] hover:bg-[#ce260b] max-w-[328px] mx-auto flex !rounded-8 text-white text-base poppins-regular mt-49 h-[48px]"
        handleOnClick={() => {
          if (tipBalance?.balance === 0) {
            ToastProvider.error(t("payments.noTipsToWithdraw"));
            handleScrollTop();
            return;
          } else {
            handleNavigateWithdrawMoney();
            handleScrollTop();
          }
        }}
        isDisable={tipBalance?.balance === 0}
      />
      <Button
        className="w-full max-w-[328px] mx-auto flex !rounded-8 text-black text-base poppins-regular mt-18 h-[48px] bg-white shadow-xl hover:border border hover:bg-[#f5f3f311] duration-300 "
        onClick={() => {
          handleNavigateWithdrawHistory();
          handleScrollTop();
        }}
        disabled={!hasWithdrawals}
      >
        {t("payments.myWithdrawals")}
      </Button>
    </div>
  );
};

export default SPTipBalanceContainer;
