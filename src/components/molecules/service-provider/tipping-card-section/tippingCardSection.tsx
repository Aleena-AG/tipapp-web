/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrimaryButton } from "@/components/atoms/buttons/primaryButton";
import { SecondaryTypo } from "@/components/atoms/typo/secondaryTypo";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAddWithdrawTip, useWithdrawAndTipLimit } from "@/api/tipManagement";
import ToastProvider from "@/providers/ToastProvider";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { CurrencyContext } from "@/App";
import SpinLoaderButton from "@/components/atoms/laoder/spin-loader-secondary";
import { useCreateAccountLink } from "@/api/withdraw";
import { useGetCurrentUser } from "@/api/userDetails";
import { useStripeOnboardingStatus } from "@/hooks/useStripeOnboardingStatus";
import { useTranslation } from "react-i18next";

interface Props {
  onChange: (value: number) => void;
  value: number | string | any;
  TotalTips: number | undefined;
  currency?: string;
}

export const TippingCardSection = (props: Props) => {
  const { t } = useTranslation();
  const [value, setValue] = useState("0.00");
  const { isOnboarded } = useStripeOnboardingStatus();
  useEffect(() => {
    if (props.value) {
      setValue(parseFloat(props?.value).toFixed(2));
    }
  }, [props.value]);
  const [isInput, setIsInput] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { data: withdrawLimitData } = useWithdrawAndTipLimit();
  const maxwithdraw = withdrawLimitData?.tipWithdrawalLimit.maximumAmount;
  const minwithdraw = withdrawLimitData?.tipWithdrawalLimit.minimumAmount;

  const { currency: contextCurrency } = useContext(CurrencyContext);
  const currency = props.currency || contextCurrency;

  const incrementValue = () => {
    const currentVal = parseFloat(value);
    const incrementAmount =
      currentVal < (minwithdraw || 5) ? (minwithdraw || 5) - currentVal : 1;
    const newValue = (currentVal + incrementAmount).toFixed(2);
    const parsedNewValue = parseFloat(newValue);

    // Check against maximum withdrawal limit
    if (parsedNewValue > (maxwithdraw || 100)) {
      ToastProvider.error(
        `Maximum amount should be ${(maxwithdraw || 100).toFixed(
          2
        )} ${currency}`
      );
      return;
    }

    // Check against user's available balance
    if (parsedNewValue > (props.TotalTips || 0)) {
      ToastProvider.error(
        `Your Account Balance is not Sufficient ${props.TotalTips?.toFixed(
          2
        )} ${currency}`
      );
      return;
    }

    setValue(newValue);
    setIsInput(false);
    props.onChange(parsedNewValue);
  };

  // const { currency } = useContext(CurrencyContext); // Removed to use prop or context fallback defined above

  const decrementValue = () => {
    const currentVal = parseFloat(value);
    const newValue = (currentVal - 1).toFixed(2);
    const parsedNewValue = parseFloat(newValue);

    // Check against minimum withdrawal limit
    if (parsedNewValue < (minwithdraw || 5)) {
      ToastProvider.error(
        `Minimum amount should be ${(minwithdraw || 5).toFixed(2)} ${currency}`
      );
      return;
    }

    setValue(newValue);
    setIsInput(false);
    props.onChange(parsedNewValue);
  };

  useEffect(() => {
    if (minwithdraw) {
      const initialValue = parseFloat(minwithdraw).toFixed(2);
      setValue(initialValue);
      props.onChange(parseFloat(initialValue));
    }
  }, [minwithdraw]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const parsedValue = parseFloat(inputValue);

    // Allow only valid decimal format
    if (!/^\d+(\.\d{0,2})?$/.test(inputValue) && inputValue !== "") {
      return;
    }

    setValue(inputValue);

    if (inputValue === "" || isNaN(parsedValue)) {
      setIsInput(true);
      return;
    }

    // Check minimum limit
    if (parsedValue < (minwithdraw || 5)) {
      setIsInput(true);
      ToastProvider.error(
        `Minimum amount should be ${(minwithdraw || 5).toFixed(2)} ${currency}`
      );
      return;
    }

    // Check maximum limit
    if (parsedValue > (maxwithdraw || 100)) {
      setIsInput(true);
      ToastProvider.error(
        `Maximum amount should be ${(maxwithdraw || 100).toFixed(
          2
        )} ${currency}`
      );
      return;
    }

    // Check user's available balance
    const totalTips = props.TotalTips || 0;
    if (parsedValue > totalTips) {
      setIsInput(true);
      ToastProvider.error(
        `Your Account Balance is not Sufficient ${totalTips.toFixed(
          2
        )} ${currency}`
      );
      return;
    }

    // All validations passed
    setIsInput(false);
    props.onChange(parsedValue);
    setFieldValue("TotalAmount", parsedValue);
  };

  const handleBlur = () => {
    if (!value.includes(".")) {
      setValue(parseFloat(value).toFixed(2));
    } else if (value.split(".")[1].length < 2) {
      setValue(parseFloat(value).toFixed(2));
    }
  };

  const navigate = useNavigate();

  const { mutate: createAccountLink } = useCreateAccountLink();

  const { mutate: withdrawTip } = useAddWithdrawTip(
    (payload, message) => {
      setIsSuccess(true);
      setShowLoading(false);
      navigate("/payment/success", {
        state: {
          flow: "withdrawal",
          invoice: payload.invoice,
          balance: payload.balance,
          withdrawAmountInAED: payload.withdrawAmountInAED,
          message: message || "Invoice created successfully",
        },
      });
    },
    (error: string) => {
      setShowLoading(false);
      ToastProvider.error(error || "Withdrawal Failed");
    }
  );

  const userId = localStorage.getItem("userId");
  // const user = JSON.parse(localStorage.getItem("user") || "{}");
  // const connectedBankAccountId = user?.ConnectedBankAccountId;
  
  // Fetch current user details to ensure we have the latest ConnectedBankAccountId
  const { data: currentUser } = useGetCurrentUser();
  const connectedBankAccountId = currentUser?.ConnectedBankAccountId;

  const {
    setFieldValue,
    handleSubmit,
    errors,
    touched,
    isSubmitting,
  } = useFormik({
    initialValues: {
      UserID: userId,
      PaymentMethod: "paymentMethodisCard",
      TotalAmount: value || 0,
      Status: true,
    },
    validationSchema: Yup.object({
      TotalAmount: Yup.number()
        .min(
          minwithdraw || 5,
          `Amount must be at least ${(minwithdraw || 5).toFixed(2)} ${currency}`
        )
        .max(
          maxwithdraw || 100,
          `Amount must not exceed ${(maxwithdraw || 100).toFixed(
            2
          )} ${currency}`
        )
        .positive("Amount must be a positive number")
        .required("Required"),
    }),

    onSubmit: async (values) => {
       
      const { Status, ...restValues } = values;
      const formattedValues = {
        ...restValues,
        UserID: userId,
        PaymentMethod: "paymentMethodisCard",
        TotalAmount: Number.parseFloat(values.TotalAmount as any),
        Currency: currency,
      };

      // If already onboarded, proceed directly to withdrawal
      if (isOnboarded) {
        setShowLoading(true);
        withdrawTip(formattedValues as any);
        return;
      }

      // Otherwise, check/create account link
      if (!connectedBankAccountId) {
        ToastProvider.error("No connected bank account found.");
        return;
      }

      createAccountLink(connectedBankAccountId, {
        onSuccess: async (data: any) => {
          if (data?.error) {
            ToastProvider.error(data.error);
            setShowLoading(false);
            return;
          }
          
          if (data === "Account is already onboarded") {
            setShowLoading(true);
            withdrawTip(formattedValues as any);
          } else if (typeof data === 'string') {
            // globalThis.location.href = data;
          } else {
             console.error("Unexpected response from createAccountLink:", data);
             ToastProvider.error("Failed to initiate onboarding");
             setShowLoading(false);
          }
        },
        onError: (error) => {
          console.error("Error creating account link:", error);
          setShowLoading(false);
        },
      });
    },

    enableReinitialize: true,
  });

  return (
    <div className="flex flex-col items-center mt-[25px] bg-white max-w-[527px] mx-auto rounded-2xl min-h-[311px] max-h-[311px] justify-center flex-shrink-0 sm:border sm:border-[#d71921] sm:shadow-[0_0_15px_0_rgba(215,25,33,0.5)]">
      <SecondaryTypo
        typo={t("payments.withdrawAmount")}
        styles="text-center text-[14px] mb-2"
      />
      <div className="flex items-center mt-5">
        <button
          className={`${
            parseFloat(value) <= (minwithdraw || 5) ||
            showLoading ||
            isSubmitting ||
            isSuccess ||
            !isOnboarded
              ? "bg-opacity-40 opacity-40 cursor-not-allowed"
              : ""
          } w-[62px] h-[62px] rounded-full text-[35px] bg-[#9E2A2B] text-white text-2xl`}
          onClick={decrementValue}
          type="button"
          disabled={
            parseFloat(value) <= (minwithdraw || 5) ||
            showLoading ||
            isSubmitting ||
            isSuccess ||
            !isOnboarded
          }
        >
          -
        </button>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={showLoading || isSubmitting || isSuccess || !isOnboarded}
          className={`${
            showLoading || isSubmitting || isSuccess || !isOnboarded
              ? "bg-opacity-40 opacity-40 cursor-not-allowed"
              : ""
          } lg:mx-[56px] mx-[35px] text-[42px] font-poppins-thin text-center max-w-[150px] border-none rounded-md outline-none`}
        />
        <button
          className={`${
            parseFloat(value) >= (maxwithdraw || 100) ||
            parseFloat(value) >= (props.TotalTips || 0) ||
            showLoading ||
            isSubmitting ||
            isSuccess ||
            !isOnboarded
              ? "bg-opacity-40 opacity-40 cursor-not-allowed"
              : ""
          } w-[62px] h-[62px] rounded-full text-[35px] bg-[#9E2A2B] text-white text-2xl`}
          onClick={incrementValue}
          type="button"
          disabled={
            parseFloat(value) >= (maxwithdraw || 100) ||
            parseFloat(value) >= (props.TotalTips || 0) ||
            showLoading ||
            isSubmitting ||
            isSuccess ||
            !isOnboarded
          }
        >
          +
        </button>
      </div>

      <SecondaryTypo typo={currency} styles="text-center text-[14px] mt-2" />
      {touched.TotalAmount && errors.TotalAmount && (
        <div className="text-red-500">{errors.TotalAmount}</div>
      )}
      <div className="w-full mt-36">
        <PrimaryButton
          typo={
            showLoading || isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <SpinLoaderButton isLoading={true} />
                <span>{t("payments.withdrawing")}</span>
              </div>
            ) : isSuccess ? (
              t("payments.withdrawn")
            ) : (
              t("payments.withdraw")
            )
          }
          styles={`w-full max-w-[328px] mx-auto flex !rounded-8 text-white text-base poppins-regular h-[48px] bg-[#9E2A2B] hover:bg-[#ce260b] ${
            isInput ||
            isSubmitting ||
            parseFloat(value) < (minwithdraw || 5) ||
            parseFloat(value) > (maxwithdraw || 100) ||
            parseFloat(value) > (props.TotalTips || 0) ||
            !isOnboarded
              ? "bg-opacity-40 opacity-40 cursor-not-allowed"
              : ""
          }`}
          handleOnClick={() => {
            handleSubmit();
          }}
          isDisable={
            isInput ||
            isSubmitting ||
            showLoading ||
            isSuccess ||
            parseFloat(value) < (minwithdraw || 5) ||
            parseFloat(value) > (maxwithdraw || 100) ||
            parseFloat(value) > (props.TotalTips || 0) ||
            !isOnboarded
          }
        />
      </div>
    </div>
  );
};
