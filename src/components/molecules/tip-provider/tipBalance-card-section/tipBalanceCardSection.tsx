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
            styles="text-center !text-[20px]"
          />
          <button
            onClick={handleBack}
            className="flex items-center gap-2 rounded-lg px-8 py-6 text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-800"
          >
            <FaArrowLeft className="text-sm" />
            <span className="text-sm poppins-medium">{t("buttons.back")}</span>
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[527px] overflow-hidden rounded-2xl sm:border sm:border-[#d71921]/25 sm:bg-white sm:shadow-[0_4px_20px_rgba(158,42,43,0.08)]">
        <div className="flex items-center justify-center gap-8 border-b border-gray-100 bg-[#fdf8f8] px-16 py-14">
          <p className="text-[13px] poppins-medium text-gray-600">
            {t("payments.accountOverview")}
          </p>
          <span className="rounded-full bg-white px-10 py-3 text-[10px] poppins-semibold uppercase tracking-wide text-[#9E2A2B] ring-1 ring-[#9E2A2B]/20">
            {currency}
          </span>
        </div>

        <div className="bg-white px-14 py-14 sm:px-16 sm:py-16">
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
