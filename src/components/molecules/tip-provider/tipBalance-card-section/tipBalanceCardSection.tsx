import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { PrimaryTypo } from "@/components/atoms/typo/primaryTypo";
import { useTranslation } from "react-i18next";
import BalanceStatsSummary from "@/components/molecules/service-provider/balance-stats-summary/balanceStatsSummary";

interface Props {
  TotalTips: number | undefined;
  isLoading: boolean;
  currency?: string;
}

const TipBalanceCardSection = (props: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const currency = props.currency || "GBP";

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="mb-26">
      <div className="mx-auto mb-12 flex max-w-[527px] items-start justify-center sm:justify-start">
        <div className="flex w-full items-center justify-between">
          <PrimaryTypo
            typo={t("payments.tipBalance")}
            styles="text-center !text-[20px] dark:!text-white"
          />
          <button
            onClick={handleBack}
            className="flex items-center gap-2 rounded-lg px-8 py-6 text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-800 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <FaArrowLeft className="text-sm" />
            <span className="text-sm poppins-medium">{t("buttons.back")}</span>
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[527px] overflow-hidden rounded-2xl sm:border sm:border-[#d71921]/25 sm:bg-card sm:shadow-[0_4px_20px_rgba(158,42,43,0.08)] dark:sm:border-[#d71921]/40 dark:sm:bg-[#0a1629]/95 dark:sm:shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-center gap-8 border-b border-gray-100 bg-[#fdf8f8] px-16 py-14 dark:border-white/10 dark:bg-[#121e36]">
          <p className="text-[13px] poppins-medium text-gray-600 dark:text-slate-300">
            {t("payments.accountOverview")}
          </p>
          <span className="rounded-full bg-card px-10 py-3 text-[10px] poppins-semibold uppercase tracking-wide text-[#9E2A2B] ring-1 ring-[#9E2A2B]/20 dark:bg-[#0a1629] dark:text-[#FCA5A5] dark:ring-[#E8B923]/35">
            {currency}
          </span>
        </div>

        <div className="bg-app-surface px-14 py-14 sm:px-16 sm:py-16 dark:bg-[#0a1629]/60">
          <BalanceStatsSummary
            balance={props.TotalTips}
            isLoading={props.isLoading}
            currency={currency}
            variant="card"
            showTotalEarned={false}
          />
        </div>
      </div>
    </div>
  );
};

export default TipBalanceCardSection;
