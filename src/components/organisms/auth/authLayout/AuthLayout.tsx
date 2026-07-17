import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ShieldCheck, Zap, QrCode } from "lucide-react";
import AuthIllustration from "@/assets/images/auth-illustration.png";
import AppLogo from "@/assets/images/appLogo.png";
import ThemeToggle from "@/components/molecules/common/ThemeToggle";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const { t } = useTranslation();

  const features = [
    {
      icon: ShieldCheck,
      label: t("auth.featureSecure"),
      description: t("auth.featureSecureDesc"),
      accent: "bg-[#9E2A2B]/10 text-[#9E2A2B]",
    },
    {
      icon: Zap,
      label: t("auth.featureFast"),
      description: t("auth.featureFastDesc"),
      accent: "bg-[#0B538D]/10 text-[#0B538D]",
    },
    {
      icon: QrCode,
      label: t("auth.featureCashless"),
      description: t("auth.featureCashlessDesc"),
      accent: "bg-[#7c3aed]/10 text-[#7c3aed]",
    },
  ];

  return (
    <div className="relative w-full flex flex-col lg:flex-row flex-1 min-h-screen">
      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>
      {/* LEFT — illustration / branding (desktop only) */}
      <aside className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#FFF5F5] via-[#FAF7FF] to-[#F0EEFF] dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 items-center justify-center p-14 xl:p-20 min-h-screen">
        <div className="absolute top-20 left-20 w-48 h-48 rounded-full bg-[#9E2A2B]/8 blur-3xl" />
        <div className="absolute bottom-16 right-20 w-64 h-64 rounded-full bg-[#7c3aed]/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-card/40 blur-2xl" />

        <div className="relative z-10 w-full max-w-[520px] flex flex-col items-center text-center">
          <img
            src={AuthIllustration}
            alt="Scan, tip and receive with TipTapp"
            className="w-full max-w-[440px] drop-shadow-[0_30px_50px_rgba(158,42,43,0.12)]"
          />

          <p className="mt-8 poppins-semibold tracking-[0.22em] text-[#9E2A2B] text-xs uppercase">
            {t("auth.brandTagline")}
          </p>

          <p className="mt-4 poppins-regular text-app-muted text-[15px] leading-relaxed max-w-[400px]">
            {t("auth.brandDescription")}
          </p>

          <div className="mt-10 w-full flex flex-col gap-3">
            {features.map(({ icon: Icon, label, description, accent }) => (
              <div
                key={label}
                className="flex items-start gap-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/60 px-5 py-4 text-left shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(158,42,43,0.08)] hover:-translate-y-0.5 dark:bg-slate-800/80 dark:border-slate-700"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accent}`}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.25} />
                </div>
                <div className="min-w-0 pt-0.5">
                  <p className="poppins-semibold text-app dark:text-white text-sm leading-none">
                    {label}
                  </p>
                  <p className="mt-1.5 poppins-regular text-[#6F6F6F] dark:text-slate-400 text-[13px] leading-snug">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* RIGHT — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-background px-6 sm:px-10 py-10 sm:py-12 min-h-screen overflow-y-auto">
        <div className="w-full max-w-[400px] my-auto py-4">
          <div className="flex justify-center mb-6 sm:mb-8">
            <img
              src={AppLogo}
              alt="TipTapp"
              className="h-14 sm:h-16 w-auto object-contain"
            />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
