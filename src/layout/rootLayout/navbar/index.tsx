/* eslint-disable @typescript-eslint/no-explicit-any */
import { authRoutes, RoutePaths } from "@/routes/routes";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../../../components/ui/navigation-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { MenuIcon } from "lucide-react";
import ThemeToggle from "@/components/molecules/common/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import React, { useEffect, useState } from "react";
import ProfileIcon from "@/assets/svg/profile-icon.svg";
import SignOutIcon from "@/assets/svg/sign-out-icon.svg";
import { useNavigate, useLocation } from "react-router";
import useAuth from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import BellIcon from "@/assets/svg/bellIcon.svg";
import {
  getRoleAvatarFallback,
  getRoleNavLogo,
  resolveProfileImageSrc,
} from "@/utils/imageUtils";
import { useUser } from "@/contexts/UserContext";
import { useGetNotifications } from "@/api/notifications";
import NotificationsDropdown from "@/components/organisms/common/notifications-dropdown/NotificationsDropdown";
import { handleScrollTop } from "@/hooks/hooks";
import SignOutConfirmation from "@/assets/svg/sign-out-secondary.svg";
import { getUserFromLocalStorage } from "@/utils/localStorageUtils";

export const Navbar = () => {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true);
  const [showSignOutConfirmation, setShowSignOutConfirmation] = useState(false);
  const [showSignInConfirmation, setShowSignInConfirmation] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  // const [isScrolled, setIsScrolled] = useState(false);
  const [, setIsScrolled] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const navigate = useNavigate();
  const location = useLocation();
  const handleNavigateProfile = () => {
    navigate("/my-profile");
  };
  const { handleLogout } = useAuth();
  const { userDetails } = useUser();
  const { data: notificationsData } = useGetNotifications(1, 10);

  useEffect(() => {
    // Try to get user data from localStorage first, fallback to API context
    const localUserData = getUserFromLocalStorage();
    if (localUserData) {
      setCurrentUser(localUserData);
    } else {
      setCurrentUser(userDetails);
    }
  }, [userDetails]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const userType = localStorage.getItem("userType");

  const handleNavigation = (path: string) => {
    if (path === "home") {
      if (userType === "tp") {
        navigate("/tip-provider");
      } else if (userType === "sp") {
        navigate("/service-provider");
      } else if (userType === "both") {
        navigate("/user-selection");
      }
    } else if (path === "about") {
      navigate("/about-us");
    } else if (path === "contact") {
      navigate("/contact-us");
    } else if (path === "how-it-works") {
      navigate("/how-it-works");
    } else {
      // Handle other navigation cases if needed
      navigate(path);
    }
  };

  const isAuthRoute = authRoutes.includes(location.pathname);
  const isRegisterPage = location.pathname === "/register";
  // const isProfilePage = location.pathname === "/my-profile";
  const isProfilePage = false;
  const isUserSelectionPage = location.pathname === "/user-selection";
  const isForgotPasswordPage = location.pathname === "/forgot-password";
  const isVerifyOtpPage = location.pathname === "/verify-otp";
  const isResetPasswordPage = location.pathname === "/reset-password";

  const unreadCount =
    notificationsData?.items?.filter(
      (notification: any) => !notification.IsRead
    )?.length ?? 0;

  const isNavLinkActive = (path: { navigate?: string; link?: string }) => {
    const key = path.navigate || path.link || "";
    const pathname = location.pathname;

    if (key === "home") {
      return (
        pathname === "/tip-provider" ||
        pathname === "/service-provider" ||
        pathname === "/"
      );
    }
    if (key === "about") return pathname.includes("about");
    if (key === "contact") return pathname.includes("contact");
    if (key === "how-it-works") return pathname.includes("how-it-works");
    return false;
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    return !!(token && userType);
  };

  const handleSignOutClick = () => {
    setIsMobileMenuOpen(false);
    setShowSignOutConfirmation(true);
  };

  const handleConfirmSignIn = () => {
    setShowSignInConfirmation(false);
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
    navigate("/sign-in");
    handleScrollTop();
  };


  {/* Navbar color role handling */ }
  const role = typeof window !== "undefined" ? localStorage.getItem("userType") : null; // "tp" | "sp" | null

  const roleNavClasses =
    role === "tp"
      ? "bg-[#0B538D] shadow-[0_4px_20px_rgba(11,83,141,0.35)] dark:bg-[#0A4A7A] dark:shadow-[0_4px_24px_rgba(0,0,0,0.45)]"
      : role === "sp"
        ? "bg-[#9E2A2B] shadow-[0_4px_20px_rgba(158,42,43,0.35)] dark:bg-[#8A2425] dark:shadow-[0_4px_24px_rgba(0,0,0,0.45)]"
        : "";

  const roleClassesBorder =
    role === "tp"
      ? "sm:border sm:border-[#0B538D] sm:shadow-[0_0_15px_0_rgba(11,83,141,0.5)] dark:sm:border-[#3B82F6]/40"
      : role === "sp"
        ? "sm:border sm:border-[#d71921] sm:shadow-[0_0_15px_0_rgba(215,25,33,0.5)] dark:sm:border-red-400/40"
        : "";

  const navLogo = getRoleNavLogo(role);
  const avatarFallback = getRoleAvatarFallback(role);
  const avatarSrc = resolveProfileImageSrc(
    currentUser?.ProfilePictureURL,
    avatarFallback
  );
  const hasRoleNav = Boolean(roleNavClasses);

  /** Dull gold ring on profile avatar */
  const goldRingOffset = hasRoleNav
    ? role === "sp"
      ? "ring-offset-[#9E2A2B] dark:ring-offset-[#8A2425]"
      : "ring-offset-[#0B538D] dark:ring-offset-[#0A4A7A]"
    : "ring-offset-white dark:ring-offset-[#010816]";

  const renderNavbarAvatar = (className = "", withGoldBorder = true) => {
    const avatar = (
      <Avatar
        className={`h-11 w-11 shrink-0 overflow-hidden sm:h-12 sm:w-12 ${className}`}
      >
        <AvatarImage
          src={avatarSrc}
          alt="Profile"
          className="h-full w-full object-cover scale-110"
        />
        <AvatarFallback className="bg-transparent p-0">
          <img
            src={avatarFallback}
            alt=""
            className="h-full w-full object-cover scale-110"
          />
        </AvatarFallback>
      </Avatar>
    );

    if (!withGoldBorder) return avatar;

    return (
      <span
        className={`relative inline-flex shrink-0 rounded-full ring-[2.5px] ring-[#E8B923] ring-offset-2 ${goldRingOffset}`}
        style={{ boxShadow: "0 0 0 1px rgba(232, 185, 35, 0.55)" }}
      >
        {avatar}
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#22C55E] dark:border-[#0a1629]" />
      </span>
    );
  };

  const notificationRingColor =
    role === "sp" ? "ring-[#9E2A2B]" : "ring-[#0B538D]";

  const getNavLinkClass = (active: boolean) => {
    if (hasRoleNav) {
      return active
        ? role === "sp"
          ? "bg-[#7A1F20] text-white shadow-[0_0_18px_rgba(0,0,0,0.25)] hover:bg-[#7A1F20]"
          : "bg-[#083A63] text-white shadow-[0_0_18px_rgba(0,0,0,0.25)] hover:bg-[#083A63]"
        : "text-white/90 hover:bg-white/10 hover:text-white";
    }
    return active
      ? role === "sp"
        ? "bg-[#9E2A2B] text-white shadow-[0_0_16px_rgba(158,42,43,0.35)] hover:bg-[#9E2A2B]"
        : "bg-[#0B538D] text-white shadow-[0_0_16px_rgba(11,83,141,0.35)] hover:bg-[#0B538D] dark:bg-[#2563EB] dark:hover:bg-[#2563EB]"
      : "text-[#141414] hover:bg-[#E8F2FA] dark:text-white dark:hover:bg-white/10";
  };

  const handleLogoClick = () => {
    if (isAuthenticated()) {
      handleNavigation("home");
    }
    handleScrollTop();
  };

  const showDesktopNav =
    isAuthenticated() &&
    !isRegisterPage &&
    !isProfilePage &&
    !isUserSelectionPage &&
    !isForgotPasswordPage &&
    !isVerifyOtpPage &&
    !isResetPasswordPage;

  return (
    <div
      className={`sticky-navbar relative z-40 flex min-h-[72px] w-full items-center gap-12 px-5 sm:px-8 lg:px-10 ${roleNavClasses} ${
        !hasRoleNav
          ? "border-b border-[#E4EAF2] bg-white/95 backdrop-blur-md dark:border-white/10 dark:bg-[#010816]/95"
          : ""
      }`}
    >
      {/* Left: Logo */}
      <button
        type="button"
        onClick={handleLogoClick}
        className="shrink-0 rounded-lg transition-opacity hover:opacity-90"
        aria-label="Home"
      >
        <img
          src={navLogo}
          className="h-[64px] w-[64px] rounded-xl object-cover shadow-sm sm:h-[70px] sm:w-[70px]"
          alt="tip-app-logo"
        />
      </button>

      {/* Center: Nav links */}
      <div className="hidden min-w-0 flex-1 justify-center md:flex">
        <NavigationMenu className="w-fit">
          <NavigationMenuList className="flex items-center gap-4 lg:gap-8">
            {showDesktopNav &&
              RoutePaths.map((path) => {
                if (path.name === "Home" && !isAuthenticated()) {
                  return null;
                }
                const active = isNavLinkActive(path);

                return (
                  <NavigationMenuItem key={path.name}>
                    {!isAuthRoute ? (
                      <NavigationMenuLink
                        className={`${navigationMenuTriggerStyle()} ${getNavLinkClass(active)} rounded-full px-18 py-10 text-[16px] poppins-medium lg:px-20 lg:text-[17px]`}
                        onClick={() => {
                          handleNavigation(
                            path?.navigate || (path?.link as string)
                          );
                          handleScrollTop();
                        }}
                      >
                        {t(path.name)}
                      </NavigationMenuLink>
                    ) : (
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                        onClick={() => {
                          handleScrollTop();
                          handleNavigation(
                            (path?.navigate as string) || (path.link as string)
                          );
                        }}
                      >
                        {t(path.name)}
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                );
              })}
            {isForgotPasswordPage && (
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} text-black dark:text-white`}
                  onClick={() => {
                    navigate("/sign-in");
                    handleScrollTop();
                  }}
                >
                  Sign In
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
            {!isAuthenticated() && !isAuthRoute && !isUserSelectionPage && (
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} text-black dark:text-white`}
                  onClick={() => {
                    navigate("/sign-in");
                    handleScrollTop();
                  }}
                >
                  Sign In
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Right: actions */}
      <div className="ml-auto flex items-center gap-8 sm:gap-10 lg:gap-12">
        <ThemeToggle variant={hasRoleNav ? "onColor" : "default"} />
        {!isAuthRoute && isAuthenticated() && !isProfilePage && (
          <>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                    hasRoleNav
                      ? "hover:bg-white/10"
                      : "hover:bg-[#E8F2FA] dark:hover:bg-white/10"
                  }`}
                  aria-label="Notifications"
                >
                  {unreadCount > 0 && (
                    <span
                      className={`absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#EF4444] px-4 text-[10px] font-bold leading-none text-white ring-2 ${
                        hasRoleNav
                          ? role === "sp"
                            ? "ring-[#9E2A2B] dark:ring-[#8A2425]"
                            : "ring-[#0B538D] dark:ring-[#0A4A7A]"
                          : `${notificationRingColor} dark:ring-[#010816]`
                      }`}
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                  <img
                    src={BellIcon}
                    alt="notification icon"
                    className={`h-[22px] w-[22px] ${
                      hasRoleNav
                        ? "brightness-0 invert"
                        : "dark:brightness-0 dark:invert"
                    }`}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className={`w-auto -translate-x-2 transform px-12 pt-8 mt-15 ${roleClassesBorder}`}
              >
                <NotificationsDropdown onViewAll={() => {}} />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger
                asChild
                className="hidden md:block hover:cursor-pointer"
              >
                {renderNavbarAvatar("hover:cursor-pointer", true)}
              </PopoverTrigger>
              <PopoverContent className="mt-15 w-full -translate-x-2 transform px-12 pt-8 dark:border-white/10 dark:bg-[#0a1629] dark:shadow-[0_0_20px_0_rgba(215,25,33,0.35)]">
                <div className="flex flex-col gap-7">
                  <div className="flex items-center gap-12">
                    {renderNavbarAvatar("", true)}
                    <div className="flex flex-col">
                      <div className="text-[#144524] text-[14px] poppins-semibold leading-[29px] dark:text-white">
                        {currentUser?.FirstName} {currentUser?.LastName}
                      </div>
                      <div className="text-sm text-[#000] poppins-medium leading-normal opacity-40 dark:text-slate-400 dark:opacity-100">
                        {currentUser?.Role === "tp" && "Tip Provider"}
                        {currentUser?.Role === "sp" &&
                          t("userSelection.serviceProvider")}
                        {currentUser?.Role === "both" &&
                          userType === "sp" &&
                          "Service Provider"}
                        {currentUser?.Role === "both" &&
                          userType === "tp" &&
                          "Tip Provider"}
                      </div>
                    </div>
                  </div>
                  <div className="h-px w-full bg-[#D9D9D9] dark:bg-white/10" />
                </div>
                <div className="flex w-full flex-col items-start gap-10 px-20 pb-17 pt-14">
                  <div
                    className="flex cursor-pointer items-center gap-7 duration-300 hover:scale-95"
                    onClick={() => {
                      handleScrollTop();
                      handleNavigateProfile();
                    }}
                  >
                    <img
                      src={ProfileIcon}
                      alt=""
                      className="dark:brightness-0 dark:invert"
                    />
                    <div className="text-[14px] poppins-medium leading-[29px] text-[#144524] dark:text-white">
                      {t("profile.profileSettings")}
                    </div>
                  </div>
                  <div
                    className="flex cursor-pointer items-center gap-12 duration-300 hover:scale-95"
                    onClick={() => {
                      handleScrollTop();
                      handleSignOutClick();
                    }}
                  >
                    <img
                      src={SignOutIcon}
                      alt=""
                      className="dark:brightness-0 dark:invert"
                    />
                    <div className="text-[14px] poppins-medium leading-[29px] text-[#144524] dark:text-white">
                      {t("buttons.signOut")}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </>
        )}
        {/* Show only profile image on profile page */}
        {!isAuthRoute && isAuthenticated() && isProfilePage && (
          <Popover>
            <PopoverTrigger asChild className="hidden lg:block hover:cursor-pointer">
              {renderNavbarAvatar("hover:cursor-pointer", true)}
            </PopoverTrigger>
            <PopoverContent className="mt-15 w-full -translate-x-2 transform px-12 pt-8 dark:border-white/10 dark:bg-[#0a1629] dark:shadow-[0_0_20px_0_rgba(215,25,33,0.35)]">
              <div className="flex flex-col gap-7">
                <div className="flex items-center gap-12">
                  {renderNavbarAvatar("", true)}
                  <div className="flex flex-col">
                    <div className="text-[#144524] text-[14px] poppins-semibold leading-[29px] dark:text-white">
                      {currentUser?.FirstName} {currentUser?.LastName}
                    </div>
                    <div className="text-sm text-[#000] poppins-medium leading-normal opacity-40 dark:text-slate-400 dark:opacity-100">
                      {currentUser?.Role === "tp" && "Tip Provider"}
                      {currentUser?.Role === "sp" && "Service Provider"}
                      {currentUser?.Role === "both" &&
                        userType === "sp" &&
                        "Service Provider"}
                      {currentUser?.Role === "both" &&
                        userType === "tp" &&
                        "Tip Provider"}
                    </div>
                  </div>
                </div>
                <div className="h-px bg-[#D9D9D9] w-full dark:bg-white/10" />
              </div>
              <div className="flex items-start w-full flex-col px-20 pt-14 pb-17 gap-10">
                <div
                  className="flex items-center hover:scale-95 duration-300 gap-7 hover:cursor-pointer"
                  onClick={() => {
                    handleScrollTop();
                    handleNavigateProfile();
                  }}
                >
                  <img
                    src={ProfileIcon}
                    alt=""
                    className="dark:brightness-0 dark:invert"
                  />
                  <div className="text-[14px] poppins-medium leading-[29px] text-[#144524] dark:text-white">
                    {t("profile.profileSettings")}
                  </div>
                </div>
                <div
                  className="flex items-center hover:scale-95 duration-300 gap-12  hover:cursor-pointer"
                  onClick={() => {
                    handleScrollTop();
                    handleSignOutClick();
                  }}
                >
                  <img
                    src={SignOutIcon}
                    alt=""
                    className="dark:brightness-0 dark:invert"
                  />
                  <div className="text-[14px] poppins-medium leading-[29px] text-[#144524] dark:text-white">
                    {t("buttons.signOut")}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
        <div className="lg:hidden block">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={toggleMobileMenu}
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                  hasRoleNav
                    ? "bg-white/15 hover:bg-white/25"
                    : "bg-[#E8F2FA] hover:bg-[#D6E6F3] dark:bg-white/10 dark:hover:bg-white/15"
                }`}
                aria-label="Open menu"
              >
                <MenuIcon className={`lg:hidden ${hasRoleNav ? "text-white" : "text-[#0B538D] dark:text-[#93C5FD]"}`} />
              </button>
            </DropdownMenuTrigger>
            {isMobileMenuOpen && (
              <DropdownMenuContent className="w-56 mr-10 transform translate-y-4 px-10 z-[100] dark:border-white/10 dark:bg-[#0a1629] dark:text-white">
                {!isAuthRoute && isAuthenticated() && (
                  <>
                    <DropdownMenuGroup className="">
                      <DropdownMenuLabel className="poppins-regular text-xs">
                        <div className="flex items-center gap-7">
                          {renderNavbarAvatar("", true)}
                          <div className="flex flex-col">
                            <div className="text-xs poppins-medium leading-[29px] text-[#144524] dark:text-white">
                              {currentUser?.FirstName} {currentUser?.LastName}
                            </div>
                            <div className="text-xs text-[#000] poppins-medium leading-normal opacity-40 dark:text-slate-400 dark:opacity-100">
                              {currentUser?.Role === "tp" && "Tip Provider"}
                              {currentUser?.Role === "sp" &&
                                t("userSelection.serviceProvider")}
                              {currentUser?.Role === "both" &&
                                userType === "sp" &&
                                "Service Provider"}
                              {currentUser?.Role === "both" &&
                                userType === "tp" &&
                                "Tip Provider"}
                            </div>
                          </div>
                        </div>
                      </DropdownMenuLabel>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="dark:bg-white/10" />
                  </>
                )}
                {!isRegisterPage &&
                  !isProfilePage &&
                  !isUserSelectionPage &&
                  !isForgotPasswordPage &&
                  RoutePaths.map((path) => {
                    // Hide "Home" link for unauthenticated users
                    if (path.name === "Home" && !isAuthenticated()) {
                      return null;
                    }

                    return (
                      <React.Fragment key={path.name}>
                        <DropdownMenuItem
                          key={path.name}
                          className="poppins-regular text-xs dark:text-white dark:focus:bg-white/10"
                          onClick={() =>
                            handleNavigation(
                              path?.navigate || (path.link as string)
                            )
                          }
                        >
                          {t(path.name)}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="dark:bg-white/10" />
                      </React.Fragment>
                    );
                  })}
                {/* Show Sign In link only on forgot password page in mobile menu */}
                {isForgotPasswordPage && (
                  <>
                    <DropdownMenuItem
                      className="poppins-regular text-xs dark:text-white dark:focus:bg-white/10"
                      onClick={() => {
                        navigate("/sign-in");
                        handleScrollTop();
                      }}
                    >
                      Sign In
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="dark:bg-white/10" />
                  </>
                )}
                {/* Add Sign In link for unauthenticated users in mobile menu (but not on auth pages) */}
                {!isAuthenticated() && !isAuthRoute && !isUserSelectionPage && (
                  <>
                    <DropdownMenuItem
                      className="poppins-regular text-xs dark:text-white dark:focus:bg-white/10"
                      onClick={() => {
                        navigate("/sign-in");
                        handleScrollTop();
                      }}
                    >
                      Sign In
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="dark:bg-white/10" />
                  </>
                )}
                {!isAuthRoute && isAuthenticated() && (
                  <>
                    <div
                      className="flex items-center hover:scale-95 duration-300 gap-7 hover:cursor-pointer"
                      onClick={() => {
                        handleNavigateProfile();
                      }}
                    >
                      <img
                        src={ProfileIcon}
                        alt=""
                        className="dark:brightness-0 dark:invert"
                      />
                      <div className="text-xs poppins-medium leading-[29px] text-[#144524] dark:text-white">
                        {t("profile.profileSettings")}
                      </div>
                    </div>
                    <div
                      className="flex items-center hover:scale-95 duration-300 gap-12  hover:cursor-pointer"
                      onClick={handleSignOutClick}
                    >
                      <img
                        src={SignOutIcon}
                        alt=""
                        className="dark:brightness-0 dark:invert"
                      />
                      <div className="text-xs poppins-medium leading-[29px] text-[#144524] dark:text-white">
                        {t("buttons.signOut")}
                      </div>
                    </div>
                  </>
                )}
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </div>
      </div>

      <AlertDialog
        open={showSignOutConfirmation}
        onOpenChange={setShowSignOutConfirmation}
      >
        <AlertDialogContent className="z-[9999] w-full max-w-[350px] rounded-xl bg-card md:max-w-[500px] lg:max-w-[650px] lg:p-8 dark:bg-[#0a1629] dark:border-white/10">
          <div className="relative">
            <div className="absolute transform bg-card p-8 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 max-w-[84.363px] min-h-[84.363px] mih-h-[84.363px] max-h-[84.363px] h-full w-full rounded-full dark:bg-[#0a1629]">
              <div className="bg-black h-full w-full rounded-full justify-center items-center flex">
                <img src={SignOutConfirmation} alt="Confirmation" />
              </div>
            </div>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle className="pt-87 max-lg:pt-56 poppins-semibold text-[25px] max-lg:text-[19px] leading-normal text-center text-foreground dark:!text-white">
              Are you sure ?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-black opacity-50 poppins-semibold text-[20px] max-lg:text-[15px] text-center max-w-[374px] mx-auto dark:!text-slate-400 dark:opacity-100">
              Are you sure you want to Sign out?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <div className="pt-30 flex flex-col gap-8 justify-center items-center mx-auto pb-46">
              <AlertDialogAction
                className="lg:min-w-[328px] max-lg:min-w-[200px] max-w-[328px] mih-h-[48px] max-h-[48px] rounded-8 !text-white"
                onClick={() => {
                  handleScrollTop();
                  handleLogout();
                }}
              >
                Yes
              </AlertDialogAction>
              <AlertDialogCancel className="lg:min-w-[328px] max-lg:min-w-[200px] max-w-[328px] mih-h-[48px] max-h-[48px] rounded-8 border border-black dark:border-white/30 dark:!text-slate-200">
                No
              </AlertDialogCancel>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Sign In Confirmation Modal */}
      <AlertDialog
        open={showSignInConfirmation}
        onOpenChange={setShowSignInConfirmation}
      >
        <AlertDialogContent className="z-[9999] w-full max-w-[350px] rounded-xl bg-card md:max-w-[500px] lg:max-w-[650px] lg:p-8 dark:bg-[#0a1629] dark:border-white/10">
          <div className="relative">
            <div className="absolute transform bg-card p-8 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 max-w-[84.363px] min-h-[84.363px] mih-h-[84.363px] max-h-[84.363px] h-full w-full rounded-full dark:bg-[#0a1629]">
              <div className="bg-black h-full w-full rounded-full justify-center items-center flex">
                <img src={SignOutConfirmation} alt="Confirmation" />
              </div>
            </div>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle className="pt-87 max-lg:pt-56 poppins-semibold text-[25px] max-lg:text-[19px] leading-normal text-center text-foreground dark:!text-white">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-black opacity-50 poppins-semibold text-[20px] max-lg:text-[15px] text-center max-w-[374px] mx-auto dark:!text-slate-400 dark:opacity-100">
              Have you already signed up and want to continue to sign in?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <div className="pt-30 flex flex-col gap-8 justify-center items-center mx-auto pb-46">
              <AlertDialogAction
                className="lg:min-w-[328px] max-lg:min-w-[200px] max-w-[328px] mih-h-[48px] max-h-[48px] rounded-8 !text-white"
                onClick={handleConfirmSignIn}
              >
                Yes, Sign In
              </AlertDialogAction>
              <AlertDialogCancel className="lg:min-w-[328px] max-lg:min-w-[200px] max-w-[328px] mih-h-[48px] max-h-[48px] rounded-8 border border-black dark:border-white/30 dark:!text-slate-200">
                No, Continue Registration
              </AlertDialogCancel>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
