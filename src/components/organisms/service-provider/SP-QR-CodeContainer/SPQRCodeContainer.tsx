 
import { PrimaryTypo } from "@/components/atoms/typo/primaryTypo";
import { useNavigate } from "react-router-dom";
import SwitchAccount from "@/components/molecules/common/switch-account/switchAccount";
import DownloadIcon from "@/assets/svg/download-icon.svg";
import { IconButton } from "@/components/atoms/buttons/iconButton";
import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { handleScrollTop } from "@/hooks/hooks";
import Logo from "@/assets/images/appLogo.png";
import shareicon from "@/assets/svg/Share-icon.svg";
import ToastProvider from "@/providers/ToastProvider";
import { useUser } from "@/contexts/UserContext";
import { SecondaryTypo } from "@/components/atoms/typo/secondaryTypo";
import { useTranslation } from "react-i18next";
import {
  resolveUserNameParts,
  toQrDownloadFileName,
} from "@/utils/userProfile";
import BalanceStatsSummary from "@/components/molecules/service-provider/balance-stats-summary/balanceStatsSummary";
import SPQRActionButton from "@/components/molecules/service-provider/sp-qr-action-button/SPQRActionButton";
import { FaCommentDots, FaDollarSign, FaQrcode } from "react-icons/fa";

