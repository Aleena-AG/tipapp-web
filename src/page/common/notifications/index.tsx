import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import {
  useGetNotifications,
  useMarkNotificationAsRead,
} from "@/api/notifications";
import NotificationCard from "@/components/atoms/cards/notification-card/NotificationCard";
import NoDataFoundSection from "@/components/molecules/common/no-data-found/NoDataFoundSection";
import SpinLoader from "@/components/atoms/laoder/spin-loader";
import { PrimaryButton } from "@/components/atoms/buttons/primaryButton";
import ToastProvider from "@/providers/ToastProvider";

const Notifications = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;
  const navigate = useNavigate();

  const {
    data: notificationsData,
    isLoading,
    refetch,
  } = useGetNotifications(currentPage, limit);

  const { mutate: markAsRead } = useMarkNotificationAsRead(
    () => {
      ToastProvider.success("Notification marked as read");
      refetch();
    },
    (error) => {
      ToastProvider.error(error);
    }
  );

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId);
  };

  const handleNextPage = () => {
    if (
      (notificationsData?.meta?.currentPage ?? 0) <
      (notificationsData?.meta?.totalPages ?? 0)
    ) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  {/* Color role handling */ }
  const role = typeof window !== "undefined" ? localStorage.getItem("userType") : null; // "tp" | "sp" | null
  const roleClassesBorder =
    role === "tp"
      ? "sm:border sm:border-[#0B538D] sm:shadow-[0_0_15px_0_rgba(11,83,141,0.5)]"
      : role === "sp"
        ? "sm:border sm:border-[#d71921] sm:shadow-[0_0_15px_0_rgba(215,25,33,0.5)]"
        : "";


  return (
    <div className="bg-primary-hex xl:min-h-screen pt-26 pb-80">
      <div className="flex mx-auto w-full justify-center md:p-20 xl:p-0">
        <div className={`rounded-16 sm:bg-white min-h-[704px] max-h-[704px] max-w-[843px] w-full mx-70 overflow-y-auto lg:p-32 p-20 gap-y-24 mt-8 flex flex-col sm:${roleClassesBorder}`}>
          
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 translation-colors duration-200">
              <FaArrowLeft className="text-sm" />
              <span className="text-sm poppins-medium">Back</span>
            </button>
            <h1 className="text-[28px] text-black font-[600]">Notifications</h1>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <SpinLoader isLoading={true} />
            </div>
          ) : notificationsData?.items?.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <NoDataFoundSection />
            </div>
          ) : (
            <>
              <div className="flex-1 space-y-4">
                {notificationsData?.items?.map((notification) => (
                  <NotificationCard
                    key={notification.NotificationID}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                  />
                ))}
              </div>

              {/* Pagination */}
              {(notificationsData?.meta?.totalPages ?? 0) > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Page {notificationsData?.meta?.currentPage ?? 0} of{" "}
                    {notificationsData?.meta?.totalPages ?? 0}(
                    {notificationsData?.meta?.totalItems ?? 0} total
                    notifications)
                  </div>
                  <div className="flex gap-2">
                    <PrimaryButton
                      type="button"
                      typo="Previous"
                      styles="!px-4 !py-2 !bg-gray-500 !text-white !rounded-4 poppins-medium disabled:opacity-50"
                      handleOnClick={handlePrevPage}
                      isDisable={currentPage === 1}
                    />
                    <PrimaryButton
                      type="button"
                      typo="Next"
                      styles="!px-4 !py-2 !bg-black !text-white !rounded-4 poppins-medium disabled:opacity-50"
                      handleOnClick={handleNextPage}
                      isDisable={
                        currentPage >=
                        (notificationsData?.meta?.totalPages ?? 0)
                      }
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
