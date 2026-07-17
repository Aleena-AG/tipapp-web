import AddPaymentDetailsButton from "@/components/atoms/payments/AddPaymentDetailsButton";
import ProfileEditTextInput from "@/components/atoms/textinput/textInput/ProfileEditTextInput";
import { truncateEmail } from "@/hooks/hooks";
import { CardDetails } from "@/utils/types/types";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DeleteBinButton } from "@/components/atoms/buttons/customButtons";
import ConfirmationIcon from "@/assets/svg/confirmation-modal-icon.svg";
import { useTranslation } from "react-i18next";

interface Props {
  paypalEmail: string;
  cardDetails?: string;
  setPaypalEmail: (email: string) => void;
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
}

const PaymentDetailsSection = (props: Props) => {
  const { t } = useTranslation();
  const [isCardDetails, setIsCardDetails] = useState(false);
  const [isNewCard, setIsNewCard] = useState(false);
  const [isPaypal, setIsPaypal] = useState(false);
  const [cardDetailsList, setCardDetailsList] = useState<CardDetails[]>([
    {
      cardHolderName: "",
      cardNumber: "",
      expireDate: "",
      cvv: "",
      cardNickname: "",
    },
  ]);

  const toggleCardDetails = () => {
    setIsCardDetails(!isCardDetails);
  };

  const togglePaypal = () => {
    setIsPaypal(!isPaypal);
  };

  const toggleNewCard = () => {
    setIsNewCard(!isNewCard);
  };

  const handleAddCard = () => {
    setCardDetailsList([
      ...cardDetailsList,
      {
        cardHolderName: "",
        cardNumber: "",
        expireDate: "",
        cvv: "",
        cardNickname: "",
      },
    ]);
    setIsNewCard(false);
  };

  const handleRemoveCard = (index: number) => {
    if (cardDetailsList.length > 1) {
      setCardDetailsList(cardDetailsList.filter((_, i) => i !== index));
    }
  };

  const handleCardDetailsChange = (
    index: number,
    field: keyof CardDetails,
    value: string
  ) => {
    const updatedCards = cardDetailsList.map((card, i) =>
      i === index ? { ...card, [field]: value } : card
    );
    setCardDetailsList(updatedCards);
  };

  return (
    <>
      <div className=" flex sm:flex-row flex-col gap-y-8 items-center gap-x-4 sm:gap-x-8">
        <AddPaymentDetailsButton
          placeholder={`${
            props.cardDetails ? props.cardDetails : "Add New Card"
          }`}
          onClick={() => {
            toggleCardDetails();
          }}
          selected={isCardDetails}
          label={"Card"}
          type="add-payment-details-btn"
        />
        <AddPaymentDetailsButton
          placeholder={`${
            props.paypalEmail
              ? truncateEmail(props.paypalEmail)
              : "Paypal Email"
          }`}
          label={"Paypal"}
          onClick={() => {
            togglePaypal();
          }}
          selected={isPaypal}
          type="add-payment-details-btn"
        />
      </div>
      {isCardDetails && (
        <>
          <div className="flex items-center w-full mt-26 my-28">
            <div className="h-px bg-[#E0E0E0] w-full opacity-40" />
            <div className="poppins-medium text-[14px] w-[466px] text-center">
              Card Details
            </div>
            <div className="h-px bg-[#E0E0E0] w-full opacity-40" />
          </div>

          {/* card details section */}
          <div>
            {cardDetailsList.map((card, index) => (
              <div key={index} className="mt-20">
                <div className="flex flex-col gap-y-16 ">
                  <div className="flex items-center justify-between gap-8">
                    <ProfileEditTextInput
                      placeholder="Card Holder Name"
                      value={card.cardHolderName}
                      id={`Card Holder Name-${index}`}
                      name="Card Holder Name"
                      type="text"
                      containerStyles="max-w-[229px]"
                      label="Card Holder Name"
                      onChange={(e) =>
                        handleCardDetailsChange(
                          index,
                          "cardHolderName",
                          e.currentTarget.value
                        )
                      }
                    />
                    <ProfileEditTextInput
                      placeholder="Card Number"
                      value={card.cardNumber}
                      id={`Card Number-${index}`}
                      name="Card Number"
                      type="text"
                      containerStyles="max-w-[229px]"
                      label="Card Number"
                      onChange={(e) =>
                        handleCardDetailsChange(
                          index,
                          "cardNumber",
                          e.currentTarget.value
                        )
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between gap-8">
                    <ProfileEditTextInput
                      placeholder="Expire Date"
                      value={card.expireDate}
                      id={`Expire Date-${index}`}
                      name="Expire Date"
                      type="text"
                      containerStyles="max-w-[229px]"
                      label="Expire Date"
                      onChange={(e) =>
                        handleCardDetailsChange(
                          index,
                          "expireDate",
                          e.currentTarget.value
                        )
                      }
                    />
                    <ProfileEditTextInput
                      placeholder="CVV"
                      value={card.cvv}
                      id={`CVV-${index}`}
                      name="CVV"
                      type="text"
                      containerStyles="max-w-[229px]"
                      label="CVV"
                      onChange={(e) =>
                        handleCardDetailsChange(
                          index,
                          "cvv",
                          e.currentTarget.value
                        )
                      }
                    />
                  </div>
                  <div className="flex items-center gap-8">
                    <ProfileEditTextInput
                      placeholder="Card Nickname"
                      value={card.cardNickname}
                      id={`Card Nickname-${index}`}
                      name="Card Nickname"
                      type="text"
                      containerStyles="max-w-[229px]"
                      label="Card Nickname"
                      onChange={(e) =>
                        handleCardDetailsChange(
                          index,
                          "cardNickname",
                          e.currentTarget.value
                        )
                      }
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DeleteBinButton
                          isDisabled={cardDetailsList.length === 1}
                        />
                      </AlertDialogTrigger>
                      <AlertDialogContent className=" w-full max-w-[350px] rounded-xl md:max-w-[500px] lg:max-w-[650px] lg:p-8">
                        <div className="relative">
                          <div className=" absolute transform bg-card p-8 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 max-w-[84.363px] min-h-[84.363px] mih-h-[84.363px] max-h-[84.363px] h-full w-full rounded-full ">
                            <div className="bg-black h-full w-full rounded-full justify-center items-center flex">
                              <img src={ConfirmationIcon} />
                            </div>
                          </div>
                        </div>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="pt-87 max-lg:text-[19px]  max-lg:pt-56  poppins-semibold text-[25px] leading-normal text-center">
                            {t("common.areYouSure")}
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-black opacity-50 poppins-semibold text-[20px] max-lg:text-[15px]  text-center max-w-[374px] mx-auto">
                            {t("common.deleteCardConfirmation")}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <div className="pt-30 flex flex-col gap-8 justify-center items-center mx-auto pb-46">
                            <AlertDialogAction
                              className="lg:min-w-[328px] max-lg:min-w-[200px] max-w-[328px] mih-h-[48px] max-h-[48px] rounded-8"
                              onClick={() => {
                                handleRemoveCard(index);
                              }}
                            >
                              Yes
                            </AlertDialogAction>
                            <AlertDialogCancel className="lg:min-w-[328px] max-lg:min-w-[200px] max-w-[328px] mih-h-[48px] max-h-[48px] rounded-8 border border-black">
                              No
                            </AlertDialogCancel>
                          </div>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <AddPaymentDetailsButton
            placeholder={"Add a new card"}
            onClick={() => {
              toggleNewCard();
              handleAddCard();
            }}
            type="add-new-card-btn"
            selected={isCardDetails}
            containerStyles={"max-w-[229px] "}
          />
        </>
      )}
      {isPaypal && (
        <>
          <div className="flex items-center w-full py-14">
            <div className="h-px bg-[#E0E0E0] w-full opacity-40" />
            <div className="poppins-medium text-[14px] w-[466px] text-center">
              Paypal
            </div>
            <div className="h-px bg-[#E0E0E0] w-full opacity-40" />
          </div>
          <div>
            <ProfileEditTextInput
              placeholder="Paypal Email"
              value={truncateEmail(props.paypalEmail)}
              id={"Paypal"}
              name="Paypal"
              type="email"
              containerStyles="max-w-[229px]"
              label="Paypal"
              onChange={(e) => props.setPaypalEmail(e.currentTarget.value)}
              isError={Boolean(props.errors.Paypal && props.touched.Paypal)}
              errorMsg={props.errors.Paypal}
              onBlur={() => {}}
            />
          </div>
        </>
      )}
    </>
  );
};

export default PaymentDetailsSection;
