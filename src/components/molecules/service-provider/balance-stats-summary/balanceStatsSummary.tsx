import BounceLoader from "react-spinners/ClipLoader";
import { formatNumber } from "@/hooks/formatters";
import { useTranslation } from "react-i18next";
import { FaWallet, FaChartLine } from "react-icons/fa";

interface Props {
  balance?: number;
  totalEarned?: number;
  isLoading?: boolean;
  currency?: string;
  variant?: "compact" | "card";
  showTotalEarned?: boolean;
}

function getCurrencySymbol(currency?: string): string {
  switch ((currency || "GBP").toUpperCase()) {
    case "GBP":
      return "£";
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "AED":
      return "AED";
    default:
      return "£";
  }
}

interface StatItemProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  isLoading: boolean;
  currencySymbol: string;
}

const StatItem = ({
  label,
  value,
  icon,
  isLoading,
  currencySymbol,
}: StatItemProps) => {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-10 rounded-[12px] border border-border bg-card px-12 py-11 dark:border-white/10 dark:bg-[#121e36]">
      <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#F9EBEB] text-[12px] text-[#8B1A1A] dark:bg-[#9E2A2B]/30 dark:text-[#FCA5A5]">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="poppins-regular text-[11px] leading-tight text-[#707070] sm:text-[12px] dark:text-slate-400">
          {label}
        </p>

        {isLoading ? (
          <div className="mt-4 flex">
            <BounceLoader color="#8B1A1A" loading size={14} />
          </div>
        ) : (
          <p className="mt-3 whitespace-nowrap text-[17px] poppins-semibold leading-tight text-[#8B1A1A] sm:text-[18px] dark:text-[#FCA5A5]">
            {currencySymbol}&nbsp;{formatNumber(value, false)}
          </p>
        )}
      </div>
    </div>
  );
};

const BalanceStatsSummary = ({
  balance = 0,
  totalEarned = 0,
  isLoading = false,
  currency = "GBP",
  variant = "compact",
  showTotalEarned = true,
}: Props) => {
  const { t } = useTranslation();
  const currencySymbol = getCurrencySymbol(currency);

  return (
    <div className="w-full">
      <div
        className={`flex w-full gap-8 ${
          showTotalEarned
            ? variant === "card"
              ? "flex-col sm:flex-row sm:gap-10"
              : "flex-row"
            : ""
        }`}
      >
        <StatItem
          label={t("payments.totalBalance")}
          value={balance}
          icon={<FaWallet />}
          isLoading={isLoading}
          currencySymbol={currencySymbol}
        />
        {showTotalEarned && (
          <StatItem
            label={t("payments.totalEarned")}
            value={totalEarned}
            icon={<FaChartLine />}
            isLoading={isLoading}
            currencySymbol={currencySymbol}
          />
        )}
      </div>
    </div>
  );
};

export default BalanceStatsSummary;
