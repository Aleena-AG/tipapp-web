import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  serviceProviderSteps,
  tipperSteps,
  type HowItWorksInteractiveStep,
  type HowItWorksStepId,
} from "@/utils/constants/HowItWorksData";

const StepButton = ({
  step,
  active,
  align,
  onSelect,
}: {
  step: HowItWorksInteractiveStep;
  active: boolean;
  align: "left" | "right";
  onSelect: (id: HowItWorksStepId) => void;
}) => {
  const { t } = useTranslation();
  const Icon = step.Icon;
  const isSp = align === "left";

  return (
    <button
      type="button"
      onClick={() => onSelect(step.id)}
      className={`group flex w-full items-center gap-12 ${
        align === "left"
          ? "justify-center text-right lg:justify-between"
          : "justify-center text-left lg:justify-between"
      }`}
    >
      {align === "left" && (
        <span
          className={`hidden rounded-full px-16 py-10 text-center text-[15px] transition-all lg:block lg:flex-1 poppins-semibold ${
            active
              ? "bg-gradient-to-br from-[#0B538D]/25 to-[#d71921]/20 text-[#0B2C4A] shadow-[0_0_20px_rgba(11,83,141,0.25)] dark:from-[#2563EB]/35 dark:to-[#F87171]/25 dark:text-white dark:shadow-[0_0_20px_rgba(59,130,246,0.35)]"
              : "bg-[#0B538D]/8 text-[#6F7682] group-hover:text-[#0B2C4A] dark:bg-white/5 dark:text-slate-400 dark:group-hover:text-slate-200"
          }`}
        >
          {t(`howItWorks.steps.${step.labelKey}`)}
        </span>
      )}

      <div
        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-lg transition-all ${
          active
            ? isSp
              ? "scale-110 bg-[#9E2A2B] text-white shadow-[0_0_28px_rgba(158,42,43,0.45)]"
              : "scale-110 bg-[#0B538D] text-white shadow-[0_0_28px_rgba(11,83,141,0.45)] dark:bg-[#2563EB] dark:shadow-[0_0_28px_rgba(37,99,235,0.5)]"
            : isSp
              ? "bg-[#9E2A2B]/20 text-[#9E2A2B] hover:bg-[#9E2A2B]/35 dark:bg-[#d71921]/25 dark:text-[#FCA5A5]"
              : "bg-[#0B538D]/20 text-[#0B538D] hover:bg-[#0B538D]/35 dark:bg-[#2563EB]/25 dark:text-[#93C5FD]"
        }`}
      >
        {Icon ? (
          <Icon className="h-6 w-6" strokeWidth={2.2} />
        ) : (
          <span className="poppins-bold">{step.id}</span>
        )}
      </div>

      {align === "right" && (
        <span
          className={`hidden rounded-full px-16 py-10 text-center text-[15px] transition-all lg:block lg:flex-1 poppins-semibold ${
            active
              ? "bg-gradient-to-br from-[#0B538D]/25 to-[#3A7CFD]/20 text-[#0B2C4A] shadow-[0_0_20px_rgba(11,83,141,0.25)] dark:from-[#2563EB]/35 dark:to-[#60A5FA]/25 dark:text-white dark:shadow-[0_0_20px_rgba(59,130,246,0.35)]"
              : "bg-[#0B538D]/8 text-[#6F7682] group-hover:text-[#0B2C4A] dark:bg-white/5 dark:text-slate-400 dark:group-hover:text-slate-200"
          }`}
        >
          {t(`howItWorks.steps.${step.labelKey}`)}
        </span>
      )}
    </button>
  );
};

const PhonePreview = ({
  activeStep,
  imageSrc,
}: {
  activeStep: HowItWorksStepId | null;
  imageSrc?: string;
}) => {
  const { t } = useTranslation();
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [activeStep, imageSrc]);

  const showImage = Boolean(imageSrc) && !imgFailed && activeStep !== null;

  return (
    <div className="relative w-full max-w-[240px]">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#0B538D] to-[#d71921] opacity-20 blur-2xl dark:from-[#2563EB] dark:to-[#F87171]" />

      <div
        className="relative w-full overflow-hidden rounded-3xl border-8 border-[#1e293b] bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl dark:border-slate-600"
        style={{ aspectRatio: "375 / 813", maxHeight: "520px" }}
      >
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900">
          {showImage ? (
            <img
              key={activeStep}
              src={imageSrc}
              alt={t("howItWorks.previewAlt", { step: activeStep })}
              onError={() => setImgFailed(true)}
              className="ta-animate-pop h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-[160px] w-full items-center justify-center bg-gradient-to-b from-[#0B538D]/40 to-slate-900/60 p-16 text-center backdrop-blur-sm dark:from-[#2563EB]/30">
              <p className="poppins-medium text-[14px] leading-relaxed text-white">
                {activeStep
                  ? t("howItWorks.imageComingSoon")
                  : t("howItWorks.clickForPreview")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const HowItWorksTabs = () => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState<HowItWorksStepId | null>(null);

  const allSteps = [...serviceProviderSteps, ...tipperSteps];
  const activeImage = allSteps.find((s) => s.id === activeStep)?.image;

  const handleSelect = (id: HowItWorksStepId) => {
    setActiveStep((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex h-full gap-12 md:gap-24 lg:grid lg:grid-cols-3">
      {/* Service Provider */}
      <div className="flex w-[95px] flex-shrink-0 flex-col space-y-20 lg:w-full">
        <h3 className="w-full text-center text-lg font-bold md:text-2xl lg:mb-8 lg:text-3xl">
          <span className="bg-gradient-to-r from-[#9E2A2B] to-[#0B2C4A] bg-clip-text text-transparent dark:from-[#F87171] dark:to-white">
            {t("userSelection.serviceProvider")}
          </span>
        </h3>

        <div className="flex h-[300px] flex-1 flex-col items-center justify-between sm:h-[520px]">
          {serviceProviderSteps.map((step) => (
            <StepButton
              key={step.id}
              step={step}
              active={activeStep === step.id}
              align="left"
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>

      {/* Phone mockup */}
      <div className="flex flex-1 items-center justify-center py-16 lg:py-0">
        <PhonePreview activeStep={activeStep} imageSrc={activeImage} />
      </div>

      {/* Tipper */}
      <div className="flex w-[95px] flex-shrink-0 flex-col space-y-20 lg:w-full">
        <h3 className="w-full text-center text-lg font-bold md:text-2xl lg:mb-8 lg:text-3xl">
          <span className="bg-gradient-to-r from-[#0B538D] to-[#0B2C4A] bg-clip-text text-transparent dark:from-[#60A5FA] dark:to-white">
            {t("userSelection.tipper")}
          </span>
        </h3>

        <div className="flex h-[300px] flex-1 flex-col items-center justify-between sm:h-[520px]">
          {tipperSteps.map((step) => (
            <StepButton
              key={step.id}
              step={step}
              active={activeStep === step.id}
              align="right"
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorksTabs;
