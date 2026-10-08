 
import { PrimaryButton } from "@/components/atoms/buttons/primaryButton";
import { PrimaryTypo } from "@/components/atoms/typo/primaryTypo";
import { useEffect, useState, useContext } from "react";
import ToastProvider from "@/providers/ToastProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { useAddTip } from "@/api/tipManagement";
import { useTranslation } from "react-i18next";
import { useGetCurrentUser } from "@/api/userDetails";
import { formatBalanceLabel } from "@/currency/format";
import { CurrencyContext } from "@/App";
import TipStripeCheckout from "./TipStripeCheckout";
import {
  buildTipSuccessSummary,
  clearPendingTipPayment,
  setTipSuccessSummary,
} from "@/utils/pendingTipStorage";

const PaymentContainer = () => {
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "balance">(
    "stripe"
  );
  const navigate = useNavigate();
  const { currency } = useContext(CurrencyContext);

  const location = useLocation();
  const tipData = location.state?.tipData;
  const paymentIntentId = location.state?.paymentIntentId as string | undefined;
  const clientSecret = location.state?.clientSecret as string | undefined;
  const guestCheckout = Boolean(location.state?.guestCheckout);
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const { data: currentUser } = useGetCurrentUser();

  const {
    mutate: addTipMutate,
    isSuccess: isAddTipSuccess,
    isLoading: isAddTipLoading,
  } = useAddTip();

  useEffect(() => {
    if (!tipData || !clientSecret || !paymentIntentId) {
      navigate(localStorage.getItem("token") ? "/tip-provider" : "/", {
        replace: true,
      });
    }
  }, [tipData, clientSecret, paymentIntentId, navigate]);

  useEffect(() => {
    if (isAddTipSuccess && paymentMethod === "balance") {
      const summary = buildTipSuccessSummary(
        {
          ...tipData,
          TipDate:
            tipData.TipDate instanceof Date
              ? tipData.TipDate.toISOString()
              : String(tipData.TipDate),
        },
        "Account Balance"
      );
      if (summary) setTipSuccessSummary(summary);
      clearPendingTipPayment();
      ToastProvider.success("Payment is done successfully");
      navigate("/payment/success");
    }
  }, [isAddTipSuccess, paymentMethod, navigate, tipData]);

  const handleBalancePayment = () => {
    addTipMutate({
      ServiceProviderID: tipData.ServiceProviderID,
      Amount: tipData.Amount,
      Currency: tipData.Currency,
      TipDate: tipData.TipDate,
      Rating: tipData.Rating,
      Review: tipData.Review,
      paymentMethodType: "BALANCE",
    });
  };

  const balanceAmount = Number(
    currentUser?.BalanceOriginal ?? currentUser?.balance ?? 0
  );

  if (!tipData || !clientSecret || !paymentIntentId) {
    return null;
  }

  return (
    <div>
      <div className="sm:max-w-[617px] sm:min-w-[617px] min-w-[310px] w-full py-[40px] px-[20px] md:py-[40px] md:px-[70px] flex flex-col gap-[32px] mx-auto md:bg-card md:rounded-[16px] md:border md:border-[#0B538D] md:shadow-[0_0_15px_0_rgba(11,83,141,0.5)]">
        <PrimaryTypo
          typo={t("common.payment")}
          styles="text-center text-[24px] leading-[21px]"
        />

        <div className="flex flex-col gap-[12px] w-full">
          <div className="flex gap-[8px] justify-start items-center h-fit">
            <input
              type="radio"
              id="stripe"
              name="paymentMethod"
              value="stripe"
              checked={paymentMethod === "stripe"}
              onChange={() => setPaymentMethod("stripe")}
              className="accent-black"
            />
            <label
              htmlFor="stripe"
              className="text-black text-sm font-semibold leading-[21px]"
            >
              {t("common.cardApplePayGooglePay")}
            </label>
          </div>

          {paymentMethod === "stripe" && (
            <TipStripeCheckout
              tipData={tipData}
              paymentIntentId={paymentIntentId}
              clientSecret={clientSecret}
              guestCheckout={guestCheckout}
            />
          )}

          {isLoggedIn && (
          <div className="flex gap-[8px] justify-start items-center h-fit">
            <input
              type="radio"
              id="balance"
              name="paymentMethod"
              value="balance"
              checked={paymentMethod === "balance"}
              onChange={() => setPaymentMethod("balance")}
              className="accent-black"
            />
            <label
              htmlFor="balance"
              className="text-black text-sm font-semibold leading-[21px]"
            >
              {t("common.accountBalance")} ({formatBalanceLabel(
                Number.isFinite(balanceAmount) ? balanceAmount : 0,
                currency
              )})
            </label>
          </div>
          )}
        </div>

        {isLoggedIn && paymentMethod === "balance" && (
          <div className="flex flex-col justify-center items-center mt-[8px] gap-[12px]">
            <PrimaryButton
              typo={
                isAddTipLoading ? t("common.processing") : t("common.proceed")
              }
              styles="max-w-[328px] w-full !rounded-md text-white text-base"
              isDisable={isAddTipLoading}
              handleOnClick={handleBalancePayment}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentContainer;
