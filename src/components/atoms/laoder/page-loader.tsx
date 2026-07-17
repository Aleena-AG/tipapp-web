import { useTranslation } from "react-i18next";
import Logo from "@/assets/images/appLogo.png";
import { PageAmbientBackground } from "@/components/molecules/common/PageAmbientBackground";

interface PageLoaderProps {
  message?: string;
}

const PageLoader = ({ message }: PageLoaderProps) => {
  const { t } = useTranslation();
  const userType =
    typeof window !== "undefined" ? localStorage.getItem("userType") : null;
  const isTipper = userType === "tp";
  const accent = isTipper ? "#0B538D" : "#9E2A2B";

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-app-atmosphere px-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <PageAmbientBackground />

      <div className="relative z-10 flex flex-col items-center ta-animate-fade">
        {/* Soft brand glow behind logo */}
        <div
          className="pointer-events-none absolute left-1/2 top-8 h-28 w-28 -translate-x-1/2 rounded-full blur-3xl ta-glow-pulse"
          style={{
            backgroundColor: isTipper
              ? "rgba(11, 83, 141, 0.35)"
              : "rgba(158, 42, 43, 0.32)",
          }}
          aria-hidden
        />

        <img
          src={Logo}
          alt="Tip App"
          className="relative h-[68px] w-[68px] object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.28)] ta-float sm:h-[76px] sm:w-[76px]"
        />

        {/* Dual-tone ring spinner */}
        <div className="relative mt-10 h-11 w-11" aria-hidden>
          <div className="absolute inset-0 rounded-full border-[2.5px] border-black/[0.08] dark:border-white/10" />
          <div
            className="absolute inset-0 rounded-full border-[2.5px] border-transparent ta-loader-spin"
            style={{
              borderTopColor: accent,
              borderRightColor: accent,
            }}
          />
        </div>

        <p className="mt-7 poppins-medium text-center text-[13px] tracking-[0.04em] text-app-muted ta-animate-fade ta-delay-2">
          {message ?? t("common.loading")}
        </p>
      </div>
    </div>
  );
};

export default PageLoader;
