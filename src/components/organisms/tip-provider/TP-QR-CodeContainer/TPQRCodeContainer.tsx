 
import { PrimaryButton } from "@/components/atoms/buttons/primaryButton";
import QRCode from "@/assets/images/qr-scan.png";
import { useContext, useEffect, useMemo, useState } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { useNavigate } from "react-router-dom";
import tryAgainIcon from "@/assets/svg/try-again.svg";
import SwitchAccount from "@/components/molecules/common/switch-account/switchAccount";
import { handleScrollTop } from "@/hooks/hooks";
import { useTranslation } from "react-i18next";
import { useGetUserDetails } from "@/api/authApi";
import {
  useGetBalanceAmount,
  useGetTipHistoryDetailsByTipper,
} from "@/api/tipManagement";
import ToastProvider from "@/providers/ToastProvider";
import BounceLoader from "react-spinners/ClipLoader";

import CharacterTipper from "@/assets/images/scan.png";
import { CurrencyContext } from "@/App";
import { formatNumber } from "@/hooks/formatters";
import {
  ChevronRight,
  Wallet,
  TrendingUp,
  ShieldCheck,
  Zap,
  Smile,
  History,
  Star,
  ScanLine,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const TPQRCodeContainer = () => {
  const { t } = useTranslation();
  const [data, setData] = useState("No result");
  const [open, setOpen] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [invalidQR, setInvalidQR] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const navigate = useNavigate();
  const { currency } = useContext(CurrencyContext);

  const { data: tipBalance, isLoading: isBalanceLoading } =
    useGetBalanceAmount(currency);
  const { data: tipHistoryData, isLoading: isTipsLoading } =
    useGetTipHistoryDetailsByTipper();

  const { tipsThisMonth, monthChangePercent } = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
    const lastMonth = lastMonthDate.getMonth();
    const lastMonthYear = lastMonthDate.getFullYear();
    const items = tipHistoryData?.pages.flatMap((page) => page.items) ?? [];

    let thisMonthTotal = 0;
    let lastMonthTotal = 0;

    items.forEach((tip) => {
      const date = new Date(tip.TipDate || tip.date || tip.createdAt);
      const amount = parseFloat(tip.Amount || tip.amount || "0");
      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        thisMonthTotal += amount;
      } else if (
        date.getMonth() === lastMonth &&
        date.getFullYear() === lastMonthYear
      ) {
        lastMonthTotal += amount;
      }
    });

    let percent: number | null = null;
    if (lastMonthTotal > 0) {
      percent = Math.round(((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100);
    } else if (thisMonthTotal > 0) {
      percent = 100;
    }

    return { tipsThisMonth: thisMonthTotal, monthChangePercent: percent };
  }, [tipHistoryData]);

  const goToTipHistory = () => {
    handleScrollTop();
    navigate("/tip-provider/view-history");
  };

  const goToReviews = () => {
    handleScrollTop();
    navigate("/tip-provider/user-review-history");
  };

  const {
    mutate: getUserDetailsMutate,
    isSuccess: isGetUserDetailsSuccess,
    isError: isGetUserDetailsError,
    error: getUserDetailsError,
  } = useGetUserDetails();

  const extractAndValidateUUID = (scannedData: string) => {
    const baseUrl = window.location.origin;
    let uuid = "";

    if (scannedData.length === 36) {
      uuid = scannedData;
    } else if (scannedData.startsWith(baseUrl)) {
      const tipURL = scannedData.replace(baseUrl, "");
      const uuidMatch = tipURL.match(/\/tip\/([a-f0-9-]{36})/i);
      if (uuidMatch && uuidMatch[1]) {
        uuid = uuidMatch[1];
      }
    } else if (
      scannedData.includes("/tip-provider/tip/") ||
      scannedData.includes("/tip/")
    ) {
      const uuidMatch = scannedData.match(/\/tip\/([a-f0-9-]{36})/i);
      if (uuidMatch && uuidMatch[1]) {
        uuid = uuidMatch[1];
      }
    }

    return uuid;
  };

  useEffect(() => {
    if (data === "No result" || !scanned) return;

    const uuid = extractAndValidateUUID(data);

    if (!uuid) {
      setInvalidQR(true);
      ToastProvider.error(
        "Invalid QR code. Please scan a valid service provider's QR code."
      );
      return;
    }

    setIsValidating(true);
    getUserDetailsMutate(uuid);
  }, [data, scanned, getUserDetailsMutate]);

  useEffect(() => {
    if (isValidating && isGetUserDetailsSuccess) {
      setIsValidating(false);
      const uuid = extractAndValidateUUID(data);
      if (uuid) {
        navigate(`/tip-provider/tip/${uuid}`);
      }
    }
  }, [isValidating, isGetUserDetailsSuccess, data, navigate]);

  useEffect(() => {
    if (isValidating && isGetUserDetailsError) {
      setIsValidating(false);
      const errorMessage =
        getUserDetailsError.response?.data?.message ||
        getUserDetailsError.message ||
        "Invalid QR code. Please scan a valid service provider's QR code.";

      ToastProvider.error(errorMessage);
      setInvalidQR(true);
    }
  }, [isValidating, isGetUserDetailsError, getUserDetailsError]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (open) {
      timeout = setTimeout(() => {
        if (!scanned) {
          setOpen(false);
          setTimeoutReached(true);
        }
      }, 10000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [open, scanned]);

  const resetScanner = () => {
    setOpen(true);
    setScanned(false);
    setTimeoutReached(false);
    setData("No result");
    setInvalidQR(false);
    setIsValidating(false);
  };

  return (
    <div className="relative w-full">
      {/* Switch account */}
      <div className="fixed right-3 top-[64px] z-30 rounded-lg border border-[#0B538D]/20 bg-white shadow-[0_4px_12px_rgba(11,83,141,0.12)] sm:right-4 sm:top-[70px] lg:right-8 lg:top-[76px] [&_button]:py-4 [&_button]:pr-12 [&_img]:mx-4 [&_img]:my-0 [&_img]:h-6 [&_img]:w-6 [&_span]:text-[11px] sm:[&_button]:pr-16 sm:[&_img]:h-7 sm:[&_img]:w-7 sm:[&_span]:text-xs">
        <SwitchAccount role={t("userSelection.tipper")} />
      </div>

      {/* Validation overlay */}
      {isValidating && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center rounded-2xl bg-white p-32 shadow-2xl">
            <BounceLoader
              color="#0B538D"
              loading={isValidating}
              size={50}
              aria-label="Validating QR Code"
              data-testid="validation-loader"
            />
            <span className="poppins-regular mt-16 text-sm text-gray-600">
              Validating QR code...
            </span>
          </div>
        </div>
      )}

      {/* Invalid QR alert */}
      {invalidQR && (
        <div className="fixed left-4 right-4 top-24 z-40 mx-auto flex max-w-[500px] items-center gap-8 rounded-lg border border-red-400 bg-red-100 px-16 py-12 text-red-700">
          <svg
            className="h-5 w-5 shrink-0 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium">
            Invalid QR code. Please scan a valid service provider&apos;s QR code.
          </span>
          <button
            onClick={() => setInvalidQR(false)}
            className="ml-auto shrink-0 text-red-500 hover:text-red-700"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="relative mx-auto grid w-full max-w-[1380px] grid-cols-1 items-center gap-32 px-20 py-16 sm:px-32 lg:grid-cols-[0.95fr_1.05fr] lg:gap-40 lg:px-48 lg:py-20 xl:px-64">
        {/* LEFT CONTENT */}
    <div className="mx-auto w-full max-w-[590px] lg:mx-0">
      {/* Header */}
      <div>
        <span className="inline-flex items-center gap-8 rounded-full border border-[#0B538D]/10 bg-white px-16 py-8 shadow-[0_8px_24px_rgba(11,83,141,0.08)]">
          <span className="h-2 w-2 rounded-full bg-[#0B538D]" />
          <span className="poppins-semibold text-[11px] uppercase tracking-[0.18em] text-[#0B538D]">
            {t("userSelection.tipper")}
          </span>
        </span>

        <h1 className="poppins-semibold mt-16 text-[34px] leading-[1.05] tracking-[-0.04em] text-[#0B2B4E] sm:text-[42px] xl:text-[52px]">
          Ready <span className="text-[#0B538D]">to</span> Tip?
        </h1>

        <p className="poppins-regular mt-12 max-w-[470px] text-[15px] leading-relaxed text-[#6F7682] sm:text-[16px]">
          Scan a service provider&apos;s QR code and send appreciation instantly.
        </p>
      </div>

      {/* QR Scan Card */}
      <div className="mt-24 rounded-[24px] border border-[#E5EEF7] bg-white p-20 shadow-[0_22px_60px_rgba(11,83,141,0.12)] sm:p-24">
        {open ? (
          <div className="h-[240px] overflow-hidden rounded-[22px] border border-[#E5EEF7] bg-black sm:h-[280px] [&_section]:!h-full [&_section]:!p-0 [&_video]:!h-full [&_video]:!object-contain">
            <QrScanner
              constraints={{ facingMode: "environment" }}
              audio={false}
              stopDecoding={scanned}
              containerStyle={{ height: "100%", paddingTop: 0 }}
              videoStyle={{ height: "100%", objectFit: "contain" }}
              onResult={(result) => {
                if (result && !scanned) {
                  setData(result.getText());
                  setScanned(true);
                  setInvalidQR(false);
                  setTimeout(() => setOpen(false), 1000);
                }
              }}
              onError={(error) => console.info(error)}
            />
          </div>
        ) : timeoutReached ? (
          <div className="flex flex-col items-center text-center sm:flex-row sm:text-left">
            <div className="flex h-[120px] w-[120px] shrink-0 items-center justify-center rounded-[28px] bg-[#F1F7FD]">
              <img
                src={tryAgainIcon}
                alt="Try Again"
                className="w-12 cursor-pointer transition-transform hover:scale-105"
                onClick={resetScanner}
              />
            </div>

            <div className="mt-20 sm:ml-24 sm:mt-0">
              <h3 className="poppins-semibold text-[24px] text-[#0B2B4E]">
                Try Again
              </h3>
              <p className="poppins-regular mt-8 text-[15px] leading-relaxed text-[#7A7A7A]">
                We could not detect a QR code. Please scan again.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center sm:flex-row sm:text-left">
            <div className="flex h-[128px] w-[128px] shrink-0 items-center justify-center rounded-[32px] bg-[#F1F7FD]">
              <img
                src={QRCode}
                alt="QR code"
                className="h-20 w-20 object-contain"
              />
            </div>

            <div className="mt-20 sm:ml-24 sm:mt-0">
              <h3 className="poppins-semibold text-[24px] text-[#0B2B4E]">
                {t("common.scanCardTitle")}
              </h3>
              <p className="poppins-regular mt-8 max-w-[300px] text-[15px] leading-relaxed text-[#7A7A7A]">
                {t("common.scanCardDesc")}
              </p>
            </div>
          </div>
        )}

        <PrimaryButton
          typo={
            open ? (
              t("buttons.goBack")
            ) : (
              <span className="flex items-center justify-center gap-8">
                <ScanLine className="h-[18px] w-[18px]" />
                {t("common.scanQRCode")}
              </span>
            )
          }
          styles="mt-20 w-full bg-[#0B538D] hover:bg-[#094878] !rounded-2xl text-white text-[16px] poppins-semibold h-[52px] shadow-[0_14px_28px_rgba(11,83,141,0.28)] transition-all duration-300 hover:-translate-y-0.5"
          handleOnClick={() => {
            if (open) {
              setOpen(false);
            } else {
              resetScanner();
            }
          }}
        />
      </div>

      {/* Stats */}
      <div className="mt-16 grid grid-cols-1 gap-16 sm:grid-cols-2">
        {/* Balance */}
        <div className="rounded-[20px] border border-[#E5EEF7] bg-white p-16 shadow-[0_14px_36px_rgba(11,83,141,0.08)]">
          <div className="flex items-center gap-16">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF4FF]">
              <Wallet className="h-6 w-6 text-[#0B538D]" />
            </span>

            <div>
              <p className="poppins-medium text-[13px] text-[#6F7682]">
                {t("common.accountBalance")}
              </p>

              {isBalanceLoading ? (
                <BounceLoader color="#0B538D" loading size={16} />
              ) : (
                <h3 className="poppins-semibold mt-4 text-[24px] leading-none text-[#0B538D]">
                  {currency} {formatNumber(tipBalance?.balance ?? 0)}
                </h3>
              )}

              <p className="poppins-regular mt-4 text-[12px] text-[#9A9A9A]">
                {t("common.availableToUse")}
              </p>
            </div>
          </div>
        </div>

        {/* Tips this month */}
        <div className="rounded-[20px] border border-[#D8F0E3] bg-[#F0FBF5] p-16 shadow-[0_14px_36px_rgba(30,158,106,0.08)]">
          <div className="flex items-center gap-16">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D9F3E6]">
              <TrendingUp className="h-6 w-6 text-[#1E9E6A]" />
            </span>

            <div>
              <p className="poppins-medium text-[13px] text-[#5E7E6F]">
                {t("common.tipsThisMonth")}
              </p>

              {isTipsLoading ? (
                <BounceLoader color="#1E9E6A" loading size={16} />
              ) : (
                <h3 className="poppins-semibold mt-4 text-[24px] leading-none text-[#12855A]">
                  {currency} {formatNumber(tipsThisMonth)}
                </h3>
              )}

              {monthChangePercent !== null && !isTipsLoading && (
                <p
                  className={`poppins-medium mt-4 flex items-center gap-4 text-[12px] ${
                    monthChangePercent >= 0
                      ? "text-[#1E9E6A]"
                      : "text-[#D14343]"
                  }`}
                >
                  {monthChangePercent >= 0 ? (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5" />
                  )}
                  {Math.abs(monthChangePercent)}% {t("common.fromLastMonth")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-16">
        <h2 className="poppins-semibold mb-12 text-[17px] text-[#0B2B4E]">
          {t("common.quickActions")}
        </h2>

        <div className="grid grid-cols-1 gap-16 sm:grid-cols-2">
          <button
            type="button"
            onClick={goToTipHistory}
            className="group flex items-center gap-16 rounded-[18px] border border-[#E5EEF7] bg-white p-16 text-left shadow-[0_12px_34px_rgba(11,83,141,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(11,83,141,0.12)]"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EAF4FF]">
              <History className="h-6 w-6 text-[#0B538D]" />
            </span>

            <span className="min-w-0 flex-1">
              <span className="poppins-semibold block text-[15px] text-[#0B2B4E]">
                {t("common.tipHistory")}
              </span>
              <span className="poppins-regular mt-4 block text-[12px] text-[#8A8A8A]">
                {t("common.viewRecentTips")}
              </span>
            </span>

            <ChevronRight className="h-5 w-5 text-[#C5CED8] transition-transform group-hover:translate-x-1" />
          </button>

          <button
            type="button"
            onClick={goToReviews}
            className="group flex items-center gap-16 rounded-[18px] border border-[#E5EEF7] bg-white p-16 text-left shadow-[0_12px_34px_rgba(11,83,141,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(11,83,141,0.12)]"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EAF4FF]">
              <Star className="h-6 w-6 text-[#0B538D]" />
            </span>

            <span className="min-w-0 flex-1">
              <span className="poppins-semibold block text-[15px] text-[#0B2B4E]">
                {t("common.reviews")}
              </span>
              <span className="poppins-regular mt-4 block text-[12px] text-[#8A8A8A]">
                {t("common.checkFeedbackRatings")}
              </span>
            </span>

            <ChevronRight className="h-5 w-5 text-[#C5CED8] transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>

    {/* RIGHT MASCOT SECTION */}
    <div className="hidden lg:block">
      <div className="relative mx-auto flex h-[440px] max-w-[650px] items-center justify-center">
        <div className="absolute h-[380px] w-[380px] rounded-full bg-gradient-to-br from-[#EAF4FF] via-[#D7EAF9] to-[#CFE4F6]" />
        <div className="absolute h-[430px] w-[430px] rounded-full border border-[#0B538D]/10" />
        <div className="absolute bottom-12 h-8 w-[280px] rounded-full bg-[#0B538D]/15 blur-xl" />

        <img
          src={CharacterTipper}
          alt="Tipper mascot"
          className="relative z-10 h-[410px] w-auto object-contain drop-shadow-[0_26px_50px_rgba(11,83,141,0.18)]"
        />

        {/* Floating chips */}
        <div className="absolute right-6 top-24 z-20 rounded-2xl bg-white px-16 py-12 shadow-[0_12px_30px_rgba(11,83,141,0.12)]">
          <div className="flex items-center gap-8">
            <ShieldCheck className="h-5 w-5 text-[#0B538D]" />
            <span className="poppins-semibold text-[13px] text-[#0B2B4E]">
              Secure
            </span>
          </div>
        </div>

        <div className="absolute bottom-24 left-8 z-20 rounded-2xl bg-white px-16 py-12 shadow-[0_12px_30px_rgba(11,83,141,0.12)]">
          <div className="flex items-center gap-8">
            <Zap className="h-5 w-5 text-[#0B538D]" />
            <span className="poppins-semibold text-[13px] text-[#0B2B4E]">
              Instant
            </span>
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div className="mx-auto mt-8 grid max-w-[640px] grid-cols-3 gap-16">
        {[
          {
            icon: ShieldCheck,
            title: t("common.trustSecure"),
            desc: t("common.trustSecureDesc"),
          },
          {
            icon: Zap,
            title: t("common.trustInstant"),
            desc: t("common.trustInstantDesc"),
          },
          {
            icon: Smile,
            title: t("common.trustEasy"),
            desc: t("common.trustEasyDesc"),
          },
        ].map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="rounded-[18px] border border-[#E5EEF7] bg-white/90 p-16 shadow-[0_10px_28px_rgba(11,83,141,0.08)] backdrop-blur"
          >
            <span className="mb-12 flex h-11 w-11 items-center justify-center rounded-full bg-[#0B538D]">
              <Icon className="h-5 w-5 text-white" />
            </span>

            <h3 className="poppins-semibold text-[14px] text-[#0B2B4E]">
              {title}
            </h3>
            <p className="poppins-regular mt-4 text-[11px] leading-relaxed text-[#8A8A8A]">
              {desc}
            </p>
          </div>
        ))}
      </div>
      </div>
      </div>
    </div>
  );
};

export default TPQRCodeContainer;
