 
import { useState, useEffect, useRef, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useGetTipHistoryDetailsByTipper } from "@/api/tipManagement";
import TipRecievedCard from "@/components/atoms/cards/tip-recieved-card/tipRecievedCard";
import SpinLoader from "@/components/atoms/laoder/spin-loader";
import NoDataFoundSection from "../../common/no-data-found/NoDataFoundSection";
import { useTranslation } from "react-i18next";
import { formatNumber } from "@/hooks/formatters";
import { CurrencyContext } from "@/App";
import { TrendingUp, Users, ChevronRight, Wallet } from "lucide-react";
import TipSendMascot from "@/assets/images/tp-send.png";
import { handleScrollTop } from "@/hooks/hooks";

const ViewHistoryCardSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currency } = useContext(CurrencyContext);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetTipHistoryDetailsByTipper();
  const [isScrollable, setIsScrollable] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const allItems = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data]
  );

  const totalItems = allItems.length;

  const totalAmount = useMemo(
    () =>
      allItems.reduce(
        (sum, tip) => sum + parseFloat(tip.Amount || tip.amount || "0"),
        0
      ),
    [allItems]
  );

  const tipsThisMonth = useMemo(
    () =>
      allItems
        .filter((tip) => {
          const d = new Date(tip.TipDate || tip.date || tip.createdAt);
          const now = new Date();
          return (
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear()
          );
        })
        .reduce(
          (s, tip) => s + parseFloat(tip.Amount || tip.amount || "0"),
          0
        ),
    [allItems]
  );

  useEffect(() => {
    if (containerRef.current) {
      setIsScrollable(
        containerRef.current.scrollHeight > containerRef.current.clientHeight
      );
    }
  }, [data]);

  const handleBack = () => navigate(-1);

  const goToScanner = () => {
    handleScrollTop();
    navigate("/tip-provider");
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-24 flex items-center gap-12">
        <button
          onClick={handleBack}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E4EDF5] bg-card text-[#0B538D] shadow-sm transition-colors hover:bg-[#EAF3FA]"
          aria-label={t("buttons.back")}
        >
          <FaArrowLeft className="text-[14px]" />
        </button>
        <div>
          <h1 className="poppins-semibold text-[22px] text-[#0B538D] sm:text-[26px]">
            {t("common.totalTipsGiven")}
          </h1>
          <p className="poppins-regular mt-2 text-[13px] text-[#7A7A7A] dark:text-slate-400">
            {t("common.viewYourPastTips")}
          </p>
        </div>
      </div>

      {/* Stats + CTA row — full width */}
      {!isLoading && totalItems > 0 && (
        <div className="mb-20 grid grid-cols-2 gap-12 sm:mb-24 sm:grid-cols-4 sm:gap-16">
          <div className="col-span-2 flex items-center gap-16 rounded-[14px] bg-[#0B538D] p-16 shadow-[0_6px_20px_rgba(11,83,141,0.2)] sm:col-span-1 sm:block sm:p-20">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#3D7DB5] sm:h-9 sm:w-9">
              <Wallet className="h-5 w-5 text-white sm:h-4 sm:w-4" />
            </span>
            <div className="sm:mt-12">
              <p className="poppins-medium text-[12px] text-white/75 sm:text-[11px]">
                {t("common.totalTipsGiven")}
              </p>
              <p className="poppins-semibold mt-2 text-[20px] text-white sm:mt-4 sm:text-[20px]">
                {currency}&nbsp;{formatNumber(totalAmount)}
              </p>
            </div>
          </div>
          <div className="rounded-[14px] border border-[#E4EDF5] bg-card p-16 shadow-sm sm:p-20">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF3FA]">
              <Users className="h-4 w-4 text-[#0B538D]" />
            </span>
            <p className="poppins-medium mt-12 text-[11px] text-[#7A7A7A] dark:text-slate-400">
              Total Transactions
            </p>
            <p className="poppins-semibold mt-4 text-[18px] text-app sm:text-[20px]">
              {totalItems}
            </p>
          </div>
          <div className="rounded-[14px] border border-[#E4EDF5] bg-card p-16 shadow-sm sm:p-20">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF3FA]">
              <TrendingUp className="h-4 w-4 text-[#0B538D]" />
            </span>
            <p className="poppins-medium mt-12 text-[11px] text-[#7A7A7A] dark:text-slate-400">
              {t("common.tipsThisMonth")}
            </p>
            <p className="poppins-semibold mt-4 text-[18px] text-app sm:text-[20px]">
              {currency}&nbsp;{formatNumber(tipsThisMonth)}
            </p>
          </div>
          {/* Ready to Tip — desktop only (mobile uses fixed bottom bar) */}
          <button
            type="button"
            onClick={goToScanner}
            className="group relative hidden overflow-hidden rounded-[14px] bg-gradient-to-r from-[#0B538D] to-[#0077B6] p-20 text-left shadow-[0_6px_20px_rgba(11,83,141,0.25)] transition-all hover:shadow-[0_10px_28px_rgba(11,83,141,0.35)] sm:block"
          >
            <div className="relative z-[1] flex h-full items-center justify-between gap-12">
              <div>
                <p className="poppins-semibold text-[14px] text-white">
                  {t("common.readyToTip")}
                </p>
                <p className="poppins-regular mt-2 text-[11px] text-white/75">
                  {t("common.scanQRCode")}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-white/80 transition-transform group-hover:translate-x-0.5" />
            </div>
            <img
              src={TipSendMascot}
              alt=""
              className="pointer-events-none absolute -bottom-2 -right-2 h-[80px] w-auto object-contain opacity-90 sm:h-[90px]"
            />
          </button>
        </div>
      )}

      {/* Table — full width, flat */}
      <div className="overflow-hidden rounded-[12px] border border-[#E0E8F0] bg-card dark:border-slate-700">
        {!isLoading && totalItems > 0 && (
          <div className="hidden border-b border-[#0B538D]/20 bg-[#0B538D] px-24 py-14 lg:grid lg:grid-cols-[2fr_1fr_1fr_1.2fr] lg:gap-24">
            <span className="poppins-semibold text-[11px] uppercase tracking-wider text-white/90">
              Service Provider
            </span>
            <span className="poppins-semibold text-[11px] uppercase tracking-wider text-white/90">
              Date
            </span>
            <span className="poppins-semibold text-right text-[11px] uppercase tracking-wider text-white/90">
              Amount
            </span>
            <span className="poppins-semibold text-right text-[11px] uppercase tracking-wider text-white/90">
              Method
            </span>
          </div>
        )}

        <div
          id="tip-history-scroll"
          ref={containerRef}
          className={`themed-scroll overflow-x-hidden ${
            isLoading || totalItems === 0
              ? "flex min-h-[400px] items-center justify-center"
              : "max-h-[calc(100vh-340px)] min-h-[360px] overflow-y-auto"
          }`}
        >
          {isLoading ? (
            <SpinLoader isLoading={isLoading} />
          ) : totalItems === 0 ? (
            <div className="flex w-full flex-col items-center gap-24 px-24 py-48">
              <NoDataFoundSection />
              <button
                type="button"
                onClick={goToScanner}
                className="flex items-center gap-8 rounded-[12px] bg-[#0B538D] px-24 py-12 text-white shadow-md transition-colors hover:bg-[#0077B6]"
              >
                <span className="poppins-medium text-[14px]">
                  {t("common.scanQRCode")}
                </span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <TipRecievedCard
              data={data}
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              isScrollable={isScrollable}
              scrollableTarget="tip-history-scroll"
            />
          )}
        </div>
      </div>

      {/* Mobile fixed CTA */}
      <button
        type="button"
        onClick={goToScanner}
        className="fixed bottom-6 left-4 right-4 z-20 flex items-center justify-between rounded-[14px] bg-[#0B538D] px-20 py-14 shadow-lg active:scale-[0.98] sm:hidden"
      >
        <span className="poppins-semibold text-[14px] text-white">
          {t("common.readyToTip")} — {t("common.scanQRCode")}
        </span>
        <ChevronRight className="h-5 w-5 text-white" />
      </button>
    </div>
  );
};

export default ViewHistoryCardSection;