const SPQRCodeContainer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { userDetails: currentUser, isLoading: isUserLoading } = useUser();
  const { firstName, lastName, fullName } = useMemo(
    () => resolveUserNameParts(currentUser),
    [currentUser]
  );

  const handleRouteReviews = () => {
    navigate("/service-provider/reviews");
  };

  const handleRouteTipBalance = () => {
    navigate("/service-provider/tip-balance");
  };

  useEffect(() => {
    const generateQRCode = async () => {
      const fe_url = window.location.origin;
      const userID = localStorage.getItem("userId");
      try {
        const dataUrl = await QRCode.toDataURL(
          `${fe_url}/tip-provider/tip/${userID}`,
          {
            width: 250,
            margin: 2,
          }
        );
        setQrCodeDataUrl(dataUrl);
      } catch (error) {
        console.error("Failed to generate QR code", error);
      }
    };

    generateQRCode();
  }, []);

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
          const text = "Tip App";
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
      await setCanvasDimensions();
      await fillBackground();
      await drawUserDetails();
      await drawLogo();
      await drawQRCode();
      await drawCanvasBorder();

      requestAnimationFrame(() => {
        setTimeout(() => {
          const link = document.createElement("a");
          link.download = toQrDownloadFileName(fullName);
          link.href = canvas.toDataURL("image/png");
          link.click();
        }, 1000);
      });
    };

    drawAndDownload();
  };

  const handleShareQRCode = () => {
    const canvas = canvasRef.current;

    if (!canvas || !qrCodeDataUrl) return;

    const shareQRCode = async () => {
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
        context.fillText(currentUser?.FirstName || "", canvas.width / 2, 120);

        context.font = "bold 35px poppins";
        context.fillText(currentUser?.LastName || "", canvas.width / 2, 160);
      };

      const drawLogo = () => {
        return new Promise<void>((resolve) => {
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
      };

      const drawQRCode = () => {
        return new Promise<void>((resolve) => {
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
      };

      const drawCanvasBorder = () => {
        const borderThickness = 2;
        const padding = 10;
        const x = padding;
        const y = padding;
        const width = canvas.width - 2 * padding;
        const height = canvas.height - 2 * padding;

        context.strokeStyle = "#000000";
        context.lineWidth = borderThickness;
        context.strokeRect(x, y, width, height);
      };

      const drawAndDownload = async () => {
        await document.fonts.ready;
        await setCanvasDimensions();
        await fillBackground();
        await drawUserDetails();
        await drawLogo();
        await drawQRCode();
        await drawCanvasBorder();

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
                : "Check out my Tip App QR Code!",
              files: [file],
            });
          } catch (error) {
            console.error("Error sharing QR code:", error);
          }
        } else {
          ToastProvider.error("Sharing is not supported on this device..");
        }
      };

      drawAndDownload();
    };

    const prepareCanvasForShare = async () => {
      shareQRCode();
    };

    prepareCanvasForShare();
  };

  return (
    <div>
      <div className="fixed right-3 top-[64px] z-30 sm:right-4 sm:top-[70px] lg:right-8 lg:top-[76px]">
        <SwitchAccount role={t("userSelection.serviceProvider")} />
      </div>
      <div className="relative mx-auto max-w-[477px] overflow-hidden rounded-2xl bg-white px-36 pt-40 pb-32 sm:border sm:border-[#d71921]/40 sm:shadow-[0_8px_32px_rgba(158,42,43,0.12)] md:mt-25 lg:mt-25 flex flex-col gap-22">
        <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#9E2A2B] via-[#d71921] to-[#9E2A2B]" />
        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-12 flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-[#F9EBEB] text-[22px] text-[#9E2A2B] shadow-[0_4px_12px_rgba(158,42,43,0.12)]">
            <FaQrcode />
          </div>
          <PrimaryTypo
            typo={t("common.qrCode")}
            styles="!text-[26px] sm:!text-[24px] poppins-semibold text-[#1a2744]"
          />
          {fullName ? (
            <div className="mt-10 flex items-center justify-center gap-10">
              <span className="h-px w-40 bg-[#9E2A2B]/30" />
              <span className="text-[#9E2A2B] text-[10px]">•</span>
              <SecondaryTypo
                typo={fullName}
                styles="text-[#9E2A2B] !text-[16px] sm:!text-[17px] poppins-medium whitespace-nowrap"
              />
              <span className="text-[#9E2A2B] text-[10px]">•</span>
              <span className="h-px w-40 bg-[#9E2A2B]/30" />
            </div>
          ) : null}
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center gap-12">
          <div className="mx-auto w-full max-w-[210px] rounded-2xl border-2 border-[#9E2A2B] bg-white p-14 shadow-[0_4px_16px_rgba(158,42,43,0.1)]">
            {qrCodeDataUrl && (
              <img
                src={qrCodeDataUrl}
                alt="QR Code"
                className="h-full w-full object-contain"
              />
            )}
          </div>
          <div className="flex items-center gap-8 rounded-full bg-[#F9EBEB] px-14 py-6">
            <FaQrcode className="text-[12px] text-[#9E2A2B]" />
            <span className="text-[12px] poppins-medium text-[#9E2A2B]">
              {t("common.scanToTip")}
            </span>
          </div>
        </div>

        {/* Balance stats */}
        <BalanceStatsSummary
          balance={currentUser?.BalanceOriginal}
          totalEarned={
            currentUser?.TotalTipsOriginal ?? currentUser?.TotalTips
          }
          isLoading={isUserLoading}
          currency="GBP"
          variant="compact"
        />

        {/* Action buttons */}
        <div className="flex flex-col gap-12">
          <SPQRActionButton
            label={t("common.reviews")}
            icon={<FaCommentDots />}
            variant="filled"
            onClick={() => {
              handleScrollTop();
              handleRouteReviews();
            }}
          />
          <SPQRActionButton
            label={t("payments.tipBalance")}
            icon={<FaDollarSign />}
            variant="outlined"
            onClick={() => {
              handleScrollTop();
              handleRouteTipBalance();
            }}
          />
        </div>
      </div>

      <div className="max-w-[477px] mx-auto mt-25 px-50 sm:px-0 rounded-8">
        <div className="flex items-center justify-center gap-9">
          <IconButton
            typo={t("common.downloadQRCode")}
            icon={DownloadIcon}
            handleOnClick={handleDownloadQRCode}
            styles="shadow-xl w-full !rounded-8 text-black text-base poppins-regular min-h-[48px] sm:min-h-[56px] bg-white border-2 hover:bg-white border-[#9E2A2B] shadow-[0_0_15px_0_rgba(215,25,33,0.5)] hover:text-[#9E2A2B] flex items-center gap-13"
          />
          <button
            type="button"
            aria-label={t("common.shareQRCode")}
            title={t("common.shareQRCode")}
            className="flex min-h-[48px] w-[56px] shrink-0 items-center justify-center !rounded-8 border-2 border-[#9E2A2B] bg-white shadow-[0_0_15px_0_rgba(215,25,33,0.5)] transition-colors hover:bg-[#fdf8f8] sm:min-h-[56px]"
            onClick={handleShareQRCode}
          >
            <img src={shareicon} alt="" className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SPQRCodeContainer;
