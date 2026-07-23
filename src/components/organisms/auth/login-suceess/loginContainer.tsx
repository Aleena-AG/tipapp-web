import { useEffect, useRef } from "react";
import ToastProvider from "@/providers/ToastProvider";
import { useLocation, useNavigate } from "react-router-dom";
import authFetch from "@/api/axiosInterceptor";
import { normalizeToCanonicalUserType } from "@/utils/constants/enums";

const LoginSuccess = () => {
  const navigate = useNavigate();
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
        navigate("/sign-in", { replace: true });
        return;
      }

      if (role === "staff") {
        ToastProvider.error(
          "This account is not authorized to access the user application. Please contact your administrator for access to the appropriate system."
        );
        navigate("/sign-in", { replace: true });
        return;
      }

      // Persist session from Google OAuth callback (OTP not required)
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

      // New Google user: pick tipper / SP, then complete profile (no OTP)
      if (role === "not_registered") {
        localStorage.removeItem("userType");
        localStorage.removeItem("displaySwitch");
        navigate("/user-selection", {
          replace: true,
          state: { role: "not_registered" },
        });
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

          // Use DB FirstName only — Google OAuth name must not skip profile complete
          if (!user.FirstName?.trim()) {
            navigate("/register", {
              replace: true,
              state: {
                role:
                  canonicalRole === "sp" || canonicalRole === "tp"
                    ? canonicalRole
                    : "tp",
              },
            });
            return;
          }
        }
      } catch (error) {
        console.error("Failed to load user after Google login:", error);
      }

      navigate("/user-selection", {
        replace: true,
        state: { role: canonicalRole || role },
      });
    };

    void run();
  }, [location.search, navigate]);

  return null;
};

export default LoginSuccess;
