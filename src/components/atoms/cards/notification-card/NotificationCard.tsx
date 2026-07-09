import { PrimaryTypo } from "../../typo/primaryTypo";
import { PrimaryButton } from "../../buttons/primaryButton";
import { NotificationType } from "@/utils/types/types";
import { getDateValue } from "@/hooks/hooks";
import Logo from "@/assets/images/appLogo.png";
import { SafeImage } from "@/components/atoms/images/SafeImage";
import TipSentNotificationDisplay from "./TipSentNotificationDisplay";
import {
  parseTipSentNotification,
} from "@/utils/notificationUtils";

interface Props {
  notification: NotificationType;
  onMarkAsRead: (notificationId: string) => void;
}

const NotificationCard = ({ notification, onMarkAsRead }: Props) => {
  const role =
    typeof window !== "undefined" ? localStorage.getItem("userType") : null;

  const roleClassesButton =
    role === "tp"
      ? "bg-[#0B538D] hover:bg-[#0077B6] text-white"
      : role === "sp"
        ? "bg-[#9E2A2B] hover:bg-[#ce260b] text-white"
        : "";

  const tipSentDetails =
    role === "tp" || role === "both"
      ? parseTipSentNotification(notification)
      : null;
  const showTipSentCard = Boolean(tipSentDetails);

  const processedMessage = (() => {
    let message = notification.Message || "";
    if (role === "sp") {
      const viaIndex = message.indexOf(" via ");
      if (viaIndex !== -1) {
        message = message.substring(0, viaIndex);
      }
    }
    return message;
  })();

  return (
    <div
      className={`flex items-start justify-between w-full border-b border-[#D0D0D] pb-24 gap-16 ${
        showTipSentCard && !notification.IsRead ? "pt-4" : ""
      }`}
    >
      {!showTipSentCard && (
        <div className="min-w-[55px] max-w-[55px] h-[55px] max-h-[55px] min-h-[55px]">
          <SafeImage
            className="rounded-full object-cover w-full h-full"
            src={notification.TipperProfilePictureUrl}
            fallbackSrc={Logo}
            alt=""
          />
        </div>
      )}

      <div className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="flex items-start flex-col">
            {!showTipSentCard && (
              <PrimaryTypo
                typo={notification.Title || "Notification"}
                styles="poppins-semibold !text-[13px]"
              />
            )}
          </div>
          <div className="flex items-center gap-10">
            <span className="poppins-medium text-[12px] text-[#7D7D7D] opacity-40">
              {getDateValue(notification.NotificationDate)}
            </span>
            {!notification.IsRead && (
              <PrimaryButton
                type="button"
                typo="Mark as Read"
                styles={`!text-[10px] !px-10 !py-1 !min-h-[24px] !max-h-[24px] ${roleClassesButton} poppins-medium`}
                handleOnClick={() => onMarkAsRead(notification.NotificationID)}
              />
            )}
          </div>
        </div>

        {showTipSentCard && tipSentDetails ? (
          <TipSentNotificationDisplay
            details={tipSentDetails}
            isUnread={!notification.IsRead}
          />
        ) : (
          <div className="mt-16">
            {notification.RichText ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: processedMessage || "No content available",
                }}
              />
            ) : (
              <PrimaryTypo
                typo={processedMessage || "No messages yet."}
                styles="poppins-medium !text-[12px] opacity-40 max-w-[864px]"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCard;
