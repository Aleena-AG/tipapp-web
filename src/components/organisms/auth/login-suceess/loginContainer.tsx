import { useEffect, useRef } from "react";
import ToastProvider from "@/providers/ToastProvider";
import { useLocation } from "react-router-dom";
import authFetch from "@/api/axiosInterceptor";
import { normalizeToCanonicalUserType } from "@/utils/constants/enums";
import PageLoader from "@/components/atoms/laoder/page-loader";

const POST_AUTH_ROLE_KEY = "postAuthRole";

/** Full navigation after OAuth so App boots cleanly with token already in storage. */
function redirectAfterAuth(path: string, role?: string) {
  if (role) {
    sessionStorage.setItem(POST_AUTH_ROLE_KEY, role);
  } else {
    sessionStorage.removeItem(POST_AUTH_ROLE_KEY);
  }
  window.location.replace(path);
}

const LoginSuccess = () => {
  const location = useLocation();
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    const run = async () => {
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get("id_token");
      const role = queryParams.get("role");
      const userid = queryParams.get("userid");
      const email = queryParams.get("email");
      const profilePicture = queryParams.get("profilePicture");
      const firstName = queryParams.get("firstName");
      const lastName = queryParams.get("lastName");

      if (!token || !userid) {
        ToastProvider.error("Login failed. Please try again.");
        redirectAfterAuth("/sign-in");
        return;
      }

      if (role === "staff") {
        ToastProvider.error(
          "This account is not authorized to access the user application. Please contact your administrator for access to the appropriate system."
        );
        redirectAfterAuth("/sign-in");
        return;
      }

      // Persist session from OAuth callback (OTP not required)
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userid);
      localStorage.setItem("selectedCurrency", "GBP");

      if (email) {
        localStorage.setItem("email", email);
      }

      if (profilePicture || firstName || lastName || email) {
        localStorage.setItem(
          "googleProfileData",
          JSON.stringify({
            firstName: firstName || "",
            lastName: lastName || "",
            fullName: `${firstName || ""} ${lastName || ""}`.trim(),
            profilePictureUrl: profilePicture || undefined,
            email: email || "",
            emailVerified: true,
          })
        );
      }

      // New OAuth user: pick tipper / SP, then complete profile (no OTP)
      if (role === "not_registered") {
        localStorage.removeItem("userType");
        localStorage.removeItem("displaySwitch");
        redirectAfterAuth("/user-selection", "not_registered");
        return;
      }

      const canonicalRole = normalizeToCanonicalUserType(role) || role || "";

      if (canonicalRole === "both") {
        localStorage.setItem("displaySwitch", "true");
        localStorage.setItem("userType", "both");
      } else if (canonicalRole === "sp" || canonicalRole === "tp") {
        localStorage.setItem("userType", canonicalRole);
        localStorage.removeItem("displaySwitch");
      }

      // Returning user: hydrate profile then go home / complete registration
      try {
        const response = await authFetch.get("/user-details/me");
        const user = response?.data?.data;

        if (user) {
          localStorage.setItem("user", JSON.stringify(user));

          // Use DB FirstName only — OAuth name must not skip profile complete
          if (!user.FirstName?.trim()) {
            const registerRole =
              canonicalRole === "sp" || canonicalRole === "tp"
                ? canonicalRole
                : "tp";
            redirectAfterAuth("/register", registerRole);
            return;
          }
        }
      } catch (error) {
        console.error("Failed to load user after OAuth login:", error);
      }

      redirectAfterAuth("/user-selection", canonicalRole || role || undefined);
    };

    void run();
  }, [location.search]);

  return <PageLoader />;
};

export default LoginSuccess;
export { POST_AUTH_ROLE_KEY };
