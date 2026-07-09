 
import TipBalanceCardSection from "@/components/molecules/tip-provider/tipBalance-card-section/tipBalanceCardSection";
import { useGetBalanceAmount } from "@/api/tipManagement";
import { useEffect, useState } from "react";
import { TippingCardSection } from "@/components/molecules/service-provider/tipping-card-section/tippingCardSection";

const SPTipWithdrawContainer = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [tipAmount, setTipAmount] = useState<number>(5); // Set default to minimum withdrawal amount

  // Force GBP currency for balance and withdrawal
  const currency = 'GBP';
  const { data: tipBalance, isLoading } = useGetBalanceAmount(currency);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  return (
    <div>
      <TipBalanceCardSection
        TotalTips={tipBalance?.balance}
        isLoading={loading}
        currency={currency}
      />

      <TippingCardSection
        value={tipAmount}
        onChange={(newValue) => {
          setTipAmount(newValue);
        }}
        TotalTips={tipBalance?.balance}
        currency={currency}
      />
    </div>
  );
};

export default SPTipWithdrawContainer;
