import { useEffect, useRef, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import RootLayout from "@/layout/rootLayout/rootLayout";
import {
  UserRoles,
  normalizeToCanonicalUserType,
  isUserRegistrationComplete,
  getRegisterRoleForUser,
} from "@/utils/constants/enums";
import authFetch from "@/api/axiosInterceptor";
import PageLoader from "@/components/atoms/laoder/page-loader";
import { useTranslation } from "react-i18next";

interface Props {
  roles: string[];
}

type RedirectTarget = {
  pathname: string;
  state?: { role: "sp" | "tp" };
};

const ProtectedRoute = ({ roles }: Props) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [redirectTo, setRedirectTo] = useState<RedirectTarget | null>(null);
  const checkIdRef = useRef(0);

  useEffect(() => {
    const checkId = ++checkIdRef.current;
    const path = location.pathname;

    setIsLoading(true);
    setIsValid(false);
    setRedirectTo(null);

    const finish = (next: {
      valid?: boolean;
      redirect?: RedirectTarget | null;
    }) => {
      if (checkId !== checkIdRef.current) return;
      if (next.redirect) {
        setRedirectTo(next.redirect);
        setIsValid(false);
      } else if (next.valid) {
        setRedirectTo(null);
        setIsValid(true);
      }
      setIsLoading(false);
    };

    const fetchUserProfile = async (): Promise<Record<string, unknown> | null> => {
      let user: Record<string, unknown> | null = null;
      try {
        const stored = localStorage.getItem("user");
        user = stored ? JSON.parse(stored) : null;
      } catch {
        user = null;
      }

      try {
        const response = await authFetch.get("/user-details/me");
        const apiUser = response.data?.data;
        if (apiUser) {
          user = { ...apiUser };
          localStorage.setItem("user", JSON.stringify(user));
        }
      } catch (error) {
        console.error("Failed to fetch user details", error);
      }

      return user;
    };

    const registrationRedirect = (
      user: Record<string, unknown> | null,
      activeUserType: string | undefined,
      fallback: "sp" | "tp"
    ): RedirectTarget => ({
      pathname: "/register",
      state: {
        role: getRegisterRoleForUser(
          user as { Role?: string },
          activeUserType,
          fallback
        ),
      },
    });

    const resolveRedirect = (
      activeUserType: string | undefined,
      canonicalFromUser: string | undefined
    ): string => {
      if (activeUserType === UserRoles.SERVICEPROVIDER) {
        return "/service-provider";
      }
      if (activeUserType === UserRoles.TIPER) {
        return "/tip-provider";
      }
      switch (canonicalFromUser) {
        case UserRoles.SERVICEPROVIDER:
          return "/service-provider";
        case UserRoles.TIPER:
          return "/tip-provider";
        case UserRoles.BOTH:
          return "/user-selection";
        default:
          return "/user-selection";
      }
    };

    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          finish({ redirect: { pathname: "/sign-in" } });
          return;
        }

        const activeUserType = normalizeToCanonicalUserType(
          localStorage.getItem("userType")
        );
        const displaySwitch =
          localStorage.getItem("displaySwitch") === "true";

        const isAccessingTipProvider = path.startsWith("/tip-provider");
        const isAccessingServiceProvider = path.startsWith("/service-provider");
        const user = await fetchUserProfile();

        if (
          (isAccessingServiceProvider || isAccessingTipProvider) &&
          !isUserRegistrationComplete(user as { FirstName?: string })
        ) {
          finish({
            redirect: registrationRedirect(
              user,
              activeUserType,
              isAccessingServiceProvider ? "sp" : "tp"
            ),
          });
          return;
        }

        // Fast path: localStorage role matches this protected route.
        if (activeUserType && roles.includes(activeUserType)) {
          finish({ valid: true });
          return;
        }

        const canonicalFromUser = normalizeToCanonicalUserType(
          user?.Role as string | undefined
        );
        const isBothRole =
          user?.Role === "both" || user?.Role === UserRoles.BOTH;

        const hasValidRole = roles.some((required) => {
          if (isBothRole || displaySwitch) {
            return required === activeUserType;
          }
          return (
            required === activeUserType ||
            required === canonicalFromUser
          );
        });

        if (hasValidRole) {
          finish({ valid: true });
          return;
        }

        if (displaySwitch && activeUserType) {
          if (
            activeUserType === UserRoles.SERVICEPROVIDER &&
            isAccessingTipProvider
          ) {
            finish({ redirect: { pathname: "/service-provider" } });
            return;
          }
          if (
            activeUserType === UserRoles.TIPER &&
            isAccessingServiceProvider
          ) {
            finish({ redirect: { pathname: "/tip-provider" } });
            return;
          }
        }

        if (isBothRole && activeUserType) {
          if (isAccessingTipProvider && activeUserType === UserRoles.SERVICEPROVIDER) {
            finish({ redirect: { pathname: "/service-provider" } });
            return;
          }
          if (isAccessingServiceProvider && activeUserType === UserRoles.TIPER) {
            finish({ redirect: { pathname: "/tip-provider" } });
            return;
          }
          finish({ redirect: { pathname: "/user-selection" } });
          return;
        }

        const target = resolveRedirect(activeUserType, canonicalFromUser);
        if (target === path) {
          finish({ valid: true });
          return;
        }
        finish({ redirect: { pathname: target } });
      } catch (error) {
        console.error("ProtectedRoute auth check failed:", error);
        finish({ redirect: { pathname: "/sign-in" } });
      }
    };

    void checkAuth();
    // Only re-check when the route path changes — do not depend on useAuth
    // callbacks (new references every render caused an infinite loading loop).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  if (redirectTo) {
    return (
      <Navigate to={redirectTo.pathname} state={redirectTo.state} replace />
    );
  }

  if (isLoading) {
    return <PageLoader message={t("common.loading")} />;
  }

  if (!isValid) {
    return <PageLoader message={t("common.redirecting")} />;
  }

  return <RootLayout />;
};

export default ProtectedRoute;
