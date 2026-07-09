import { useState } from "react";
import StepCard from "@/components/molecules/common/how-it-works/StepCard";
import { PrimaryTypo } from "@/components/atoms/typo/primaryTypo";
import { howItWorks } from "@/utils/constants/HowItWorksData";
import { useTranslation } from "react-i18next";

const HowItWorksTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"web" | "mobile">("web");
  const { t } = useTranslation();

  {/* Color role handling */ }
  const role = typeof window !== "undefined" ? localStorage.getItem("userType") : null; // "tp" | "sp" | null

  const roleClassesButton =
    role === "tp"
      ? "bg-[#0B538D] hover:bg-[#0077B6] text-white"
      : role === "sp"
        ? "bg-[#9E2A2B] hover:bg-[#ce260b] text-white"
        : "";


  const TabButton = ({
    id,
    label,
    disabled,
  }: {
    id: "web" | "mobile";
    label: string;
    disabled?: boolean;
  }) => (

    <button
      role="tab"
      aria-selected={activeTab === id}
      aria-controls={`panel-${id}`}
      disabled={disabled}
      title={disabled ? t("howItWorks.comingSoon") : undefined}
      className={`px-20 py-10 rounded-md text-sm poppins-medium border ${activeTab === id ? `${roleClassesButton}` : "bg-white text-black"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      onClick={() => !disabled && setActiveTab(id)}
    >
      {label}
    </button>
  );

  const renderWeb = () => (
    <div id="panel-web" role="tabpanel" className="flex flex-col gap-30">
      <div className="flex flex-col gap-12">
        <PrimaryTypo
          typo={t("howItWorks.sections.tipper")}
          styles="text-[20px]"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
          {howItWorks.web.tipper.map((s, i) => (
            <StepCard
              key={i}
              step={i + 1}
              icon={s.icon}
              title={s.title}
              description={s.description}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-12">
        <PrimaryTypo
          typo={t("howItWorks.sections.serviceProvider")}
          styles="text-[20px]"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
          {howItWorks.web.serviceProvider.map((s, i) => (
            <StepCard
              key={i}
              step={i + 1}
              icon={s.icon}
              title={s.title}
              description={s.description}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-24">
      <div
        className="flex items-center gap-8"
        role="tablist"
        aria-label="How it works tabs"
      >
        <TabButton id="web" label={t("howItWorks.tabs.web")} />
        <TabButton id="mobile" label={t("howItWorks.tabs.mobile")} disabled />
      </div>
      {activeTab === "web" ? renderWeb() : null}
    </div>
  );
};

export default HowItWorksTabs;
