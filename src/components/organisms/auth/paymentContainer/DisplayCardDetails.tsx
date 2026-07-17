/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetPayementMethods } from "@/api/managePayments";
import VisaLogo from "@/assets/svg/visa.svg";
import MasterCardLogo from "@/assets/svg/mastercard.svg";
import SpinLoader from "@/components/atoms/laoder/spin-loader";

interface DisplayCardDetailsProps {
  onSelectPaymentMethod: (paymentMethodId: string) => void;
  selectedPaymentMethodId: string;
}

const DisplayCardDetails: React.FC<DisplayCardDetailsProps> = ({
  onSelectPaymentMethod,
  selectedPaymentMethodId,
}) => {
  const { data: paymentMethods, isLoading, error } = useGetPayementMethods();
  const getCardLogo = (brand: string) => {
    switch (brand.toLowerCase()) {
      case "visa":
        return <img src={VisaLogo} alt="Visa" width={25} />;
      case "mastercard":
        return <img src={MasterCardLogo} alt="MasterCard" width={25} />;
      default:
        return null;
    }
  };

  if (isLoading || !paymentMethods) {
    return <SpinLoader isLoadingTextVisible={true} isLoading={isLoading} />;
  }

  if (error) {
    return <div className="text-red-500">Error loading payment methods</div>;
  }

  if (!Array.isArray(paymentMethods)) {
    return <div className="text-red-500">Invalid payment methods data</div>;
  }

  if (paymentMethods.length === 0) {
    return <div className="text-gray-500">No payment methods found</div>;
  }

  return (
    <div>
      {paymentMethods.map((method: any) => (
        <div
          key={method.id}
          className={`flex items-center border rounded-[7px] px-10 py-2.5 gap-10 my-10 w-full cursor-pointer ${
            selectedPaymentMethodId === method.id
              ? "border-black scale-105 duration-300 bg-secondary"
              : "border-border"
          }`}
          onClick={() => onSelectPaymentMethod(method.id)}
        >
          <div>{getCardLogo(method.card.brand)}</div>
          <div className="flex flex-row justify-between w-full">
            <div className="text-sm font-medium">
              {method.billing_details.name || method.card.brand} ****
              {method.card.last4}
            </div>
            <div className="text-sm font-medium">
              Exp: {method.card.exp_month}/{method.card.exp_year}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DisplayCardDetails;
