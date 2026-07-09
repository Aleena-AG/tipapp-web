import PaymentContainer from "@/components/organisms/auth/paymentContainer/PaymentContainer";
import { useGetStripeConfig } from "@/api/managePayments";
import PageLoader from "@/components/atoms/laoder/page-loader";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";

const PaymentScreen = () => {
  const location = useLocation();
  const clientSecret = location.state?.clientSecret as string | undefined;
  const { data: stripeConfig, isLoading, isError } = useGetStripeConfig();

  const stripePromise = useMemo<Promise<Stripe | null> | null>(() => {
    if (!stripeConfig?.publishableKey) return null;
    return loadStripe(stripeConfig.publishableKey);
  }, [stripeConfig?.publishableKey]);

  if (!clientSecret || !location.state?.tipData) {
    return <Navigate to="/tip-provider" replace />;
  }

  if (isLoading || !stripePromise) {
    return (
      <div className="min-h-screen bg-primary-hex flex flex-col items-center justify-center py-[35px]">
        <PageLoader />
      </div>
    );
  }

  if (isError || !stripeConfig?.publishableKey) {
    return (
      <div className="min-h-screen bg-primary-hex flex flex-col items-center justify-center py-[35px]">
        <p className="text-white">Unable to load payment configuration.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-hex flex flex-col items-center justify-center py-[35px]">
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          locale: "en-GB",
          appearance: {
            theme: "stripe",
            variables: {
              colorPrimary: "#0B538D",
              borderRadius: "8px",
            },
          },
        }}
      >
        <PaymentContainer />
      </Elements>
    </div>
  );
};

export default PaymentScreen;
