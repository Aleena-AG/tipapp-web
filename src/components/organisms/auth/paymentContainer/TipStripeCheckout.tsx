import { PrimaryButton } from "@/components/atoms/buttons/primaryButton";
import { SecondaryTypo } from "@/components/atoms/typo/secondaryTypo";
import { useAddTip } from "@/api/tipManagement";
import { getPaymentIntentStatus } from "@/api/managePayments";
import {
  buildTipSuccessSummary,
  clearPendingTipPayment,
  setTipSuccessSummary,
} from "@/utils/pendingTipStorage";
import ToastProvider from "@/providers/ToastProvider";
import {
  ExpressCheckoutElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface TipData {
  TipperID: string;
  ServiceProviderID: string;
  Amount?: number;
  Currency?: string;
  TipDate: Date;
  Review: string;
  Rating: number;
  recipientName?: string;
  recipientProfileUrl?: string;
}

interface TipStripeCheckoutProps {
  tipData: TipData;
  paymentIntentId: string;
  clientSecret: string;
}

const TipStripeCheckout = ({
  tipData,
  paymentIntentId,
  clientSecret,
}: TipStripeCheckoutProps) => {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isElementReady, setIsElementReady] = useState(false);
  const [walletsAvailable, setWalletsAvailable] = useState(false);

  const { mutate: addTipMutate, isLoading: isAddTipLoading } = useAddTip();

  const recordTip = useCallback(
    (confirmedPaymentIntentId: string) => {
      addTipMutate(
        {
          TipperID: tipData.TipperID,
          ServiceProviderID: tipData.ServiceProviderID,
          paymentIntentId: confirmedPaymentIntentId,
          TipDate: tipData.TipDate,
          Rating: tipData.Rating,
          Review: tipData.Review,
        },
        {
          onSuccess: () => {
            const summary = buildTipSuccessSummary(
              {
                ...tipData,
                TipDate:
                  tipData.TipDate instanceof Date
                    ? tipData.TipDate.toISOString()
                    : String(tipData.TipDate),
              },
              "Card"
            );
            if (summary) setTipSuccessSummary(summary);
            clearPendingTipPayment();
            ToastProvider.success("Payment is done successfully");
            navigate("/payment/success");
          },
        }
      );
    },
    [addTipMutate, navigate, tipData]
  );

  const finalizePayment = useCallback(
    async (confirmedPaymentIntentId: string) => {
      const statusData = await getPaymentIntentStatus(confirmedPaymentIntentId);
      if (statusData?.status === "succeeded") {
        recordTip(confirmedPaymentIntentId);
      } else {
        ToastProvider.error("Payment was not completed. Please try again.");
      }
    },
    [recordTip]
  );

  const handleExpressCheckoutConfirm = useCallback(async () => {
    if (!stripe || !elements) {
      ToastProvider.error("Stripe has not loaded yet. Please try again.");
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        redirect: "if_required",
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
      });

      if (error) {
        ToastProvider.error(error.message || "Payment failed");
        return;
      }

      const confirmedId = paymentIntent?.id || paymentIntentId;

      if (paymentIntent?.status === "succeeded") {
        recordTip(confirmedId);
        return;
      }

      await finalizePayment(confirmedId);
    } catch (err) {
      console.error("Wallet payment error:", err);
      ToastProvider.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [
    clientSecret,
    elements,
    finalizePayment,
    paymentIntentId,
    recordTip,
    stripe,
  ]);

  const confirmStripePayment = useCallback(async () => {
    if (!stripe || !elements) {
      ToastProvider.error("Stripe has not loaded yet. Please try again.");
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
      });

      if (error) {
        ToastProvider.error(error.message || "Payment failed");
        return;
      }

      const confirmedId = paymentIntent?.id || paymentIntentId;

      if (paymentIntent?.status === "succeeded") {
        recordTip(confirmedId);
        return;
      }

      await finalizePayment(confirmedId);
    } catch (err) {
      console.error("Payment error:", err);
      ToastProvider.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [elements, finalizePayment, paymentIntentId, recordTip, stripe]);

  const isBusy = isProcessing || isAddTipLoading;
  const currency = tipData.Currency || "GBP";
  const formattedAmount =
    tipData.Amount != null ? tipData.Amount.toFixed(2) : null;

  return (
    <div className="flex flex-col gap-[16px] w-full">
      {formattedAmount && (
        <SecondaryTypo
          typo={`${t("common.tipAmount")}: ${currency === "GBP" ? "£" : ""}${formattedAmount} ${currency}`}
          styles="text-center text-[16px] font-semibold text-[#0B538D]"
        />
      )}

      <ExpressCheckoutElement
        options={{
          buttonType: {
            applePay: "tip",
            googlePay: "pay",
          },
          paymentMethods: {
            applePay: "always",
            googlePay: "always",
          },
          layout: {
            maxColumns: 1,
            maxRows: 3,
          },
        }}
        onReady={({ availablePaymentMethods }) => {
          setWalletsAvailable(
            Boolean(
              availablePaymentMethods?.applePay ||
                availablePaymentMethods?.googlePay
            )
          );
        }}
        onConfirm={handleExpressCheckoutConfirm}
      />

      {walletsAvailable && (
        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-sm text-gray-500 poppins-medium">OR</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>
      )}

      <PaymentElement
        onReady={() => setIsElementReady(true)}
        options={{
          layout: {
            type: "tabs",
            defaultCollapsed: false,
          },
          wallets: {
            applePay: "never",
            googlePay: "never",
          },
        }}
      />

      {!isElementReady && (
        <SecondaryTypo
          typo={t("common.loadingPaymentMethods")}
          styles="text-center text-[14px] text-gray-500"
        />
      )}

      <PrimaryButton
        typo={isBusy ? t("common.processing") : t("common.sendTip")}
        styles="max-w-[328px] w-full !rounded-md text-white text-base mx-auto"
        handleOnClick={confirmStripePayment}
        isDisable={isBusy || !stripe || !elements || !isElementReady}
      />
    </div>
  );
};

export default TipStripeCheckout;
