 
import {
  useGetBalanceTransfers,
  useGetWithdrawHistoryByServiceProvider,
} from "@/api/tipManagement";
import SpinLoader from "@/components/atoms/laoder/spin-loader";
import { PrimaryTypo } from "@/components/atoms/typo/primaryTypo";
import { useEffect, useRef, useState } from "react";
import NoDataFoundSection from "../../common/no-data-found/NoDataFoundSection";
import WithdrawHistoryCard from "@/components/atoms/cards/withdraw-history-card/withdrawHistoryCard";
import BalanceTransferHistoryCard from "@/components/atoms/cards/balance-transfer-history-card/balanceTransferHistoryCard";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "@/components/atoms/buttons/primaryButton";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

type HistoryTab = "withdraw" | "balanceTransfer";

const WithdrawHistoryCardSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<HistoryTab>("withdraw");
  const [isScrollable, setIsScrollable] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const withdrawQuery = useGetWithdrawHistoryByServiceProvider();
  const balanceTransferQuery = useGetBalanceTransfers();

  const activeQuery =
    activeTab === "withdraw" ? withdrawQuery : balanceTransferQuery;

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = activeQuery;

  useEffect(() => {
    if (containerRef.current) {
      setIsScrollable(
        containerRef.current.scrollHeight > containerRef.current.clientHeight
      );
    }
  }, [data, activeTab]);

  const totalItems =
    data?.pages.reduce((acc, page) => acc + page.items.length, 0) || 0;

  const tabs: { id: HistoryTab; label: string }[] = [
    { id: "withdraw", label: t("payments.withdrawTab") },
    { id: "balanceTransfer", label: t("payments.balanceTransferTab") },
  ];

  const handleBack = () => navigate(-1);

  return (
    <div className="mx-auto w-full max-w-[400px] sm:min-w-[400px]">
      <div className="mb-14 flex items-center justify-between">
        <PrimaryTypo
          typo={t("payments.withdrawHistory")}
          styles="!text-[20px] poppins-semibold"
        />
        <button
          onClick={handleBack}
          className="flex items-center gap-2 rounded-lg px-8 py-6 text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-800"
        >
          <FaArrowLeft className="text-sm" />
          <span className="text-sm poppins-medium">{t("buttons.back")}</span>
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl sm:border sm:border-[#d71921]/30 sm:bg-white sm:shadow-[0_4px_24px_0_rgba(158,42,43,0.12)]">
        <div
          className="border-b border-gray-100 bg-gradient-to-b from-[#fdf8f8] to-white px-12 py-14 sm:px-16"
          role="tablist"
          aria-label={t("payments.withdrawHistory")}
        >
          <div className="flex rounded-full bg-gray-100/90 p-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                className={`flex-1 rounded-full px-10 py-9 text-[13px] poppins-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-white text-[#9E2A2B] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div
          ref={containerRef}
          id={`panel-${activeTab}`}
          role="tabpanel"
          className={`min-h-[560px] max-h-[560px] overflow-y-auto overflow-x-hidden secondary-scrollabr px-12 py-16 sm:px-16 ${
            isLoading ? "flex items-center justify-center" : ""
          }`}
        >
          {isLoading ? (
            <SpinLoader isLoading={isLoading} />
          ) : isError ? (
            <div className="flex flex-col items-center justify-center gap-16 py-40">
              <PrimaryTypo
                typo={
                  activeTab === "withdraw"
                    ? t("payments.withdrawHistoryError")
                    : t("payments.balanceTransferHistoryError")
                }
                styles="text-center !text-[15px] text-gray-600"
              />
              <PrimaryButton
                typo={t("payments.retry")}
                styles="max-w-[200px] w-full !rounded-8 bg-[#9E2A2B] hover:bg-[#ce260b]"
                handleOnClick={() => void refetch()}
              />
            </div>
          ) : totalItems === 0 ? (
            <div className="flex h-full min-h-[400px] items-center justify-center">
              <NoDataFoundSection />
            </div>
          ) : activeTab === "withdraw" ? (
            <WithdrawHistoryCard
              data={data}
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              isScrollable={isScrollable}
            />
          ) : (
            <BalanceTransferHistoryCard
              data={data}
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              isScrollable={isScrollable}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default WithdrawHistoryCardSection;
