 
import NotificationsDetailCard from "@/components/atoms/cards/notification-details-card/notificationsDetailCard";
import SpinLoader from "@/components/atoms/laoder/spin-loader";
import { PrimaryTypo } from "@/components/atoms/typo/primaryTypo";
import NoDataFoundSection from "@/components/molecules/common/no-data-found/NoDataFoundSection";
import { getDateValue } from "@/hooks/hooks";
import { NotificationType } from "@/utils/types/types";

const NotificationsContainer = ({
  data,
  isLoading,
}: {
  data: NotificationType[];
  isLoading: boolean;
}) => {
  {/* Color role handling */ }
  const role = typeof window !== "undefined" ? localStorage.getItem("userType") : null; // "tp" | "sp" | null
  const roleClassesBorder =
    role === "tp"
      ? "sm:border sm:border-[#0B538D] sm:shadow-[0_0_15px_0_rgba(11,83,141,0.5)]"
      : role === "sp"
        ? "sm:border sm:border-[#d71921] sm:shadow-[0_0_15px_0_rgba(215,25,33,0.5)]"
        : "";

  // Helper function to process message for service providers
  const processMessage = (message: string | undefined) => {
    if (!message) return "";
    if (role === "sp") {
      // Remove everything after " via " for service providers
      const viaIndex = message.indexOf(" via ");
      if (viaIndex !== -1) {
        return message.substring(0, viaIndex);
      }
    }
    return message;
  };

  return (
    <div className={`rounded-16 sm:bg-card min-h-[704px] max-h-[704px] max-w-[843px] w-full mx-70 overflow-y-auto lg:p-32 p-20 gap-y-24 mt-8 flex flex-col sm:${roleClassesBorder}`}>
      {isLoading ? (
        <SpinLoader isLoading={isLoading} />
      ) : data.length === 0 ? (
        <>
          <div className="sticky-bg sm:bg-app-surface lg:py-32 py-20 bg-primary-hex">
            <PrimaryTypo
              typo="Notifications"
              styles="!text-[20px] poppins-semibold text-center"
            />
          </div>
          <div className="w-full h-full ">
            <NoDataFoundSection />
          </div>
        </>
      ) : (
        <>
          <PrimaryTypo
            typo="Notifications"
            styles="!text-[20px] poppins-semibold text-center"
          />
          {data.map((notification, index) => (
            <NotificationsDetailCard
              key={index}
              name={notification.Title}
              message={processMessage(notification.Message)}
              date={getDateValue(notification.NotificationDate as string)}
              imageUrl={notification.TipperProfilePictureUrl}
              richText={notification.RichText}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default NotificationsContainer;
