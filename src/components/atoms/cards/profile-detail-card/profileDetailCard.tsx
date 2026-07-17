import { useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  title: string;
  detail: string;
  size?: "long" | "short";
  maxLength?: number;
}

export const ProfileDetailCard = (props: Props) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = props.maxLength || props.detail.length;
  const isEmpty =
    !props.detail?.trim() || props.detail === "Not provided yet";

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const renderText = () => {
    if (isEmpty) {
      return "—";
    }

    if (props.detail.length <= maxLength) {
      return props.detail;
    }

    if (isExpanded) {
      return (
        <>
          {props.detail}
          <button
            type="button"
            className="ml-3 cursor-pointer text-[#0B538D] hover:underline dark:text-[#93C5FD]"
            onClick={toggleExpand}
          >
            {t("common.showLess")}
          </button>
        </>
      );
    }

    return (
      <span>
        {props.detail.slice(0, maxLength)}...
        <button
          type="button"
          className="ml-2 cursor-pointer text-[#0B538D] hover:underline dark:text-[#93C5FD]"
          onClick={toggleExpand}
        >
          {t("common.seeMore")}
        </button>
      </span>
    );
  };

  return (
    <div
      className={`flex flex-col gap-4 rounded-[12px] border border-[#E4EAF2] bg-[#F8FAFC] px-14 py-12 dark:border-white/10 dark:bg-[#121e36] ${
        props.size === "short" ? "sm:max-w-none" : ""
      } ${props.size === "long" ? "w-full max-w-full" : ""}`}
    >
      <div className="poppins-medium text-[11px] uppercase tracking-[0.06em] text-[#7A8A9A] sm:text-[12px] dark:text-slate-400">
        {props.title}
      </div>
      <div
        className={`poppins-semibold break-words text-[13px] leading-snug sm:text-[14px] ${
          isEmpty
            ? "text-[#A0AEC0] dark:text-slate-500"
            : "text-[#0B2C4A] dark:text-white"
        }`}
      >
        {renderText()}
      </div>
    </div>
  );
};
