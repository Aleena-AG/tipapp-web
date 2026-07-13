import { useEffect } from "react";
import { useAddDeviceToken } from "@/api/notifications";
import ToastProvider from "@/providers/ToastProvider";
import { generateToken } from "@/firebase/firebaseConfig";
export function useNotificationToken() {
  const onSuccess = () => {
    ToastProvider.success("Device token generated successfully");
  };

  const onError = (error: string) => {
    ToastProvider.error(error || "An error occurred. Please try again.");
  };
  const { mutate: addDeviceToken } = useAddDeviceToken(onSuccess, onError);

  useEffect(() => {
    let isMounted = true; // Flag to track component mounting state

    async function getToken() {
      const notificationToken = localStorage.getItem("notification_token");
      if (!notificationToken) {
        const token = await generateToken();

        if (isMounted && token) {
          //   await registerDevice("token", token, "WEB");
          localStorage.setItem("notification_token", token);
          addDeviceToken({
            token: "token",
            deviceUniqueId: token,
            deviceType: "WEB",
          });
        }
      }
    }

    void getToken();

    // Cleanup function to cancel any pending tasks when component unmounts
    return () => {
      isMounted = false; // Mark component as unmounted
    };
  }, [addDeviceToken]);
}
