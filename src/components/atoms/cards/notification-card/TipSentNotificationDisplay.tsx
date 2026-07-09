import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ProfileAvatar } from "@/components/atoms/images/ProfileAvatar";
import { PrimaryTypo } from "@/components/atoms/typo/primaryTypo";
import { formatNumber } from "@/hooks/formatters";
import { TipSentDetails } from "@/utils/notificationUtils";

interface Props {
  details: TipSentDetails;
  variant?: "full" | "compact";
  isUnread?: boolean;
}

const TipSentNotificationDisplay = ({
  details,
  variant = "full",
  isUnread = false,
}: Props) => {
  const { t } = useTranslation();
  const formattedAmount = formatNumber(
    details.amount,
    true,
    1,
    details.currency
  );

  if (variant === "compact") {
    return (
      <div
        className={`flex items-start gap-3 rounded-lg p-2 -m-2 ${
          isUnread ? "bg-gradient-to-r from-[#E8F4FC] to-[#F5FAFF]" : ""
        }`}
      >
        <div className="relative shrink-0">
          <ProfileAvatar
            src={details.profileImageUrl}
            alt={details.recipientName}
            className="h-10 w-10"
          />
          <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#0B538D] text-white">
            <Sparkles className="h-2.5 w-2.5" />
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="poppins-semibold text-[12px] text-[#0B538D]">
            {t("notifications.tipSentTitle")}
          </p>
          <p className="poppins-semibold text-[13px] text-black mt-0.5">
            {formattedAmount}
            <span className="poppins-medium text-[11px] text-[#5A5A5A] font-normal">
              {" "}
              {t("notifications.tipSentTo", { name: details.recipientName })}
            </span>
          </p>
          <p className="poppins-medium text-[10px] text-[#7D7D7D] mt-0.5">
            {t("notifications.tipSentEncouragement")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-12 p-16 mt-12 border ${
        isUnread
          ? "bg-gradient-to-br from-[#E8F4FC] via-[#F5FAFF] to-white border-[#0B538D]/20"
          : "bg-[#FAFAFA] border-[#E8E8E8]"
      }`}
    >
      <div className="flex items-center gap-12">
        <div className="relative shrink-0">
          <ProfileAvatar
            src={details.profileImageUrl}
            alt={details.recipientName}
            className="h-[52px] w-[52px] ring-2 ring-[#0B538D]/15"
          />
          <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#0B538D] text-white shadow-sm">
            <Sparkles className="h-3 w-3" />
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-6">
            <Sparkles className="h-4 w-4 text-[#0B538D] shrink-0" />
            <PrimaryTypo
              typo={t("notifications.tipSentTitle")}
              styles="poppins-semibold !text-[14px] text-[#0B538D]"
            />
          </div>

          <p className="poppins-semibold text-[22px] text-[#0B538D] mt-8 leading-tight">
            {formattedAmount}
          </p>

          <p className="poppins-medium text-[13px] text-[#333] mt-4">
            {t("notifications.tipSentTo", { name: details.recipientName })}
          </p>

          <p className="poppins-medium text-[11px] text-[#7D7D7D] mt-4">
            {t("notifications.tipSentVia", {
              method: details.paymentMethod,
            })}
          </p>
        </div>
      </div>

      <p className="poppins-medium text-[12px] text-[#0B538D]/80 mt-14 pt-12 border-t border-[#0B538D]/10 text-center">
        {t("notifications.tipSentEncouragement")}
      </p>
    </div>
  );
};

export default TipSentNotificationDisplay;
