import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "@/layout/rootLayout/navbar";
import Footer from "@/layout/rootLayout/footer";
import { useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { isUserRegistrationComplete, getRegisterRoleForUser } from "@/utils/constants/enums";

const RootLayout = () => {
  const { getCurrentUser, getToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkProfile = async () => {
      const token = await getToken();
      if (!token) return;

      const user = await getCurrentUser();
      if (
        isUserRegistrationComplete(user) ||
        user?.Role === "both" ||
        user?.Role === "unknown"
      ) {
        return;
      }

      const path = location.pathname;
      const allowedPaths = [
        "/user-selection",
        "/sign-in",
        "/sign-up",
        "/login-success",
        "/register",
        "/my-profile",
        "/verify-signup-otp",
        "/verify-otp",
        "/forgot-password",
        "/reset-password",
      ];

      if (allowedPaths.some((p) => path === p || path.startsWith(`${p}/`))) {
        return;
      }

      const userType = localStorage.getItem("userType");
      navigate("/register", {
        replace: true,
        state: {
          role: getRegisterRoleForUser(user, userType, "tp"),
        },
      });
    };

    checkProfile();
  }, [location.pathname, getCurrentUser, getToken, navigate]);

  const hideChromeRoutes = [
    "/sign-in",
    "/sign-up",
    "/user-selection",
    "/verify-signup-otp",
  ];
  const hideChrome = hideChromeRoutes.some(
    (p) => location.pathname === p || location.pathname.startsWith(`${p}/`)
  );

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {!hideChrome && <Navbar />}
      <main className={`flex flex-col flex-grow ${hideChrome ? "min-h-screen" : ""}`}>
        <Outlet />
      </main>
      {!hideChrome && <Footer />}
    </div>
  );
};

export default RootLayout;
