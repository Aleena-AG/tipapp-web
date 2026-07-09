import logo from "@/assets/images/appLogo.png";
import { AccountCard } from "@/components/atoms/account/accountCard";
import { RegisterAccountCard } from "@/components/atoms/account/registerAccountCard";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { HelpCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useUpdateUser } from "@/api/userDetails";
import ToastProvider from "@/providers/ToastProvider";
import { FaChevronDown } from "react-icons/fa";
import { useUser } from "@/contexts/UserContext";
import {
  clearPendingSpStripeOnboarding,
  isPendingSpStripeOnboarding,
  setPendingSpStripeOnboarding,
} from "@/utils/constants/enums";

export const SwitchAccount = ({ role }: { role: string }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { userDetails } = useUser();
  const displaySwitchAccount = localStorage.getItem("displaySwitch");
  const roleType = localStorage.getItem("userType");
  const isOnboardingPage = location.pathname.includes(
    "/service-provider/onboarding"
  );

  const shouldShowSwitchOptions =
    displaySwitchAccount === "true" ||
    userDetails?.Role === "both" ||
    isOnboardingPage ||
    isPendingSpStripeOnboarding();

  const navigateAfterTipperSwitch = () => {
    const stored = localStorage.getItem("user");
    const parsed = stored ? JSON.parse(stored) : null;
    if (!parsed?.FirstName) {
      navigate("/register", { state: { role: "tp" } });
    } else {
      navigate("/tip-provider");
    }
  };

  const navigateAfterServiceProviderSwitch = () => {
    const stored = localStorage.getItem("user");
    const parsed = stored ? JSON.parse(stored) : null;
    const profile = parsed || userDetails;

    if (!profile?.FirstName) {
      navigate("/register", { state: { role: "sp" }, replace: true });
      return;
    }

    navigate("/service-provider", { replace: true });
  };

  const handleSwitchAccount = (newRole: string) => {
    localStorage.setItem("userType", newRole);
    localStorage.setItem("displaySwitch", "true");

    if (newRole === "tp") {
      clearPendingSpStripeOnboarding();
      ToastProvider.success(t("userSelection.welcomeBackTipper"));
      if (isOnboardingPage) {
        navigateAfterTipperSwitch();
        return;
      }
      navigate("/tip-provider", { replace: true });
      return;
    }

    ToastProvider.success(t("userSelection.welcomeBackServiceProvider"));
    navigateAfterServiceProviderSwitch();
  };

  const { mutate } = useUpdateUser(
    () => {
      const newRole = roleType === "tp" ? "sp" : "tp";
      localStorage.setItem("displaySwitch", "true");
      localStorage.setItem("userType", newRole);
      if (newRole === "sp") {
        ToastProvider.success(t("userSelection.welcomeBackServiceProvider"));
        navigateAfterServiceProviderSwitch();
      } else {
        ToastProvider.success(t("userSelection.welcomeBackTipper"));
        navigate("/tip-provider", { replace: true });
      }
    },
    () => {
      ToastProvider.error("Failed to create account");
    }
  );

  const handleRegisterAccount = async () => {
    const newRole = roleType === "tp" ? "sp" : "tp";

    localStorage.setItem("displaySwitch", "true");
    localStorage.setItem("userType", newRole);
    if (newRole === "sp") {
      setPendingSpStripeOnboarding();
    } else {
      clearPendingSpStripeOnboarding();
    }

    mutate({ Role: "both" });
  };

  {/* Color role handling */ }
  const colorChangeRole = typeof window !== "undefined" ? localStorage.getItem("userType") : null; // "tp" | "sp" | null
  const roleClassesBorder =
    colorChangeRole === "tp"
      ? "sm:border sm:border-[#0B538D] sm:shadow-[0_0_15px_0_rgba(11,83,141,0.5)]"
      : colorChangeRole === "sp"
        ? "sm:border sm:border-[#d71921] sm:shadow-[0_0_15px_0_rgba(215,25,33,0.5)]"
        : "";


  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          onClick={() => { }}
          className="group flex h-full items-center gap-2 rounded-[12px] bg-white px-3 py-1.5 shadow-[0_6px_18px_rgba(11,83,141,0.12)] ring-1 ring-[#EDF1F6] transition-all hover:shadow-[0_8px_22px_rgba(11,83,141,0.18)]"
        >
          <img src={logo} className="h-8 w-auto" alt="logo" />
          <span className="poppins-semibold text-[14px] text-[#1B1B1B]">{role}</span>
          <FaChevronDown className="ml-1 text-[11px] text-[#7A869A] transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className={`w-[240px] rounded-[16px] border border-[#EDF1F6] bg-white p-3 shadow-[0_18px_40px_rgba(11,83,141,0.16)] ${roleClassesBorder}`}
      >
        <p className="poppins-semibold mb-2 px-1 text-[11px] uppercase tracking-[0.08em] text-[#9AA6B6]">
          {t("userSelection.chooseHowToContinue")}
        </p>
        {shouldShowSwitchOptions ? (
          <div className="flex flex-col gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div>
                  <AccountCard
                    selected={roleType === "tp"}
                    variant="tp"
                    title={t("userSelection.tipper")}
                  />
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-full max-w-[400px] gap-0 rounded-[20px] border-none p-0">
                <div className="flex flex-col items-center px-6 pb-6 pt-8 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF3FA]">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0B538D]">
                      <HelpCircle className="h-6 w-6 text-white" strokeWidth={2.2} />
                    </span>
                  </span>
                  <AlertDialogHeader className="space-y-0">
                    <AlertDialogTitle className="poppins-semibold mt-5 text-center text-[22px] leading-snug text-[#0B2B4E]">
                      {t("common.areYouSure")}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="poppins-regular mx-auto mt-2 max-w-[300px] text-center text-[15px] leading-relaxed text-[#6F7682]">
                      {t("common.switchToTipperConfirmation")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="mt-6 flex w-full flex-col-reverse gap-3 sm:flex-col-reverse sm:space-x-0">
                    <AlertDialogCancel className="mt-0 h-12 w-full rounded-[12px] border border-[#E4E9F0] text-[15px] font-medium text-[#1B1B1B] hover:bg-[#F5F7FA]">
                      {t("common.no")}
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="h-12 w-full rounded-[12px] bg-[#0B538D] text-[15px] font-medium text-white hover:bg-[#0077B6]"
                      onClick={() => handleSwitchAccount("tp")}
                    >
                      {t("common.yes")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </div>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div>
                  <AccountCard
                    selected={roleType === "sp"}
                    variant="sp"
                    title={t("userSelection.serviceProvider")}
                  />
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-full max-w-[400px] gap-0 rounded-[20px] border-none p-0">
                <div className="flex flex-col items-center px-6 pb-6 pt-8 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FBEDED]">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#9E2A2B]">
                      <HelpCircle className="h-6 w-6 text-white" strokeWidth={2.2} />
                    </span>
                  </span>
                  <AlertDialogHeader className="space-y-0">
                    <AlertDialogTitle className="poppins-semibold mt-5 text-center text-[22px] leading-snug text-[#0B2B4E]">
                      {t("common.areYouSure")}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="poppins-regular mx-auto mt-2 max-w-[300px] text-center text-[15px] leading-relaxed text-[#6F7682]">
                      {t("common.switchToServiceProviderConfirmation")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="mt-6 flex w-full flex-col-reverse gap-3 sm:flex-col-reverse sm:space-x-0">
                    <AlertDialogCancel className="mt-0 h-12 w-full rounded-[12px] border border-[#E4E9F0] text-[15px] font-medium text-[#1B1B1B] hover:bg-[#F5F7FA]">
                      {t("common.no")}
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="h-12 w-full rounded-[12px] bg-[#9E2A2B] text-[15px] font-medium text-white hover:bg-[#ce260b]"
                      onClick={() => handleSwitchAccount("sp")}
                    >
                      {t("common.yes")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ) : (
          <RegisterAccountCard
            onClick={() => {
              setTimeout(() => {
                handleRegisterAccount();
              }, 1000);
            }}
            title={
              role === t("userSelection.tipper")
                ? t("userSelection.serviceProvider")
                : t("userSelection.tipper")
            }
          />
        )}
      </PopoverContent>
    </Popover>
  );
};

export default SwitchAccount;
