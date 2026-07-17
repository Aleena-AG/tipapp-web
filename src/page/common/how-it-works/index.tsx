import HowItWorksTabs from "@/components/organisms/common/how-it-works/HowItWorksTabs";
import { PageAmbientBackground } from "@/components/molecules/common/PageAmbientBackground";
import { useTranslation } from "react-i18next";

const HowItWorksPage = () => {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen overflow-hidden bg-app-atmosphere pb-80 pt-[88px] lg:pt-32">
      <PageAmbientBackground />

      {/* Soft accent glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[12%] top-[28%] h-[180px] w-[180px] rounded-full bg-[#0B538D]/10 blur-[60px] dark:bg-[#3B82F6]/15" />
        <div className="absolute right-[14%] top-[40%] h-[200px] w-[200px] rounded-full bg-[#d71921]/8 blur-[70px] dark:bg-[#F87171]/12" />
        <div className="absolute bottom-[18%] left-1/2 h-[160px] w-[320px] -translate-x-1/2 rounded-full bg-[#0B538D]/8 blur-[80px] dark:bg-[#2563EB]/12" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-28 px-16 py-28 sm:gap-36 sm:px-32 lg:px-48">
        <header className="flex flex-col items-center gap-12 text-center">
          <h1 className="poppins-semibold text-[32px] leading-none tracking-tight text-[#0B2C4A] sm:text-[40px] lg:text-[48px] dark:text-white">
            {t("howItWorks.titlePrefix")}{" "}
            <span className="text-[#0B538D] dark:text-[#60A5FA]">
              {t("howItWorks.brandTip")}
            </span>
            <span className="text-[#d71921]">{t("howItWorks.brandApp")}</span>{" "}
            {t("howItWorks.titleSuffix")}
          </h1>
          <p className="poppins-regular max-w-[520px] text-[14px] leading-relaxed text-[#6F7682] sm:text-[15px] dark:text-slate-400">
            {t("howItWorks.subtitle")}
          </p>
        </header>

        <HowItWorksTabs />
      </div>
    </div>
  );
};

export default HowItWorksPage;
