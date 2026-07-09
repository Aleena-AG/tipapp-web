import { PrimaryTypo } from "@/components/atoms/typo/primaryTypo";
import { PrimaryButton } from "@/components/atoms/buttons/primaryButton";
import {
  useGetNotifications,
  useMarkNotificationAsRead,
} from "@/api/notifications";
import { NotificationType } from "@/utils/types/types";
import { getDateValue } from "@/hooks/hooks";
import Logo from "@/assets/images/appLogo.png";
import { useNavigate } from "react-router";
import SpinLoader from "@/components/atoms/laoder/spin-loader";
import NoDataFoundSection from "@/components/molecules/common/no-data-found/NoDataFoundSection";
import ToastProvider from "@/providers/ToastProvider";
import TipSentNotificationDisplay from "@/components/atoms/cards/notification-card/TipSentNotificationDisplay";
import {
  parseTipSentNotification,
} from "@/utils/notificationUtils";

interface Props {
  onViewAll: () => void;
}

const NotificationsDropdown = ({ onViewAll }: Props) => {
  const navigate = useNavigate();
  const role =
    typeof window !== "undefined" ? localStorage.getItem("userType") : null;

  const {
    data: notificationsData,
    isLoading,
    refetch,
  } = useGetNotifications(1, 5);

  const { mutate: markAsRead } = useMarkNotificationAsRead(
    () => {
      ToastProvider.success("Notification marked as read");
      refetch();
    },
    (error) => {
      ToastProvider.error(error);
    }
  );

  const handleNotificationClick = (notification: NotificationType) => {
    if (!notification.IsRead) {
      markAsRead(notification.NotificationID);
    }
  };

  const handleViewAll = () => {
    navigate("/notifications");
    onViewAll();
  };

  const roleClassesButton =
    role === "tp"
      ? "bg-[#0B538D] hover:bg-[#0077B6] text-white"
      : role === "sp"
        ? "bg-[#9E2A2B] hover:bg-[#ce260b] text-white"
        : "";

  const processMessage = (message: string | undefined) => {
    if (!message) return "";
    if (role === "sp") {
      const viaIndex = message.indexOf(" via ");
      if (viaIndex !== -1) {
        return message.substring(0, viaIndex);
      }
    }
    return message;
  };

  const getTipSentDetails = (notification: NotificationType) => {
    if (role !== "tp" && role !== "both") return null;
    return parseTipSentNotification(notification);
  };

  return (
    <div className="w-80 max-h-96 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-10">
          <PrimaryTypo
            typo="Notifications"
            styles="!text-[18px] poppins-semibold"
          />
          {(notificationsData?.items?.length ?? 0) > 0 && (
            <PrimaryButton
              type="button"
              typo="View All"
              styles={`!text-[12px] !px-10 !py-1 !min-h-[28px] !max-h-[28px] ${roleClassesButton} !rounded-4 poppins-medium`}
              handleOnClick={handleViewAll}
            />
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <SpinLoader isLoading={true} />
          </div>
        ) : notificationsData?.items?.length === 0 ? (
          <div className="py-8">
            <NoDataFoundSection />
          </div>
        ) : (
          <div className="space-y-4 !mt-4">
            {notificationsData?.items?.map((notification: NotificationType) => {
              const tipSentDetails = getTipSentDetails(notification);
              const showTipSentCard = Boolean(tipSentDetails);

              return (
                <div
                  key={notification.NotificationID}
                  className={`p-3 rounded-lg cursor-pointer hover:bg-gray-50 mt-4 ${
                    !notification.IsRead
                      ? showTipSentCard
                        ? "bg-gradient-to-r from-[#E8F4FC]/60 to-white border-l-4 border-[#0B538D]"
                        : "bg-gray-50 border-l-4 border-gray-400"
                      : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  {showTipSentCard && tipSentDetails ? (
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <TipSentNotificationDisplay
                          details={tipSentDetails}
                          variant="compact"
                          isUnread={!notification.IsRead}
                        />
                      </div>
                      <span className="poppins-medium text-[10px] text-[#7D7D7D] opacity-40 whitespace-nowrap shrink-0">
                        {getDateValue(notification.NotificationDate)}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <div className="min-w-[40px] max-w-[40px] h-[40px] max-h-[40px] min-h-[40px]">
                        <img
                          className="rounded-full object-cover w-full h-full"
                          src={
                            notification.TipperProfilePictureUrl
                              ? notification.TipperProfilePictureUrl
                              : Logo
                          }
                          alt=""
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <PrimaryTypo
                              typo={notification.Title || "Notification"}
                              styles={`poppins-semibold !text-[12px] ${
                                !notification.IsRead
                                  ? "text-black"
                                  : "text-gray-600"
                              }`}
                            />
                            <PrimaryTypo
                              typo={
                                processMessage(notification.Message)?.substring(
                                  0,
                                  60
                                ) +
                                  (processMessage(notification.Message)?.length >
                                  60
                                    ? "..."
                                    : "") || "No content"
                              }
                              styles="poppins-medium !text-[11px] opacity-60 mt-1"
                            />
                          </div>
                          <span className="poppins-medium text-[10px] text-[#7D7D7D] opacity-40 whitespace-nowrap">
                            {getDateValue(notification.NotificationDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsDropdown;
