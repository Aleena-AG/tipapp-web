import { PrimaryButton } from "@/components/atoms/buttons/primaryButton";
import { useNavigate } from "react-router-dom";
import SwitchAccount from "@/components/molecules/common/switch-account/switchAccount";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { handleScrollTop } from "@/hooks/hooks";
import Logo from "@/assets/images/appLogo.png";
import ToastProvider from "@/providers/ToastProvider";
import { useUser } from "@/contexts/UserContext";
import { useTranslation } from "react-i18next";
import {
  resolveUserNameParts,
  toQrDownloadFileName,
} from "@/utils/userProfile";
import { useGetTipHistoryDetailsByServiceProvider } from "@/api/tipManagement";
import { CurrencyContext } from "@/App";
import { formatNumber } from "@/hooks/formatters";
import BounceLoader from "react-spinners/ClipLoader";
import CharacterSP from "@/assets/images/sp-char.png";
import WalletImage from "@/assets/images/wallet.png";
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  Smile,
  QrCode,
  Download,
  Share2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const DEMO_TIP_AMOUNTS = [2, 4, 6, 20];

const SPQRCodeContainer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [demoTipIndex, setDemoTipIndex] = useState(0);
  const [tipAnimKey, setTipAnimKey] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { userDetails: currentUser, isLoading: isUserLoading } = useUser();
  const { currency } = useContext(CurrencyContext);
  const { firstName, lastName, fullName } = useMemo(
    () => resolveUserNameParts(currentUser),
    [currentUser]
  );

  const { data: tipHistoryData, isLoading: isTipsLoading } =
    useGetTipHistoryDetailsByServiceProvider();

  const tipItems = useMemo(
    () => tipHistoryData?.pages.flatMap((page) => page.items) ?? [],
    [tipHistoryData]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setDemoTipIndex((prev) => (prev + 1) % DEMO_TIP_AMOUNTS.length);
      setTipAnimKey((k) => k + 1);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const animatedTipAmount = DEMO_TIP_AMOUNTS[demoTipIndex];

  const { tipsThisMonth, monthChangePercent, latestTip } = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
    const lastMonth = lastMonthDate.getMonth();
    const lastMonthYear = lastMonthDate.getFullYear();

    let thisMonthTotal = 0;
    let lastMonthTotal = 0;

    tipItems.forEach((tip) => {
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
      percent = Math.round(
        ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
      );
    } else if (thisMonthTotal > 0) {
      percent = 100;
    }

    const sorted = [...tipItems].sort((a, b) => {
      const da = new Date(a.TipDate || a.date || a.createdAt).getTime();
      const db = new Date(b.TipDate || b.date || b.createdAt).getTime();
      return db - da;
    });

    return {
      tipsThisMonth: thisMonthTotal,
      monthChangePercent: percent,
      latestTip: sorted[0] ?? null,
    };
  }, [tipItems]);

  const balance = currentUser?.BalanceOriginal ?? 0;

  const handleRouteTipBalance = () => {
    navigate("/service-provider/tip-balance");
  };

  const handleRouteWithdraw = () => {
    navigate("/service-provider/withdraw-money");
  };

  useEffect(() => {
    const generateQRCode = async () => {
      const fe_url = window.location.origin;
      const userID = localStorage.getItem("userId");
      try {
        const dataUrl = await QRCode.toDataURL(
          `${fe_url}/tip-provider/tip/${userID}`,
          {
            width: 512,
            margin: 2,
            errorCorrectionLevel: "H",
            color: {
              dark: "#000000",
              light: "#FFFFFF",
            },
          }
        );
        setQrCodeDataUrl(dataUrl);
      } catch (error) {
        console.error("Failed to generate QR code", error);
      }
    };

    generateQRCode();
  }, []);

  const drawRoundedRect = (
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    borderColor: string,
    borderWidth: number
  ) => {
    context.strokeStyle = borderColor;
    context.lineWidth = borderWidth;
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.arcTo(x + width, y, x + width, y + radius, radius);
    context.lineTo(x + width, y + height - radius);
    context.arcTo(
      x + width,
      y + height,
      x + width - radius,
      y + height,
      radius
    );
    context.lineTo(x + radius, y + height);
    context.arcTo(x, y + height, x, y + height - radius, radius);
    context.lineTo(x, y + radius);
    context.arcTo(x, y, x + radius, y, radius);
    context.closePath();
    context.stroke();
  };

  const handleDownloadQRCode = () => {
    const canvas = canvasRef.current;
    if (!canvas || !qrCodeDataUrl) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const setCanvasDimensions = () => {
      canvas.width = 500;
      canvas.height = 650;
    };

    const fillBackground = () => {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
    };

    const drawUserDetails = () => {
      context.fillStyle = "#000000";
      context.font = "35px poppins";
      context.textAlign = "center";
      context.fillText(firstName, canvas.width / 2, 120);
      context.font = "bold 35px poppins";
      context.fillText(lastName, canvas.width / 2, 160);
    };

    const drawLogo = () => {
      return new Promise<void>((resolve) => {
        const appLogo = new Image();
        appLogo.src = Logo;
        appLogo.onload = () => {
          const scaledWidth = appLogo.width * 2;
          const scaledHeight = appLogo.height * 2;
          const text = "TipTapp";
          const textWidth = context.measureText(text).width;
          const totalWidth = scaledWidth + 40 + textWidth;
          const logoX = (canvas.width - totalWidth) / 2;
          const logoY = 180;

          context.drawImage(appLogo, logoX, logoY, scaledWidth, scaledHeight);
          context.fillStyle = "#000000";
          context.textAlign = "left";
          context.font = "bold 43px poppins";
          context.fillText(
            text,
            logoX + scaledWidth + 4,
            logoY + scaledHeight / 2 + 15
          );
          resolve();
        };
      });
    };

    const drawQRCode = () => {
      return new Promise<void>((resolve) => {
        const qrCodeImg = new Image();
        qrCodeImg.src = qrCodeDataUrl;
        qrCodeImg.onload = () => {
          const qrSize = 250;
          const borderWidth = 2;
          const borderColor = "#000000";
          const borderRadius = 5;
          const qrX = (canvas.width - qrSize) / 2;
          const qrY = 290;

          context.drawImage(qrCodeImg, qrX, qrY, qrSize, qrSize);
          drawRoundedRect(
            context,
            qrX,
            qrY,
            qrSize,
            qrSize,
            borderRadius,
            borderColor,
            borderWidth
          );

          context.fillStyle = "#000000";
          context.font = "italic bold 28px poppins";
          context.textAlign = "center";
          const textX = canvas.width / 2;
          const textY = qrY + qrSize + 50;
          context.fillText(
            "Scan",
            textX - context.measureText(" Here").width / 2,
            textY
          );
          context.font = "italic 28px poppins";
          context.fillText(
            "Here",
            textX + context.measureText("Scan ").width / 2,
            textY
          );
          resolve();
        };
      });
    };

    const drawCanvasBorder = () => {
      const borderThickness = 2;
      const padding = 10;
      const borderRadius = 5;
      const x = padding;
      const y = padding;
      const width = canvas.width - 2 * padding;
      const height = canvas.height - 2 * padding;

      drawRoundedRect(
        context,
        x,
        y,
        width,
        height,
        borderRadius,
        "#000000",
        borderThickness
      );
    };

    const drawAndDownload = async () => {
      await document.fonts.ready;
      setCanvasDimensions();
      fillBackground();
      drawUserDetails();
      await drawLogo();
      await drawQRCode();
      drawCanvasBorder();

      requestAnimationFrame(() => {
        setTimeout(() => {
          const link = document.createElement("a");
          link.download = toQrDownloadFileName(fullName);
          link.href = canvas.toDataURL("image/png");
          link.click();
        }, 1000);
      });
    };

    void drawAndDownload();
  };

  const handleShareQRCode = () => {
    const canvas = canvasRef.current;
    if (!canvas || !qrCodeDataUrl) return;

    const shareQRCode = async () => {
      const context = canvas.getContext("2d");
      if (!context) return;

      canvas.width = 500;
      canvas.height = 650;
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = "#000000";
      context.font = "35px poppins";
      context.textAlign = "center";
      context.fillText(currentUser?.FirstName || "", canvas.width / 2, 120);
      context.font = "bold 35px poppins";
      context.fillText(currentUser?.LastName || "", canvas.width / 2, 160);

      await new Promise<void>((resolve) => {
        const appLogo = new Image();
        appLogo.src = Logo;
        appLogo.onload = () => {
          const scaledWidth = appLogo.width * 2;
          const scaledHeight = appLogo.height * 2;
          const logoX = (canvas.width - scaledWidth) / 2;
          const logoY = 180;
          context.drawImage(appLogo, logoX, logoY, scaledWidth, scaledHeight);
          resolve();
        };
      });

      await new Promise<void>((resolve) => {
        const qrCodeImg = new Image();
        qrCodeImg.src = qrCodeDataUrl;
        qrCodeImg.onload = () => {
          const qrSize = 250;
          const qrX = (canvas.width - qrSize) / 2;
          const qrY = 290;
          context.drawImage(qrCodeImg, qrX, qrY, qrSize, qrSize);
          resolve();
        };
      });

      context.strokeStyle = "#000000";
      context.lineWidth = 2;
      context.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

      const dataURL = canvas.toDataURL("image/png");
      const byteString = atob(dataURL.split(",")[1]);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uintArray = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        uintArray[i] = byteString.charCodeAt(i);
      }

      const blob = new Blob([uintArray], { type: "image/png" });
      const file = new File([blob], toQrDownloadFileName(fullName), {
        type: "image/png",
      });

      if (navigator.share) {
        try {
          await navigator.share({
            title: "My QR Code",
            text: fullName
              ? `Check out this QR Code for ${fullName}!`
              : "Check out my TipTapp QR Code!",
            files: [file],
          });
        } catch (error) {
          console.error("Error sharing QR code:", error);
        }
      } else {
        ToastProvider.error("Sharing is not supported on this device..");
      }
    };

    void shareQRCode();
  };

  const ChangeBadge = ({
    percent,
    label,
  }: {
    percent: number | null;
    label: string;
  }) => {
    if (percent === null) return null;
    const positive = percent >= 0;
    return (
      <p
        className={`poppins-medium mt-4 flex items-center gap-4 text-[12px] ${
          positive
            ? "text-[#1E9E6A] dark:text-emerald-400"
            : "text-[#D14343] dark:text-red-400"
        }`}
      >
        {positive ? (
          <ArrowUpRight className="h-3.5 w-3.5" />
        ) : (
          <ArrowDownRight className="h-3.5 w-3.5" />
        )}
        {Math.abs(percent)}% {label}
      </p>
    );
  };

  return (
    <div className="relative w-full">
      <div className="fixed right-3 top-[72px] z-30 sm:right-4 sm:top-[76px] lg:right-8 lg:top-[80px]">
        <SwitchAccount variant="floating" />
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div className="relative mx-auto flex w-full max-w-[1380px] flex-col gap-32 px-20 py-16 sm:px-32 lg:gap-40 lg:px-48 lg:py-20 xl:px-64">
        {/* TOP: hero + QR | mascot */}
        <div className="grid grid-cols-1 items-center gap-32 lg:grid-cols-[0.95fr_1.05fr] lg:gap-40">
          {/* LEFT CONTENT */}
          <div className="mx-auto w-full max-w-[590px] lg:mx-0">
            <div>
              <span className="inline-flex items-center gap-8 rounded-full border border-[#9E2A2B]/15 bg-card px-16 py-8 shadow-[0_8px_24px_rgba(158,42,43,0.08)] dark:border-[#F87171]/25 dark:bg-[#0a1629]/90 dark:shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
                <span className="h-2 w-2 rounded-full bg-[#9E2A2B] dark:bg-[#F87171]" />
                <span className="poppins-semibold text-[11px] uppercase tracking-[0.18em] text-[#9E2A2B] dark:text-[#FCA5A5]">
                  {t("userSelection.serviceProvider")}
                </span>
              </span>

              <h1 className="poppins-semibold mt-16 text-[34px] leading-[1.05] tracking-[-0.04em] text-[#2B0B0B] sm:text-[42px] xl:text-[52px] dark:text-slate-50">
                {latestTip ? (
                  <>
                    {t("common.spHeroNewTipPrefix")}{" "}
                    <span className="text-[#9E2A2B] dark:text-[#F87171]">
                      {t("common.spHeroNewTipHighlight")}
                    </span>
                  </>
                ) : (
                  <>
                    {t("common.spHeroWelcomePrefix")}{" "}
                    <span className="text-[#9E2A2B] dark:text-[#F87171]">
                      {t("common.spHeroWelcomeHighlight")}
                    </span>
                  </>
                )}
              </h1>

              <p className="poppins-regular mt-12 max-w-[470px] text-[15px] leading-relaxed text-[#6F7682] sm:text-[16px] dark:text-slate-400">
                {latestTip
                  ? t("common.spHeroSubtext")
                  : t("common.spHeroEmptySubtext")}
              </p>
            </div>

            {/* QR Code Card */}
            <div className="mt-24 rounded-[24px] border border-[#F0E0E0] bg-card p-20 shadow-[0_22px_60px_rgba(158,42,43,0.12)] sm:p-24 dark:border-white/10 dark:bg-[#0a1629]/95 dark:shadow-[0_22px_60px_rgba(0,0,0,0.45)]">
              <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left">
                <div className="flex h-[200px] w-[200px] shrink-0 items-center justify-center rounded-[28px] border-2 border-[#9E2A2B]/20 bg-white p-12 sm:h-[220px] sm:w-[220px] dark:border-[#E8B923]/40 dark:bg-white">
                  {qrCodeDataUrl ? (
                    <img
                      src={qrCodeDataUrl}
                      alt="QR Code"
                      width={220}
                      height={220}
                      decoding="async"
                      className="h-full w-full object-contain [image-rendering:pixelated]"
                    />
                  ) : (
                    <BounceLoader color="#9E2A2B" loading size={28} />
                  )}
                </div>

                <div className="mt-20 min-w-0 flex-1 sm:ml-24 sm:mt-0">
                  <div className="mb-8 inline-flex items-center gap-8 rounded-full bg-[#F9EBEB] px-12 py-6 dark:bg-[#9E2A2B]/25">
                    <QrCode className="h-3.5 w-3.5 text-[#9E2A2B] dark:text-[#FCA5A5]" />
                    <span className="poppins-medium text-[12px] text-[#9E2A2B] dark:text-[#FCA5A5]">
                      {t("common.scanToTip")}
                    </span>
                  </div>
                  <h3 className="poppins-semibold text-[22px] text-[#2B0B0B] dark:text-white">
                    {t("common.qrCode")}
                  </h3>
                  {fullName ? (
                    <p className="poppins-medium mt-6 text-[15px] text-[#9E2A2B] dark:text-[#FCA5A5]">
                      {fullName}
                    </p>
                  ) : null}
                  <p className="poppins-regular mt-8 max-w-[280px] text-[14px] leading-relaxed text-[#7A7A7A] dark:text-slate-400">
                    {t("common.spQrCardDesc")}
                  </p>
                </div>

                <img
                  src={WalletImage}
                  alt=""
                  aria-hidden="true"
                  width={160}
                  height={160}
                  decoding="async"
                  className="mt-16 h-[120px] w-[120px] shrink-0 object-contain drop-shadow-[0_10px_20px_rgba(158,42,43,0.25)] sm:ml-14 sm:mt-0 sm:h-[140px] sm:w-[140px]"
                />
              </div>

              <div className="mt-20 flex gap-12">
                <PrimaryButton
                  typo={
                    <span className="flex items-center justify-center gap-8">
                      <Download className="h-[16px] w-[16px]" />
                      {t("common.downloadQRCode")}
                    </span>
                  }
                  styles="flex-1 !bg-[#9E2A2B] hover:!bg-[#ce260b] dark:!bg-[#C53030] dark:hover:!bg-[#9E2A2B] !rounded-2xl !text-white text-[15px] poppins-semibold h-[48px] shadow-[0_14px_28px_rgba(158,42,43,0.28)] dark:shadow-[0_14px_28px_rgba(197,48,48,0.35)] transition-all duration-300 hover:-translate-y-0.5"
                  handleOnClick={handleDownloadQRCode}
                />
                <button
                  type="button"
                  aria-label={t("common.shareQRCode")}
                  title={t("common.shareQRCode")}
                  onClick={handleShareQRCode}
                  className="flex h-[48px] w-[52px] shrink-0 items-center justify-center rounded-2xl border-2 border-[#9E2A2B] bg-card text-[#9E2A2B] transition-all hover:-translate-y-0.5 hover:bg-[#FDF8F8] dark:border-[#E8B923] dark:bg-[#121e36] dark:text-[#E8B923] dark:hover:bg-[#1a2744]"
                >
                  <Share2 className="h-[18px] w-[18px]" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT MASCOT */}
          <div className="hidden lg:block">
            <div className="relative mx-auto flex h-[480px] max-w-[650px] items-center justify-center">
              <div className="absolute h-[400px] w-[400px] rounded-full bg-gradient-to-br from-[#F9EBEB] via-[#F5D6D6] to-[#EEC4C4] dark:from-[#9E2A2B]/35 dark:via-[#2a0f14]/60 dark:to-[#010816]/80" />
              <div className="absolute h-[450px] w-[450px] rounded-full border border-[#9E2A2B]/10 dark:border-[#F87171]/20" />
              <div className="absolute bottom-8 h-8 w-[280px] rounded-full bg-[#9E2A2B]/15 blur-xl dark:bg-[#C53030]/25" />

              <img
                src={CharacterSP}
                alt="Service provider mascot"
                className="relative z-10 h-[440px] w-auto max-w-[440px] object-contain drop-shadow-[0_26px_50px_rgba(158,42,43,0.18)] dark:drop-shadow-[0_26px_50px_rgba(0,0,0,0.5)]"
              />

              {/* Animated tip preview card */}
              <div className="absolute right-0 top-16 z-20 max-w-[220px] rounded-2xl border border-transparent bg-card px-16 py-12 shadow-[0_12px_30px_rgba(158,42,43,0.14)] dark:border-white/10 dark:bg-[#0a1629] dark:shadow-[0_12px_30px_rgba(0,0,0,0.4)]">
                <p className="poppins-semibold text-[13px] text-[#2B0B0B] dark:text-white">
                  {t("common.youReceivedATip")}
                </p>
                <p
                  key={tipAnimKey}
                  className="ta-tip-amount-pop poppins-semibold mt-4 text-[16px] text-[#1E9E6A] dark:text-emerald-400"
                >
                  + {currency} {formatNumber(animatedTipAmount)}
                </p>
                <p className="poppins-regular mt-4 text-[12px] text-[#8A8A8A] dark:text-slate-400">
                  {latestTip?.Comment ||
                    latestTip?.feedback ||
                    t("common.thankYouEmoji")}
                </p>
              </div>

              <div className="absolute bottom-16 left-4 z-20 rounded-2xl border border-transparent bg-card px-16 py-12 shadow-[0_12px_30px_rgba(158,42,43,0.12)] dark:border-white/10 dark:bg-[#0a1629] dark:shadow-[0_12px_30px_rgba(0,0,0,0.4)]">
                <div className="flex items-center gap-8">
                  <Zap className="h-5 w-5 text-[#9E2A2B] dark:text-[#FCA5A5]" />
                  <span className="poppins-semibold text-[13px] text-[#2B0B0B] dark:text-white">
                    {t("common.trustInstant")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM: balance + trust — one aligned row */}
        <div className="grid grid-cols-1 items-stretch gap-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-40">
          {/* Balance + Month stats */}
          <div className="mx-auto grid w-full max-w-[590px] grid-cols-1 gap-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none">
            <div className="flex h-full flex-col justify-between rounded-[20px] border border-[#F0E0E0] bg-card p-16 shadow-[0_14px_36px_rgba(158,42,43,0.08)] dark:border-white/10 dark:bg-[#0a1629]/95 dark:shadow-[0_14px_36px_rgba(0,0,0,0.35)]">
              <div className="flex items-center gap-16">
                <img
                  src={WalletImage}
                  alt=""
                  aria-hidden="true"
                  width={72}
                  height={72}
                  decoding="async"
                  className="h-[64px] w-[64px] shrink-0 object-contain drop-shadow-[0_6px_12px_rgba(158,42,43,0.2)]"
                />
                <div>
                  <p className="poppins-medium text-[13px] text-[#6F7682] dark:text-slate-400">
                    {t("payments.totalBalance")}
                  </p>
                  {isUserLoading ? (
                    <BounceLoader color="#9E2A2B" loading size={16} />
                  ) : (
                    <h3 className="poppins-semibold mt-4 text-[24px] leading-none text-[#9E2A2B] dark:text-[#FCA5A5]">
                      {currency} {formatNumber(balance)}
                    </h3>
                  )}
                  <p className="poppins-regular mt-4 text-[12px] text-[#9A9A9A] dark:text-slate-500">
                    {t("common.availableToWithdraw")}
                  </p>
                </div>
              </div>

              <div className="mt-16 flex gap-10">
                <button
                  type="button"
                  onClick={() => {
                    handleScrollTop();
                    handleRouteWithdraw();
                  }}
                  className="flex-1 rounded-xl bg-[#9E2A2B] px-12 py-10 text-center text-[13px] poppins-semibold text-white transition-colors hover:bg-[#ce260b] dark:bg-[#C53030] dark:hover:bg-[#9E2A2B]"
                >
                  {t("payments.withdraw")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleScrollTop();
                    handleRouteTipBalance();
                  }}
                  className="flex-1 rounded-xl border border-[#9E2A2B]/40 bg-transparent px-12 py-10 text-center text-[13px] poppins-semibold text-[#9E2A2B] transition-colors hover:bg-[#F9EBEB] dark:border-[#F87171]/40 dark:text-[#FCA5A5] dark:hover:bg-[#9E2A2B]/20"
                >
                  {t("common.viewHistory")}
                </button>
              </div>
            </div>

            <div className="flex h-full flex-col justify-center rounded-[20px] border border-[#D8F0E3] bg-[#F0FBF5] p-16 shadow-[0_14px_36px_rgba(30,158,106,0.08)] dark:border-emerald-400/20 dark:bg-[#071a14]/90 dark:shadow-[0_14px_36px_rgba(0,0,0,0.35)]">
              <div className="flex items-center gap-16">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D9F3E6] dark:bg-emerald-500/20">
                  <TrendingUp className="h-6 w-6 text-[#1E9E6A] dark:text-emerald-400" />
                </span>
                <div>
                  <p className="poppins-medium text-[13px] text-[#5E7E6F] dark:text-emerald-200/70">
                    {t("common.tipsThisMonth")}
                  </p>
                  {isTipsLoading ? (
                    <BounceLoader color="#1E9E6A" loading size={16} />
                  ) : (
                    <h3 className="poppins-semibold mt-4 text-[24px] leading-none text-[#12855A] dark:text-emerald-300">
                      {currency} {formatNumber(tipsThisMonth)}
                    </h3>
                  )}
                  {!isTipsLoading && (
                    <ChangeBadge
                      percent={monthChangePercent}
                      label={t("common.fromLastMonth")}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-1 gap-16 sm:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: t("common.trustSecure"),
                desc: t("common.spTrustSecureDesc"),
              },
              {
                icon: Zap,
                title: t("common.trustInstant"),
                desc: t("common.spTrustInstantDesc"),
              },
              {
                icon: Smile,
                title: t("common.trustEasy"),
                desc: t("common.spTrustEasyDesc"),
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex h-full flex-col rounded-[18px] border border-[#F0E0E0] bg-card/90 p-16 shadow-[0_10px_28px_rgba(158,42,43,0.08)] backdrop-blur dark:border-white/10 dark:bg-[#0a1629]/95 dark:shadow-[0_10px_28px_rgba(0,0,0,0.35)]"
              >
                <span className="mb-12 flex h-11 w-11 items-center justify-center rounded-full bg-[#9E2A2B] dark:bg-[#C53030]">
                  <Icon className="h-5 w-5 text-white" />
                </span>
                <h3 className="poppins-semibold text-[14px] text-[#2B0B0B] dark:text-white">
                  {title}
                </h3>
                <p className="poppins-regular mt-4 text-[11px] leading-relaxed text-[#8A8A8A] dark:text-slate-400">
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

export default SPQRCodeContainer;
