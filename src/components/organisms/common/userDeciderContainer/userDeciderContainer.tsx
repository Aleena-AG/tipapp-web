import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaSignOutAlt } from "react-icons/fa";
import { ArrowRight, Briefcase, Heart, Quote, Store, User } from "lucide-react";
import ToastProvider from "@/providers/ToastProvider";
import useAuth from "@/hooks/useAuth";
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
import { clearPendingSpStripeOnboarding } from "@/utils/constants/enums";
import AuthIllustration from "@/assets/images/auth-illustration.png";
import AppLogo from "@/assets/images/appLogo.png";
import CharacterTipper from "@/assets/images/character2.png";
import CharacterServiceProvider from "@/assets/images/character-1.png";

const RoleCard = ({
  title,
  description,
  icon: Icon,
  accent,
  onClick,
}: {
  title: string;
  description: string;
  icon: typeof Store;
  accent: "sp" | "tp";
  onClick: () => void;
}) => {
  const styles =
    accent === "sp"
      ? {
          card: "border-[#F0C9CC] bg-gradient-to-br from-[#FFF5F6] to-[#FDEEF0] hover:border-[#E8A0A6] hover:shadow-[0_12px_32px_rgba(158,42,43,0.12)]",
          icon: "bg-[#9E2A2B] shadow-[0_4px_14px_rgba(158,42,43,0.35)]",
          arrow: "bg-[#9E2A2B]/10 text-[#9E2A2B] group-hover:bg-[#9E2A2B] group-hover:text-white",
        }
      : {
          card: "border-[#BFD9EC] bg-gradient-to-br from-[#F0F7FC] to-[#E7F1F9] hover:border-[#8BB8D9] hover:shadow-[0_12px_32px_rgba(11,83,141,0.12)]",
          icon: "bg-[#0B538D] shadow-[0_4px_14px_rgba(11,83,141,0.35)]",
          arrow: "bg-[#0B538D]/10 text-[#0B538D] group-hover:bg-[#0B538D] group-hover:text-white",
        };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-2xl border px-4 py-4 text-left transition-all duration-300 active:scale-[0.98] sm:gap-4 sm:py-5 ${styles.card}`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white sm:h-12 sm:w-12 ${styles.icon}`}
      >
        <Icon
          className="h-5 w-5 sm:h-6 sm:w-6"
          strokeWidth={2}
          fill={accent === "tp" ? "currentColor" : "none"}
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className="poppins-semibold block text-base leading-6 text-app">
          {title}
        </span>
        <span className="poppins-regular mt-0.5 block text-[13px] leading-snug text-app-muted">
          {description}
        </span>
      </span>
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 group-hover:translate-x-0.5 ${styles.arrow}`}
      >
        <ArrowRight className="h-4 w-4" />
      </span>
    </button>
  );
};

const UserDeciderContainer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = location.state || {};
  const { t } = useTranslation();
  const { handleLogout } = useAuth();
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const handleRouteSPHome = () => {
    localStorage.setItem("userType", "sp");
    if (role === "not_registered") {
      navigate("/register", { state: { role: "sp" } });
    } else {
      clearPendingSpStripeOnboarding();
      ToastProvider.success(t("userSelection.welcomeBackServiceProvider"));
      navigate("/service-provider");
    }
  };

  const handleRouteTPHome = () => {
    clearPendingSpStripeOnboarding();
    localStorage.setItem("userType", "tp");
    if (role === "not_registered") {
      navigate("/register", { state: { role: "tp" } });
    } else {
      ToastProvider.success(t("userSelection.welcomeBackTipper"));
      navigate("/tip-provider");
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirmation(false);
    void handleLogout();
  };

  useEffect(() => {
    if (role === "sp") {
      clearPendingSpStripeOnboarding();
      localStorage.setItem("userType", "sp");
      ToastProvider.success(t("userSelection.welcomeBackServiceProvider"));
      navigate("/service-provider");
    } else if (role === "tp") {
      clearPendingSpStripeOnboarding();
      localStorage.setItem("userType", "tp");
      ToastProvider.success(t("userSelection.welcomeBackTipper"));
      navigate("/tip-provider");
    }
  }, [role, navigate, t]);

  const logoutButton = (variant: "mobile" | "desktop" = "desktop") => (
    <button
      onClick={handleLogoutClick}
      className={
        variant === "mobile"
          ? "flex items-center gap-2 rounded-full border border-white/60 bg-white/90 px-3 py-1.5 text-app-muted shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-white hover:text-app"
          : "flex items-center gap-2 text-[#0B538D] transition-colors duration-200 hover:text-[#083c66]"
      }
      type="button"
    >
      <FaSignOutAlt className="text-sm" />
      <span className="poppins-medium text-sm">{t("buttons.signOut")}</span>
    </button>
  );

  return (
    <>
      {/* Mobile layout */}
      <div className="mx-auto w-full max-w-[431px] overflow-hidden rounded-[24px] border border-white/80 bg-card shadow-[0_20px_60px_rgba(0,0,0,0.08)] lg:hidden">
        <div className="relative overflow-hidden bg-gradient-to-b from-[#FFF0F2] via-[#FDEEF0] to-[#FCE7EB] px-4 pb-2 pt-14 sm:px-6 sm:pb-4">
          <div className="absolute -left-10 top-8 h-32 w-32 rounded-full bg-[#9E2A2B]/10 blur-3xl" />
          <div className="absolute -right-8 top-16 h-28 w-28 rounded-full bg-[#0B538D]/10 blur-3xl" />
          <div className="absolute left-4 top-4 z-10">{logoutButton("mobile")}</div>
          <img
            src={AuthIllustration}
            alt="Scan, tip and receive with TipTapp"
            className="relative z-[1] mx-auto w-full max-w-[300px] object-contain drop-shadow-[0_20px_40px_rgba(158,42,43,0.1)] sm:max-w-[340px]"
          />
        </div>

        <div className="relative -mt-5 rounded-t-[28px] bg-card px-4 pb-10 pt-7 sm:px-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="poppins-semibold text-2xl leading-8 text-app">
              {t("userSelection.welcome")}
            </h1>
            <p className="poppins-regular mx-auto max-w-[340px] text-sm leading-relaxed text-app-muted">
              {t("userSelection.welcomeMessage")}
            </p>
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#F5D5D8] bg-[#FFF5F6] px-4 py-3.5">
            <Quote className="mt-0.5 h-5 w-5 shrink-0 text-[#9E2A2B]/60" strokeWidth={2} />
            <p className="poppins-medium text-sm italic leading-relaxed text-[#9E2A2B]">
              {t("userSelection.serviceQuote")}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-[#EBE9F5] bg-app-page px-4 py-4 sm:gap-3">
            <span className="poppins-semibold text-base text-app">
              {t("userSelection.iAmThe")}
            </span>
            <span className="text-[#D0D0D0]">&bull;</span>
            <span className="poppins-medium animate-pulse rounded-full bg-[#9E2A2B] px-4 py-1.5 text-xs text-white shadow-[0_4px_12px_rgba(158,42,43,0.3)]">
              {t("userSelection.pleaseSelect")}
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-3.5">
            <RoleCard
              title={t("userSelection.serviceProvider")}
              description={t("userSelection.serviceProviderDescription")}
              icon={Store}
              accent="sp"
              onClick={handleRouteSPHome}
            />
            <RoleCard
              title={t("userSelection.tipper")}
              description={t("userSelection.tipperDescription")}
              icon={Heart}
              accent="tp"
              onClick={handleRouteTPHome}
            />
          </div>
        </div>
      </div>

      {/* Desktop / website layout */}
      <div className="relative hidden min-h-screen w-full flex-col overflow-hidden bg-app-page lg:flex">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-20 h-[420px] w-[420px] rounded-full bg-[#0B538D]/[0.04]" />
          <div className="absolute -right-24 bottom-0 h-[380px] w-[380px] rounded-full bg-[#9E2A2B]/[0.04]" />
          <div className="absolute left-[8%] top-[18%] h-28 w-28 opacity-30 [background-image:radial-gradient(#C5C3D8_1.5px,transparent_1.5px)] [background-size:14px_14px]" />
          <div className="absolute bottom-[22%] right-[10%] h-24 w-24 opacity-30 [background-image:radial-gradient(#C5C3D8_1.5px,transparent_1.5px)] [background-size:14px_14px]" />
        </div>

        {/* Header */}
        <header className="relative z-10 flex items-center justify-between bg-card px-10 py-4 shadow-[0_1px_0_rgba(0,0,0,0.04)] xl:px-16">
          <img src={AppLogo} alt="TipTapp" className="h-10 w-auto object-contain" />
          {logoutButton("desktop")}
        </header>

        {/* Centered card */}
        <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-10">
          <div className="w-full max-w-[900px] rounded-[32px] bg-card px-12 py-14 pb-16 shadow-[0_24px_64px_rgba(30,27,75,0.10)] xl:px-20 xl:py-16 xl:pb-20">
            {/* Hero row — characters flank welcome text */}
            <div className="relative mx-auto max-w-[760px]">
              <div className="grid grid-cols-[150px_1fr_150px] items-center gap-4 xl:grid-cols-[175px_1fr_175px] xl:gap-6">
                {/* Tipper — left */}
                <div className="flex justify-center">
                  <div className="relative flex h-[155px] w-[155px] items-end justify-center overflow-hidden rounded-full bg-gradient-to-b from-[#E3F0FA] to-[#C8DFF2] shadow-[0_8px_24px_rgba(11,83,141,0.12)] xl:h-[175px] xl:w-[175px]">
                    <img
                      src={CharacterTipper}
                      alt="Tipper"
                      className="h-[115%] w-[115%] object-contain object-bottom"
                    />
                  </div>
                </div>

                {/* Center text */}
                <div className="flex flex-col items-center px-1 text-center xl:px-2">
                  <div className="mb-4 flex items-center justify-center">
                    <img src={AppLogo} alt="TipTapp" className="h-16 w-auto object-contain xl:h-20" />
                  </div>
                  <h1 className="poppins-semibold text-[38px] leading-none text-app xl:text-[42px] mt-[20px]">
                    {t("userSelection.welcome")}
                  </h1>
                  <p className="poppins-semibold mt-3 text-[17px] text-[#3B5BDB]">
                    {t("userSelection.chooseHowToContinue")}
                  </p>
                  <p className="poppins-regular mt-2.5 max-w-[360px] text-[14px] leading-relaxed text-[#8A8A8A]">
                    {t("userSelection.welcomeSubtitle")}
                  </p>
                </div>

                {/* Service Provider — right */}
                <div className="flex justify-center">
                  <div className="relative flex h-[155px] w-[155px] items-end justify-center overflow-hidden rounded-full bg-gradient-to-b from-[#FDE8EA] to-[#F5C8CC] shadow-[0_8px_24px_rgba(158,42,43,0.12)] xl:h-[175px] xl:w-[175px]">
                    <img
                      src={CharacterServiceProvider}
                      alt="Service Provider"
                      className="h-[115%] w-[115%] object-contain object-bottom"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* I am a divider */}
            <div className="mx-auto mb-10 mt-12 flex max-w-[620px] items-center gap-5">
              <div className="h-px flex-1 bg-[#E8E8E8]" />
              <span className="poppins-semibold whitespace-nowrap text-[15px] text-app">
                {t("userSelection.iAmA")}
              </span>
              <div className="h-px flex-1 bg-[#E8E8E8]" />
            </div>

            {/* Role buttons */}
            <div className="mx-auto mt-12 grid max-w-[820px] grid-cols-1 items-stretch gap-5 pb-2 md:grid-cols-[1fr_auto_1fr] md:gap-6">
              {/* Tipper */}
              <div className="group flex flex-col items-center gap-4">
                <button
                  type="button"
                  onClick={handleRouteTPHome}
                  className="relative flex h-[76px] w-full items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B538D] to-[#0E6FB8] px-5 text-white shadow-[0_12px_28px_rgba(11,83,141,0.28)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(11,83,141,0.38)] active:translate-y-0"
                >
                  <span className="absolute inset-0 bg-white/0 transition duration-300 group-hover:bg-white/5" />

                  <span className="relative flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-card/[0.18] shadow-inner backdrop-blur">
                      <User className="h-6 w-6" strokeWidth={2.2} />
                    </span>

                    <span className="flex flex-col items-start text-left">
                      <span className="poppins-semibold text-[17px] leading-tight">
                        {t("userSelection.tipper")}
                      </span>
                      <span className="poppins-regular mt-0.5 text-[12px] text-white/75">
                        {t("userSelection.tipperAction")}
                      </span>
                    </span>
                  </span>

                  <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-card/[0.16] transition-all duration-300 group-hover:translate-x-1 group-hover:bg-card/[0.24]">
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </button>

                <p className="poppins-regular max-w-[260px] text-center text-[13px] leading-relaxed text-[#8F8F8F]">
                  {t("userSelection.tipperActionDescription")}
                </p>
              </div>

              {/* OR */}
              <div className="flex items-start justify-center">
                <div className="flex items-center gap-3 md:h-[76px] md:flex-col">
                  <span className="h-px w-20 bg-[#E7E7E7] md:h-full md:w-px" />
                  <span className="poppins-medium flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#ECECEC] bg-card text-[11px] text-[#9A9A9A] shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
                    {t("userSelection.or")}
                  </span>
                  <span className="h-px w-20 bg-[#E7E7E7] md:h-full md:w-px" />
                </div>
              </div>

              {/* Service Provider */}
              <div className="group flex flex-col items-center gap-4">
                <button
                  type="button"
                  onClick={handleRouteSPHome}
                  className="relative flex h-[76px] w-full items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-r from-[#9E2A2B] to-[#D73535] px-5 text-white shadow-[0_12px_28px_rgba(158,42,43,0.28)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(158,42,43,0.38)] active:translate-y-0"
                >
                  <span className="absolute inset-0 bg-white/0 transition duration-300 group-hover:bg-white/5" />

                  <span className="relative flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-card/[0.18] shadow-inner backdrop-blur">
                      <Briefcase className="h-6 w-6" strokeWidth={2.2} />
                    </span>

                    <span className="flex flex-col items-start text-left">
                      <span className="poppins-semibold text-[17px] leading-tight">
                        {t("userSelection.serviceProvider")}
                      </span>
                      <span className="poppins-regular mt-0.5 text-[12px] text-white/75">
                        {t("userSelection.serviceProviderAction")}
                      </span>
                    </span>
                  </span>

                  <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-card/[0.16] transition-all duration-300 group-hover:translate-x-1 group-hover:bg-card/[0.24]">
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </button>

                <p className="poppins-regular max-w-[260px] text-center text-[13px] leading-relaxed text-[#8F8F8F]">
                  {t("userSelection.serviceProviderActionDescription")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog
        open={showLogoutConfirmation}
        onOpenChange={setShowLogoutConfirmation}
      >
        <AlertDialogContent className="z-[9999] w-full max-w-[350px] rounded-2xl md:max-w-[420px] lg:p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="poppins-semibold text-center text-[20px] leading-normal">
              {t("buttons.signOut")}
            </AlertDialogTitle>
            <AlertDialogDescription className="poppins-medium text-center text-[15px] text-black/60">
              {t("common.areYouSureSignOut")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <div className="mx-auto flex w-full flex-col items-center justify-center gap-4 pb-2 pt-6">
              <AlertDialogAction
                className="h-12 w-full max-w-[280px] rounded-10"
                onClick={handleConfirmLogout}
              >
                {t("common.yes")}
              </AlertDialogAction>
              <AlertDialogCancel className="h-12 w-full max-w-[280px] rounded-10 border border-black/20">
                {t("common.no")}
              </AlertDialogCancel>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserDeciderContainer;
