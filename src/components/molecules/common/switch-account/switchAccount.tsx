import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { HelpCircle, Store, User } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useUpdateUser } from "@/api/userDetails";
import ToastProvider from "@/providers/ToastProvider";
import { useUser } from "@/contexts/UserContext";
import {
  clearPendingSpStripeOnboarding,
  isPendingSpStripeOnboarding,
  setPendingSpStripeOnboarding,
} from "@/utils/constants/enums";

type SwitchTarget = "tp" | "sp" | null;

export const SwitchAccount = ({
  variant = "floating",
}: {
  role?: string;
  variant?: "navbar" | "floating";
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { userDetails } = useUser();
  const [pendingRole, setPendingRole] = useState<SwitchTarget>(null);
  const [showRegisterConfirm, setShowRegisterConfirm] = useState(false);

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

  const isTipper = roleType === "tp";
  const isServiceProvider = roleType === "sp";

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
    setPendingRole(null);

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
      setShowRegisterConfirm(false);
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
      setShowRegisterConfirm(false);
    }
  );

  const handleRegisterAccount = () => {
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

  const requestSwitch = (target: "tp" | "sp") => {
    if (target === roleType) return;

    if (shouldShowSwitchOptions) {
      setPendingRole(target);
      return;
    }

    setShowRegisterConfirm(true);
  };

  const confirmRole = pendingRole;
  const isConfirmingTipper = confirmRole === "tp";
  const registerTarget =
    roleType === "tp"
      ? t("userSelection.serviceProvider")
      : t("userSelection.tipper");

  const isNavbar = variant === "navbar";

  return (
    <>
      <div
        role="group"
        aria-label={t("userSelection.chooseHowToContinue")}
        className={
          isNavbar
            ? "flex items-center rounded-full bg-white/15 p-[3px] backdrop-blur-sm ring-1 ring-white/20"
            : "flex items-center rounded-full bg-white p-[3px] shadow-[0_6px_18px_rgba(11,83,141,0.12)] ring-1 ring-[#EDF1F6] dark:bg-slate-800 dark:shadow-[0_6px_18px_rgba(0,0,0,0.4)] dark:ring-slate-700"
        }
      >
        <button
          type="button"
          onClick={() => requestSwitch("tp")}
          aria-pressed={isTipper}
          className={`poppins-semibold flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[12px] leading-none transition-all duration-200 sm:gap-2 sm:px-3.5 sm:text-[13px] ${
            isTipper
              ? isNavbar
                ? "bg-white text-[#0B538D] shadow-sm"
                : "bg-[#0B538D] text-white shadow-sm"
              : isNavbar
                ? "text-white/75 hover:bg-white/10 hover:text-white"
                : "text-[#6F7682] hover:bg-[#F0F4F8] hover:text-[#0B538D] dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-[#93C5FD]"
          }`}
        >
          <User className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" strokeWidth={2.2} />
          <span>{t("userSelection.tipper")}</span>
        </button>

        <button
          type="button"
          onClick={() => requestSwitch("sp")}
          aria-pressed={isServiceProvider}
          className={`poppins-semibold flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[12px] leading-none transition-all duration-200 sm:gap-2 sm:px-3.5 sm:text-[13px] ${
            isServiceProvider
              ? isNavbar
                ? "bg-white text-[#9E2A2B] shadow-sm"
                : "bg-[#9E2A2B] text-white shadow-sm"
              : isNavbar
                ? "text-white/75 hover:bg-white/10 hover:text-white"
                : "text-[#6F7682] hover:bg-[#F0F4F8] hover:text-[#9E2A2B] dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-red-300"
          }`}
        >
          <Store className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" strokeWidth={2.2} />
          <span className="sm:hidden">{t("userSelection.providerShort")}</span>
          <span className="hidden sm:inline">
            {t("userSelection.serviceProvider")}
          </span>
        </button>
      </div>

      {/* Switch confirmation */}
      <AlertDialog
        open={pendingRole !== null}
        onOpenChange={(open) => {
          if (!open) setPendingRole(null);
        }}
      >
        <AlertDialogContent className="w-full max-w-[400px] gap-0 overflow-hidden rounded-[20px] border-none bg-card p-0 dark:bg-[#0a1629]">
          <div className="flex flex-col items-center px-6 pb-6 pt-8 text-center">
            <span
              className={`flex h-16 w-16 items-center justify-center rounded-full ${
                isConfirmingTipper
                  ? "bg-[#EAF3FA] dark:bg-[#0B538D]/30"
                  : "bg-[#FBEDED] dark:bg-[#9E2A2B]/30"
              }`}
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-full ${
                  isConfirmingTipper ? "bg-[#0B538D]" : "bg-[#9E2A2B]"
                }`}
              >
                <HelpCircle className="h-6 w-6 text-white" strokeWidth={2.2} />
              </span>
            </span>
            <AlertDialogHeader className="space-y-0">
              <AlertDialogTitle className="poppins-semibold mt-5 text-center text-[22px] leading-snug text-[#0B2B4E] dark:!text-white">
                {t("common.areYouSure")}
              </AlertDialogTitle>
              <AlertDialogDescription className="poppins-regular mx-auto mt-2 max-w-[300px] text-center text-[15px] leading-relaxed text-[#6F7682] dark:!text-slate-400">
                {isConfirmingTipper
                  ? t("common.switchToTipperConfirmation")
                  : t("common.switchToServiceProviderConfirmation")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6 flex w-full flex-col-reverse gap-3 sm:flex-col-reverse sm:space-x-0">
              <AlertDialogCancel className="mt-0 h-12 w-full rounded-[12px] border border-border text-[15px] font-medium text-app hover:bg-[#F5F7FA] dark:border-white/20 dark:!text-slate-200 dark:hover:bg-white/10">
                {t("common.no")}
              </AlertDialogCancel>
              <AlertDialogAction
                className={`h-12 w-full rounded-[12px] text-[15px] font-medium !text-white ${
                  isConfirmingTipper
                    ? "bg-[#0B538D] hover:bg-[#0077B6]"
                    : "bg-[#9E2A2B] hover:bg-[#ce260b]"
                }`}
                onClick={() => confirmRole && handleSwitchAccount(confirmRole)}
              >
                {t("common.yes")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Register other role confirmation */}
      <AlertDialog open={showRegisterConfirm} onOpenChange={setShowRegisterConfirm}>
        <AlertDialogContent className="w-full max-w-[400px] gap-0 overflow-hidden rounded-[20px] border-none bg-card p-0 dark:bg-[#0a1629]">
          <div className="flex flex-col items-center px-6 pb-6 pt-8 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F0F4F8] dark:bg-[#0B538D]/30">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0B538D]">
                <HelpCircle className="h-6 w-6 text-white" strokeWidth={2.2} />
              </span>
            </span>
            <AlertDialogHeader className="space-y-0">
              <AlertDialogTitle className="poppins-semibold mt-5 text-center text-[22px] leading-snug text-[#0B2B4E] dark:!text-white">
                {t("common.areYouSure")}
              </AlertDialogTitle>
              <AlertDialogDescription className="poppins-regular mx-auto mt-2 max-w-[300px] text-center text-[15px] leading-relaxed text-[#6F7682] dark:!text-slate-400">
                {t("common.signInAsRoleConfirmation", { role: registerTarget })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6 flex w-full flex-col-reverse gap-3 sm:flex-col-reverse sm:space-x-0">
              <AlertDialogCancel className="mt-0 h-12 w-full rounded-[12px] border border-border text-[15px] font-medium text-app hover:bg-[#F5F7FA] dark:border-white/20 dark:!text-slate-200 dark:hover:bg-white/10">
                {t("common.no")}
              </AlertDialogCancel>
              <AlertDialogAction
                className="h-12 w-full rounded-[12px] bg-[#0B538D] text-[15px] font-medium !text-white hover:bg-[#0077B6]"
                onClick={handleRegisterAccount}
              >
                {t("common.yes")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SwitchAccount;
