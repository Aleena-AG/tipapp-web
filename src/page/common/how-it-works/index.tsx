import { PrimaryTypo } from "@/components/atoms/typo/primaryTypo";
import HowItWorksTabs from "@/components/organisms/common/how-it-works/HowItWorksTabs";
import { useTranslation } from "react-i18next";

const HowItWorksPage = () => {
  const { t } = useTranslation();

  {/* Color role handling */ }
  const role = typeof window !== "undefined" ? localStorage.getItem("userType") : null; // "tp" | "sp" | null
  const roleClassesBorder =
    role === "tp"
      ? "sm:border sm:border-[#0B538D] sm:shadow-[0_0_15px_0_rgba(11,83,141,0.5)]"
      : role === "sp"
        ? "sm:border sm:border-[#d71921] sm:shadow-[0_0_15px_0_rgba(215,25,33,0.5)]"
        : "";

  return (
    <div className="bg-primary-hex min-h-screen pt-65 pb-90">
      <div className="max-w-[980px] mx-auto px-20 sm:px-0">
        <div className={`sm:bg-white rounded-2xl p-24 flex flex-col gap-16 ${roleClassesBorder}`}>
          <div className="text-center flex flex-col gap-8">
            <PrimaryTypo
              typo={t("howItWorks.title")}
              styles="!text-[28px] sm:text-[22px]"
            />
            <div className="text-[#000] opacity-60 text-[14px] leading-[22px] poppins-regular max-w-[720px] mx-auto">
              {t("howItWorks.subtitle")}
            </div>
          </div>
          <HowItWorksTabs />
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;
