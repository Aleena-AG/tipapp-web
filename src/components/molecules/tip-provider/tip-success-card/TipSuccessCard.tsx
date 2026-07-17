import { Sparkles, Heart, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatNumber } from "@/hooks/formatters";
import { TipSuccessSummary } from "@/utils/pendingTipStorage";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import {
  getRoleAvatarFallback,
  resolveProfileImageSrc,
} from "@/utils/imageUtils";

interface Props {
  summary: TipSuccessSummary;
}

const TipSuccessCard = ({ summary }: Props) => {
  const { t } = useTranslation();
  const formattedAmount = formatNumber(
    summary.amount,
    true,
    1,
    summary.currency
  );

  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      {/* Green check — overlaps card top */}
      <div className="relative z-[2] flex justify-center">
        <div className="ta-animate-pop relative flex h-[84px] w-[84px] items-center justify-center rounded-full bg-[#22C55E] shadow-[0_8px_24px_rgba(34,197,94,0.45)] ring-[10px] ring-white">
          <span className="ta-ring-pulse absolute inset-0 rounded-full bg-[#22C55E]/40" />
          <svg
            className="h-10 w-10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path className="ta-check-path" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* Main card */}
      <div className="ta-animate-slide-up ta-delay-1 -mt-40 rounded-[24px] border border-[#E8EEF4]/80 bg-card px-28 pb-28 pt-[52px] shadow-[0_12px_48px_rgba(11,83,141,0.12)]">
        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="relative">
            <div className="rounded-full bg-[#EAF3FA] p-4">
              <img
                src={resolveProfileImageSrc(
                  summary.recipientProfileUrl,
                  getRoleAvatarFallback("sp")
                )}
                alt={summary.recipientName}
                className="h-[72px] w-[72px] rounded-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    getRoleAvatarFallback("sp");
                }}
              />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#0B538D] text-white shadow-md ring-2 ring-white">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
          </div>

          {/* Title */}
          <div className="ta-animate-fade ta-delay-2 mt-20 flex items-center gap-8">
            <Sparkles className="h-[18px] w-[18px] text-[#0B538D]" />
            <h2 className="poppins-semibold text-[19px] leading-tight text-[#0B538D]">
              {t("payments.tipSuccessTitle")}
            </h2>
            <Sparkles className="h-[18px] w-[18px] text-[#0B538D]" />
          </div>

          {/* Heart */}
          <Heart className="ta-animate-fade ta-delay-2 mt-10 h-4 w-4 fill-[#0B538D] text-[#0B538D]" />

          {/* Amount */}
          <p className="ta-animate-pop ta-delay-3 poppins-bold mt-12 text-[38px] leading-none tracking-tight text-[#0B538D]">
            {formattedAmount}
          </p>

          {/* Subtitle */}
          <p className="ta-animate-fade ta-delay-3 poppins-medium mt-12 text-[14px] leading-snug text-[#5A6A7A] dark:text-slate-400">
            {t("payments.tipSuccessSubtitle")}
          </p>

          {/* Paid via */}
          <div className="ta-animate-fade ta-delay-4 mt-12 flex items-center justify-center gap-6">
            <Wallet className="h-4 w-4 text-[#0B538D]" />
            <span className="poppins-medium text-[13px] text-[#0B538D]">
              {t("payments.tipSentVia", { method: summary.paymentMethod })}
            </span>
          </div>

          {/* Stars */}
          {summary.rating != null && summary.rating > 0 && (
            <div className="mt-16 flex items-center gap-4">
              {Array.from({ length: 5 }).map((_, i) => {
                const filled = i < summary.rating!;
                const StarIcon = filled ? AiFillStar : AiOutlineStar;
                return (
                  <StarIcon
                    key={i}
                    style={{ animationDelay: `${0.55 + i * 0.08}s` }}
                    className={`ta-animate-pop h-[22px] w-[22px] ${
                      filled ? "text-[#FFB800]" : "text-[#D5DCE3]"
                    }`}
                  />
                );
              })}
            </div>
          )}

          {/* Footer */}
          <div className="ta-animate-fade ta-delay-5 mt-20 w-full border-t border-[#EEF2F6] pt-16">
            <p className="poppins-medium text-[13px] leading-relaxed text-[#0B538D]">
              <span className="mr-4">💙</span>
              {t("payments.tipSuccessEncouragement")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipSuccessCard;
