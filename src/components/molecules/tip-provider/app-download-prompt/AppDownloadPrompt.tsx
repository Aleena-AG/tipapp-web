import serviceProviderArt from "@/assets/images/sp-char.png";
import { APP_STORE_URL } from "@/utils/constants/FooterData";
import { Briefcase, Download, HandCoins, LayoutGrid, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const FEATURES = [
  {
    icon: HandCoins,
    titleKey: "payments.appPrompt.sendReceive",
    descKey: "payments.appPrompt.sendReceiveDesc",
  },
  {
    icon: Briefcase,
    titleKey: "payments.appPrompt.becomeProvider",
    descKey: "payments.appPrompt.becomeProviderDesc",
  },
  {
    icon: LayoutGrid,
    titleKey: "payments.appPrompt.explore",
    descKey: "payments.appPrompt.exploreDesc",
  },
] as const;

const AppDownloadPrompt = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1B2B]/50 px-16 py-24 dark:bg-black/70"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="app-download-prompt-title"
        className="relative w-full max-w-[420px] rounded-[28px] border border-[#E8EEF4] bg-white px-22 pb-22 pt-28 shadow-[0_24px_64px_rgba(11,83,141,0.22)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label={t("payments.appPrompt.close")}
          className="absolute right-16 top-16 flex h-[32px] w-[32px] items-center justify-center rounded-full text-[#5B6475] transition-colors hover:bg-[#EAF3FA] hover:text-[#0B538D]"
        >
          <X className="h-[18px] w-[18px]" />
        </button>

        <div className="flex flex-col items-center text-center">
          <img
            src={serviceProviderArt}
            alt=""
            className="h-[132px] w-[132px] object-contain"
          />

          <h2
            id="app-download-prompt-title"
            className="poppins-semibold mt-16 text-[22px] leading-tight text-[#0B538D]"
          >
            {t("payments.appPrompt.title")}
          </h2>
          <p className="poppins-regular mt-8 max-w-[320px] text-[14px] leading-relaxed text-[#5B6475]">
            {t("payments.appPrompt.subtitle")}
          </p>
        </div>

        <ul className="mt-22 flex flex-col gap-14">
          {FEATURES.map(({ icon: Icon, titleKey, descKey }) => (
            <li key={titleKey} className="flex items-start gap-12 text-start">
              <span className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[12px] bg-[#0B538D] text-white">
                <Icon className="h-[20px] w-[20px]" strokeWidth={1.75} />
              </span>
              <span className="min-w-0 pt-2">
                <span className="poppins-semibold block text-[15px] leading-tight text-[#1A1A2E]">
                  {t(titleKey)}
                </span>
                <span className="poppins-regular mt-2 block text-[13px] leading-snug text-[#5B6475]">
                  {t(descKey)}
                </span>
              </span>
            </li>
          ))}
        </ul>

        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noreferrer"
          className="poppins-semibold mt-24 flex h-[50px] w-full items-center justify-center gap-8 rounded-full bg-[#0B538D] text-[15px] text-white shadow-[0_8px_20px_rgba(11,83,141,0.28)] transition-colors hover:bg-[#0077B6] active:scale-[0.98]"
        >
          <Download className="h-[18px] w-[18px]" />
          {t("payments.appPrompt.getApp")}
        </a>

        <button
          type="button"
          onClick={() => setOpen(false)}
          className="poppins-medium mt-14 w-full text-center text-[15px] text-[#5B6475] transition-colors hover:text-[#0B538D]"
        >
          {t("payments.appPrompt.maybeLater")}
        </button>
      </div>
    </div>
  );
};

export default AppDownloadPrompt;
