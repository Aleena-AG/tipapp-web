 
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import RootLayout from "@/layout/rootLayout/rootLayout";
import {
  MainScreen,
  UserSelection,
  SPHomeScreen,
  LoginScreen,
  SignUpScreen,
  QrResultScreen,
  SPReviewsScreen,
  SPTipBalance,
  TPHomeScreen,
  UserReviewHistory,
  ViewHistory,
  RegisterScreen,
  WithDrawMoney,
  ProfilePage,
  ResetPasswordScreen,
  VerifyOTPscreen,
  ForgotPasswordScreen,
  PaymentScreen,
  PaymentSucessScreen,
  SPWithdrawHistory,
  SPOverallRatingScreen,
  FAQsScreen,
  Notifications,
} from "@/page";
import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
// import { ReactQueryDevtools } from "react-query/devtools";
import { Toaster } from "react-hot-toast";
import LoginSucess from "./components/organisms/auth/login-suceess/loginContainer";
import ProtectedRoute from "./routes/protectedroutes";
import { UserRoles } from "./utils/constants/enums";
import EmirateIdScreen from "./page/service-provider/emirate-id";
// import { getCurrencyByLocation } from "./hooks/useLocation";
import BulletPointContent from "./page/common/footer/BulletPointContent";
import NewsLetter from "./page/common/footer/NewsLetter";
import Policy from "./page/common/footer/Policy";
import ViewMoreLayout from "./layout/viewMoreLayout/rootLayout";
import { DisableButtonProvider } from "./components/atoms/buttons/DisableButtonContext";
import AboutUs from "./page/common/about";
import PageNotAvailable from "./page/common/page-not-available";
import ContactUsPage from "./page/common/contact-us";
import { UserProvider } from "./contexts/UserContext";
import HowItWorksPage from "./page/common/how-it-works";
import OnboardingPage from "./page/service-provider/onboarding";
import useAuth from "./hooks/useAuth";
import PageLoader from "@/components/atoms/laoder/page-loader";
import { useNavigate } from "react-router-dom";

const queryClient = new QueryClient();

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  currencySymbol: string;
  conversionRates: { [key: string]: number };
}

export const CurrencyContext = React.createContext<CurrencyContextType>({
  currency: "GBP",
  setCurrency: () => {},
  currencySymbol: "£",
  conversionRates: {},
});

