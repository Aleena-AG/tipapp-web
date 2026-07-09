import { useEffect } from "react";
import ToastProvider from "@/providers/ToastProvider";
import { useLocation, useNavigate } from "react-router-dom";

const LoginSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("id_token");
    const role = queryParams.get("role");
    const userid = queryParams.get("userid");
    const email = queryParams.get("email");

    const profilePicture = queryParams.get("profilePicture");
    const firstName = queryParams.get("firstName");
    const lastName = queryParams.get("lastName");

    if (token && userid) {
      // Check if user role is "staff" and block login
      if (role === "staff") {
        ToastProvider.error(
          "This account is not authorized to access the user application. Please contact your administrator for access to the appropriate system."
        );
        navigate("/sign-in");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userid);

      if (email) {
        localStorage.setItem("email", email);
      }
      if (role === "both") {
        localStorage.setItem("displaySwitch", "true");
        localStorage.setItem("userType", "both");
      } else if (role === "sp" || role === "tp") {
        localStorage.setItem("userType", role);
      }

      if (profilePicture || firstName || lastName) {
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
      } else {
        ToastProvider.error("No Google profile data found in URL parameters");
      }

      navigate("/user-selection", { state: { role } });
    } else {
      ToastProvider.error("Login failed. Please try again.");
      navigate("/sign-in");
    }
  }, [location, navigate]);

  return <></>;
};

export default LoginSuccess;
