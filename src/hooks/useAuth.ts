import {
  UserRoles,
  isServiceProviderRole,
  isUserRegistrationComplete,
  clearPendingSpStripeOnboarding,
  clearStripeOnboardingComplete,
  clearStripeOnboardingLinkOpened,
} from "@/utils/constants/enums";
import { useNavigate } from "react-router";
import ToastProvider from "@/providers/ToastProvider";
import { useTranslation } from "react-i18next";

export default function useAuth() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleRedirect = (isTipper: boolean, isServiceProvider: boolean) => {
    if (isServiceProvider) {
      localStorage.setItem("userType", "sp");
      void (async () => {
        const user = await getCurrentUser();
        if (!isUserRegistrationComplete(user)) {
          navigate("/register", { state: { role: "sp" } });
          return;
        }
        ToastProvider.success(t("userSelection.welcomeBackServiceProvider"));
        navigate("/service-provider");
      })();
    } else if (isTipper) {
      localStorage.setItem("userType", "tp");
      void (async () => {
        const user = await getCurrentUser();
        if (!isUserRegistrationComplete(user)) {
          navigate("/register", { state: { role: "tp" } });
          return;
        }
        ToastProvider.success(t("userSelection.welcomeBackTipper"));
        navigate("/tip-provider");
      })();
    } else {
      // For users with "both" role, redirect to user selection
      const userRole = localStorage.getItem("userType");
      if (userRole === "both") {
        navigate("/user-selection");
      } else {
        // For any other role (including staff), redirect to sign-in
        navigate("/sign-in");
      }
    }
  };

  /** Incomplete profile: finish registration before dashboard or Stripe onboarding. */
  const handleIncompleteProfileRedirect = async (profileRole?: string) => {
    const user = await getCurrentUser();
    const role = profileRole || user?.Role;
    if (isServiceProviderRole(role)) {
      localStorage.setItem("userType", UserRoles.SERVICEPROVIDER);
      navigate("/register", { state: { role: "sp" } });
    } else {
      localStorage.setItem("userType", UserRoles.TIPER);
      navigate("/register", { state: { role: "tp" } });
    }
  };

  const handleRedirectLocal = async () => {
    const userRole = await getCurrentUserRole();
    if (userRole === UserRoles.SERVICEPROVIDER) {
      ToastProvider.success(t("userSelection.welcomeBackServiceProvider"));
      navigate("/service-provider");
    } else if (userRole === UserRoles.TIPER) {
      ToastProvider.success(t("userSelection.welcomeBackTipper"));
      navigate("/tip-provider");
    } else if (userRole === UserRoles.BOTH) {
      navigate("/user-selection");
    } else {
      navigate("/sign-in");
    }
  };

  const handleRedirectByRole = async () => {
    const role = await getCurrentUserRole();
    if (role === UserRoles.SERVICEPROVIDER) {
      ToastProvider.success(t("userSelection.welcomeBackServiceProvider"));
      navigate("/service-provider");
    } else if (role === UserRoles.TIPER) {
      ToastProvider.success(t("userSelection.welcomeBackTipper"));
      navigate("/tip-provider");
    } else {
      navigate("/user-selection");
    }
  };

  const handleRegisterRedirect = async () => {
    const storedRole = await getCurrentUserRole();
    const user = await getCurrentUser();
    const raw = storedRole || user?.Role || "";

    if (!isUserRegistrationComplete(user)) {
      if (isServiceProviderRole(raw)) {
        navigate("/register", { state: { role: "sp" } });
      } else {
        navigate("/register", { state: { role: "tp" } });
      }
      return;
    }

    if (isServiceProviderRole(raw)) {
      if (!storedRole && user?.Role) {
        const normalized =
          user.Role === "SERVICEPROVIDER" ? UserRoles.SERVICEPROVIDER : user.Role;
        localStorage.setItem("userType", normalized);
      }
      ToastProvider.success("Welcome! Your Service Provider account has been created successfully.");
      clearPendingSpStripeOnboarding();
      clearStripeOnboardingComplete();
      navigate("/service-provider");
    } else {
      ToastProvider.success("Welcome! Your Tipper account has been created successfully.");
      navigate("/tip-provider");
    }
  };
  const getToken = async () => {
    const tokenString = localStorage.getItem("token");
    if (tokenString) {
      return tokenString;
    }
  };

  const setToken = async (userToken: string) => {
    localStorage.setItem("token", userToken);
    localStorage.setItem("selectedCurrency", "GBP");
  };

  const getCurrentUser = async () => {
    const user = localStorage.getItem("user");
    if (user) {
      return JSON.parse(user);
    }
  };

  const setCurrentUser = async (user: unknown) => {
    localStorage.setItem("user", JSON.stringify(user));
  };

  const setCurrentUserId = async (userId: string) => {
    localStorage.setItem("userId", userId);
  };

  const setCurrentUserType = async (userType: string) => {
    if (userType === "both") {
      localStorage.setItem("displaySwitch", "true");
    }
    localStorage.setItem("userType", userType);
  };

  const setCurrentUserEmail = async (email: string) => {
    localStorage.setItem("email", email);
  };

  const getCurrentUserRole = async () => {
    const user_role = localStorage.getItem("userType");
    if (user_role) {
      return user_role;
    }
  };

  const getCurrentUserId = async () => {
    const userId = localStorage.getItem("userId") || "";
    return userId;
  };

  const getCurrentEmail = async () => {
    const email = localStorage.getItem("email") || "";
    return email;
  };

  const handleRedirectToOTP = async (email: string) => {
    navigate("/verify-otp", { state: { email } });
  };

  const handleRedirectToSignupOTP = async (email: string) => {
    navigate("/verify-signup-otp", { state: { email } });
  };

  const handleRedirectToResetPassword = async (email: string, otp: string) => {
    navigate("/reset-password", { state: { email, otp } });
  };

  const handleSignUpRedirect = async () => {
    navigate("/user-selection", { state: { role: "not_registered" } });
  };

  const handleRedirectToLogin = async () => {
    navigate("/sign-in");
  };

  const getGoogleProfileData = () => {
    const googleProfileData = localStorage.getItem("googleProfileData");
    if (googleProfileData) {
      return JSON.parse(googleProfileData);
    }
    return null;
  };

  const clearGoogleProfileData = () => {
    localStorage.removeItem("googleProfileData");
  };

  const clearLocalSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("displaySwitch");
    localStorage.removeItem("notification_token");
    localStorage.removeItem("selectedCurrency");
    localStorage.removeItem("pendingSignUp");
    localStorage.removeItem("googleProfileData");
    localStorage.removeItem("userEmail");
    sessionStorage.removeItem("pendingSignupPassword");
    clearPendingSpStripeOnboarding();
    clearStripeOnboardingComplete();
    clearStripeOnboardingLinkOpened();
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    const deviceUniqueId = localStorage.getItem("notification_token");

    if (token && deviceUniqueId) {
      try {
        const { logoutDevice } = await import("@/api/notifications");
        await logoutDevice(deviceUniqueId);
      } catch (error) {
        console.error("Device logout failed:", error);
      }
    }

    clearLocalSession();
    navigate("/sign-in");
  };

  return {
    getToken,
    setToken,
    setCurrentUserEmail,
    getCurrentUser,
    setCurrentUser,
    getCurrentEmail,
    getCurrentUserRole,
    handleLogout,
    setCurrentUserId,
    getCurrentUserId,
    handleRedirect,
    setCurrentUserType,
    handleSignUpRedirect,
    handleRedirectToOTP,
    handleRedirectToSignupOTP,
    handleRedirectToResetPassword,
    handleRedirectToLogin,
    handleRedirectByRole,
    handleRedirectLocal,
    handleRegisterRedirect,
    handleIncompleteProfileRedirect,
    getGoogleProfileData,
    clearGoogleProfileData,
  };
}