function App() {
  // Root redirect component
  const RootRedirect = () => {
    const { getToken, getCurrentUserRole, getCurrentUser } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAndRedirect = async () => {
        try {
          const token = await getToken();
          const userRole = await getCurrentUserRole();
          const user = await getCurrentUser();

          if (!token) {
            navigate("/sign-in");
            return;
          }

          // If we have a user object, check if profile is complete
          if (user && !user.FirstName && user.Role !== "both" && user.Role !== "unknown") {
            const userType = localStorage.getItem("userType");
            if (userType === "tp") {
              navigate("/register", { state: { role: "tp" } });
              return;
            }
            const isSp =
              userType === "sp" ||
              user.Role === "sp" ||
              user.Role === UserRoles.SERVICEPROVIDER;
            if (isSp) {
              navigate("/register", { state: { role: "sp" } });
            } else {
              navigate("/register", { state: { role: "tp" } });
            }
            return;
          }

          // User is logged in, redirect based on role
          if (user && user.Role === "both") {
            // For "both" users, check the current userType from localStorage
            const currentUserType = localStorage.getItem("userType");
            if (currentUserType === "sp") {
              navigate("/service-provider");
            } else if (currentUserType === "tp") {
              navigate("/tip-provider");
            } else {
              navigate("/user-selection");
            }
          } else if (userRole === UserRoles.SERVICEPROVIDER || userRole === "sp") {
            navigate("/service-provider");
          } else if (userRole === UserRoles.TIPER || userRole === "tp") {
            navigate("/tip-provider");
          } else {
            navigate("/user-selection");
          }
        } catch (error) {
          console.error("Error in RootRedirect:", error);
          navigate("/sign-in");
        } finally {
          setIsLoading(false);
        }
      };

      checkAndRedirect();
    }, [getToken, getCurrentUserRole, getCurrentUser, navigate]);

    if (isLoading) {
      return <PageLoader />;
    }

    return null;
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Root redirect for authenticated users */}
        <Route path="/" element={<RootRedirect />} />
        
        {/* Common Routes */}
        <Route path="/main-screen" element={<RootLayout />}>
          <Route index element={<MainScreen />} />
        </Route>

        <Route path="/user-selection" element={<RootLayout />}>
          <Route index element={<UserSelection />} />
        </Route>
        <Route
          path="/my-profile"
          element={
            <ProtectedRoute
              roles={[
                UserRoles.SERVICEPROVIDER,
                UserRoles.TIPER,
                UserRoles.BOTH,
              ]}
            />
          }
        >
          <Route index element={<ProfilePage />} />
        </Route>
        <Route path="/notifications" element={<RootLayout />}>
          <Route index element={<Notifications />} />
        </Route>
        <Route path="/emirate-id" element={<RootLayout />}>
          <Route index element={<EmirateIdScreen />} />
        </Route>
        <Route path="/faqs" element={<RootLayout />}>
          <Route index element={<FAQsScreen />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login-success" element={<RootLayout />}>
          <Route index element={<LoginSucess />} />
        </Route>
        <Route path="/sign-in" element={<RootLayout />}>
          <Route index element={<LoginScreen />} />
        </Route>
        <Route path="/sign-up" element={<RootLayout />}>
          <Route index element={<SignUpScreen />} />
        </Route>
        <Route path="/register" element={<RootLayout />}>
          <Route index element={<RegisterScreen />} />
        </Route>
        <Route path="/service-provider/onboarding" element={<RootLayout />}>
          <Route index element={<OnboardingPage />} />
        </Route>
        <Route path="/forgot-password" element={<RootLayout />}>
          <Route index element={<ForgotPasswordScreen />} />
        </Route>
        <Route path="/verify-otp" element={<RootLayout />}>
          <Route index element={<VerifyOTPscreen />} />
        </Route>
        <Route path="/reset-password" element={<RootLayout />}>
          <Route index element={<ResetPasswordScreen />} />
        </Route>

        <Route path="/view-more/:id" element={<ViewMoreLayout />}>
          <Route index element={<BulletPointContent />} />
        </Route>
        <Route path="/view-more/newsletter" element={<RootLayout />}>
          <Route index element={<NewsLetter />} />
        </Route>
        <Route path="/policy" element={<ViewMoreLayout />}>
          <Route index element={<Policy />} />
        </Route>
        <Route path="/about-us" element={<RootLayout />}>
          <Route index element={<AboutUs />} />
        </Route>
        <Route path="/how-it-works" element={<RootLayout />}>
          <Route index element={<HowItWorksPage />} />
        </Route>
        <Route path="/contact-us" element={<RootLayout />}>
          <Route index element={<ContactUsPage />} />
        </Route>
        <Route path="/magazine" element={<RootLayout />}>
          <Route index element={<PageNotAvailable />} />
        </Route>
        <Route path="/mobile-app" element={<RootLayout />}>
          <Route index element={<PageNotAvailable />} />
        </Route>
        <Route path="/research" element={<RootLayout />}>
          <Route index element={<PageNotAvailable />} />
        </Route>
        {/* Service Provider Routes */}
        <Route
          path="/service-provider"
          element={
            <ProtectedRoute roles={[UserRoles.SERVICEPROVIDER]} />
          }
        >
          <Route index element={<SPHomeScreen />} />
          <Route path="reviews" element={<SPReviewsScreen />} />
          <Route path="tip-balance" element={<SPTipBalance />} />
          <Route path="withdraw-money" element={<WithDrawMoney />} />
          <Route path="withdraw-history" element={<SPWithdrawHistory />} />
        </Route>

        {/* Tipper Routes */}
        <Route
          path="/tip-provider"
          element={<ProtectedRoute roles={[UserRoles.TIPER]} />}
        >
          <Route index element={<TPHomeScreen />} />
          <Route
            path="tip/:id"
            element={
              <DisableButtonProvider>
                <QrResultScreen />
              </DisableButtonProvider>
            }
          />
          <Route path="user-review-history" element={<UserReviewHistory />} />
          <Route path="view-history" element={<ViewHistory />} />
          <Route
            path="service-provider-rating"
            element={<SPOverallRatingScreen />}
          />
        </Route>

        {/* Payment Routes */}
        <Route
          path="/payment"
          element={
            <ProtectedRoute
              roles={[UserRoles.SERVICEPROVIDER, UserRoles.TIPER]}
            />
          }
        >
          <Route index element={<PaymentScreen />} />
        </Route>
        <Route
          path="/payment/success"
          element={
            <ProtectedRoute
              roles={[
                UserRoles.SERVICEPROVIDER,
                UserRoles.TIPER,
                UserRoles.BOTH,
              ]}
            />
          }
        >
          <Route index element={<PaymentSucessScreen />} />
        </Route>
      </>
    )
  );

  const [currency, setCurrency] = useState<string>(
    // localStorage.getItem("selectedCurrency") || "GBP"
    "GBP"
  );
  const [conversionRates, setConversionRates] = useState<{
    [key: string]: number;
  }>({});

  // Currency symbols mapping
  const getCurrencySymbol = (currencyCode: string): string => {
    const symbols: { [key: string]: string } = {
      AED: "د.إ",
      EUR: "€",
      GBP: "£",
      USD: "$",
    };
    return symbols[currencyCode] || currencyCode;
  };

  const currencySymbol = getCurrencySymbol(currency);

  useEffect(() => {
    // Fetch currency based on geolocation
    const fetchCurrency = async () => {
      // const geoCurrency = await getCurrencyByLocation();
      // setCurrency(geoCurrency || "GBP");
      "GBP"
    };

    fetchCurrency();
  }, []);

  useEffect(() => {
    // Fetch conversion rates when currency changes
    const fetchRates = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_EXCHANGE_RATE_API}EUR`
        );
        const data = await response.json();
        setConversionRates(data.rates || {});
      } catch (error) {
        console.error("Error fetching conversion rates:", error);
        setConversionRates({});
      }
    };

    fetchRates();
  }, []);

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, currencySymbol, conversionRates }}
    >
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <RouterProvider router={router} />
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          <Toaster position="top-center" />
        </UserProvider>
      </QueryClientProvider>
    </CurrencyContext.Provider>
  );
}

export default App;
