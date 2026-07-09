 
import { useGetBalanceAmount } from "@/api/tipManagement";
import { PrimaryButton } from "@/components/atoms/buttons/primaryButton";
import WithdrawHistoryCardSection from "@/components/molecules/service-provider/withdraw-history-card-section/withdrawHistoryCardSection";
import { handleScrollTop } from "@/hooks/hooks";
import ToastProvider from "@/providers/ToastProvider";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SPTipWithdrawHistoryContainer = () => {
  const { t } = useTranslation();
  const [, setLoading] = useState<boolean>(false);

  const { data: tipBalance, isLoading: isBalanceLoading } =
    useGetBalanceAmount("GBP");

  useEffect(() => {
    setLoading(isBalanceLoading);
  }, [isBalanceLoading]);

  const navigate = useNavigate();

  const handleNavigateWithdrawMoney = () => {
    navigate("/service-provider/withdraw-money");
  };

  return (
    <div className="flex flex-col">
      <WithdrawHistoryCardSection />

      <PrimaryButton
        typo={t("payments.withdrawMoney")}
        styles="w-full max-w-[328px] mx-auto flex !rounded-8 bg-[#9E2A2B] hover:bg-[#ce260b] text-white text-base poppins-regular mt-49 h-[48px]"
        handleOnClick={() => {
          if (tipBalance?.balance === 0) {
            ToastProvider.error(t("payments.noTipsToWithdraw"));
            handleScrollTop();
            return;
          }
          handleNavigateWithdrawMoney();
          handleScrollTop();
        }}
        isDisable={tipBalance?.balance === 0}
      />
    </div>
  );
};

export default SPTipWithdrawHistoryContainer;
