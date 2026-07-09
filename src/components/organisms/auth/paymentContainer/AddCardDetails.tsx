import { PrimaryButton } from "@/components/atoms/buttons/primaryButton";
import SpinLoaderButton from "@/components/atoms/laoder/spin-loader-secondary";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useFormik } from "formik";
import cardNumber from "@/assets/svg/cardNumber.svg";
import expDate from "@/assets/svg/ExpDate.svg";
import { useCreatePaymentMethod } from "@/api/managePayments";
import ToastProvider from "@/providers/ToastProvider";
import { useTranslation } from "react-i18next";

const AddCardDetails = ({
  setNewCard,
  isFirstCard = false,
}: {
  setNewCard: (value: boolean) => void;
  isFirstCard?: boolean;
}) => {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const { mutate: addCardDetails, isLoading } = useCreatePaymentMethod(
    () => {
      ToastProvider.success("Card details added successfully");
      setNewCard(false);
    },
    (error: string) => {
      ToastProvider.error(error || "Failed to add card");
    }
  );

  const userId = localStorage.getItem("userId");

  const formik = useFormik({
    initialValues: {
      cardHolderName: isFirstCard ? "Test User" : "",
    },
    onSubmit: async (values) => {
      if (!stripe || !elements) {
        ToastProvider.error(
          "Stripe has not loaded yet. Please try again later."
        );
        return;
      }

      const cardNumber = elements.getElement(CardNumberElement);

      if (!cardNumber) {
        ToastProvider.error("Card details are missing.");
        return;
      }

      // Create a payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumber,
        billing_details: {
          name: values.cardHolderName,
        },
      });

      if (error) {
        ToastProvider.error(error.message || "Failed to create payment method");
        return;
      } else {
        if (!paymentMethod || !paymentMethod.id) {
          ToastProvider.error("Failed to create a valid payment method");
          return;
        }
        addCardDetails({ userId: userId, paymentMethodId: paymentMethod.id });
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="flex flex-col gap-15 w-full">
        <div className="flex !border-gray-300 border rounded-[7px] pl-10 pr-3 py-2.5 gap-10">
          <img src={cardNumber} alt="cardNumber icon" />
          <CardNumberElement options={isFirstCard ? { placeholder: '4242 4242 4242 4242' } : {}} className="h-full w-full text-input-font rounded-r-[7px] bg-white font-sans text-base font-normal text-blue-gray-700 outline-none placeholder:text-custom-gray" />
        </div>
        <div className="flex flex-row gap-16 items-center">
          <div className="flex !border-gray-300 border rounded-[7px] pl-10 pr-3 py-2.5 gap-10 w-full">
            <img src={expDate} alt="cardNumber icon" />
            <CardExpiryElement options={isFirstCard ? { placeholder: '11/29' } : {}} className="h-full w-full text-input-font rounded-r-[7px] bg-white font-sans text-base font-normal text-blue-gray-700 outline-none placeholder:text-custom-gray" />
          </div>
          <div className="flex !border-gray-300 border rounded-[7px] pl-10 pr-3 py-2.5 gap-10 w-full">
            <img src={cardNumber} alt="cardNumber icon" />
            <CardCvcElement options={isFirstCard ? { placeholder: '424' } : {}} className="h-full w-full text-input-font rounded-r-[7px] bg-white font-sans text-base font-normal text-blue-gray-700 outline-none placeholder:text-custom-gray" />
          </div>
        </div>
        <div className="flex justify-center w-full">
          <PrimaryButton
            typo={
              isLoading ? (
                <SpinLoaderButton isLoading={true} />
              ) : (
                t("common.addCard")
              )
            }
            styles="max-w-[328px] w-full !rounded-md text-white text-base"
            type="submit"
          />
        </div>
      </div>
    </form>
  );
};

export default AddCardDetails;
