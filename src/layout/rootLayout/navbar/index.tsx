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
import { useNavigate } from "react-router";
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
      ? "bg-[#0B538D] shadow-[0_0_15px_0_rgba(11,83,141,0.5)]"
      : role === "sp"
        ? "bg-[#9E2A2B] shadow-[0_0_15px_0_rgba(215,25,33,0.5)]"
        : "";

  const roleClassesBorder =
    role === "tp"
      ? "sm:border sm:border-[#0B538D] sm:shadow-[0_0_15px_0_rgba(11,83,141,0.5)]"
      : role === "sp"
        ? "sm:border sm:border-[#d71921] sm:shadow-[0_0_15px_0_rgba(215,25,33,0.5)]"
        : "";

  const navLogo = getRoleNavLogo(role);
  const avatarFallback = getRoleAvatarFallback(role);
  const avatarSrc = resolveProfileImageSrc(
    currentUser?.ProfilePictureURL,
    avatarFallback
  );
  const hasRoleNav = Boolean(roleNavClasses);

  const renderNavbarAvatar = (className = "") => (
    <Avatar
      className={`h-9 w-9 shrink-0 overflow-hidden ${className}`}
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

  const navLinkColor = hasRoleNav ? "text-white" : "text-[#141414]";
  const notificationRingColor =
    role === "sp" ? "ring-[#9E2A2B]" : "ring-[#0B538D]";

  const handleLogoClick = () => {
    if (isAuthenticated()) {
      handleNavigation("home");
    }
    handleScrollTop();
  };

  return (
    <div
      className={`sticky-navbar flex min-h-[56px] max-h-[56px] w-full items-center justify-between px-5 sm:px-8 lg:px-10 ${roleNavClasses}`}
    >
      <button
        type="button"
        onClick={handleLogoClick}
        className="shrink-0 rounded-lg transition-opacity hover:opacity-90"
        aria-label="Home"
      >
        <img
          src={navLogo}
          className="h-[38px] w-[38px] rounded-lg object-cover shadow-sm"
          alt="tip-app-logo"
        />
      </button>
      <div className="flex w-fit items-center gap-6 sm:gap-8 lg:gap-10">
        <div className="">
          <NavigationMenu className="w-fit gap-[67px] flex">
            {isAuthenticated() &&
              !isRegisterPage &&
              !isProfilePage &&
              !isUserSelectionPage &&
              !isForgotPasswordPage &&
              !isVerifyOtpPage &&
              !isResetPasswordPage &&
              RoutePaths.map((path) => {
                // Hide "Home" link for unauthenticated users
                if (path.name === "Home" && !isAuthenticated()) {
                  return null;
                }

                return (
                  <NavigationMenuList
                    key={path.name}
                    className="hidden md:block"
                  >
                    <NavigationMenuItem
                      // className={`${isScrolled
                      //   ? "bg-[#F3F1FB] hover:bg-white"
                      //   : "bg-white hover:bg-[#F3F1FB]"
                      //   } duration-300 poppins-regular text-[15px] text-black rounded-4`}
                      className={`poppins-regular rounded-4 text-[15px] ${navLinkColor}`}
                    >
                      {!isAuthRoute ? (
                        <NavigationMenuLink
                          className={
                            navigationMenuTriggerStyle() +
                            `${navLinkColor} px-[10px] hover:bg-white/10`
                          }
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
                              (path?.navigate as string) ||
                              (path.link as string)
                            );
                            handleScrollTop();
                          }}
                        >
                          {t(path.name)}
                        </NavigationMenuLink>
                      )}
                    </NavigationMenuItem>
                  </NavigationMenuList>
                );
              })}
            {/* Show Sign In link only on forgot password page */}
            {isForgotPasswordPage && (
              <NavigationMenuList key="sign-in-forgot" className="hidden md:block">
                <NavigationMenuItem
                  // className={`${isScrolled
                  //   ? "bg-[#F3F1FB] hover:bg-white"
                  //   : "bg-white hover:bg-[#F3F1FB]"
                  //   } duration-300 poppins-regular text-[15px] text-black rounded-4`}
                  className="poppins-regular text-[15px] text-black rounded-4"
                >
                  <NavigationMenuLink
                    className={
                      navigationMenuTriggerStyle() + " text-black px-[10px]"
                    }
                    onClick={() => {
                      navigate("/sign-in");
                      handleScrollTop();
                    }}
                  >
                    Sign In
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            )}
            {!isAuthenticated() && !isAuthRoute && !isUserSelectionPage && (
              <NavigationMenuList key="sign-in-unauth" className="hidden md:block">
                <NavigationMenuItem
                  // className={`${isScrolled
                  //   ? "bg-[#F3F1FB] hover:bg-white"
                  //   : "bg-white hover:bg-[#F3F1FB]"
                  //   } duration-300 poppins-regular text-[15px] text-black rounded-4`}
                  className="poppins-regular text-[15px] text-black rounded-4"
                >
                  <NavigationMenuLink
                    className={
                      navigationMenuTriggerStyle() + " text-black px-[10px]"
                    }
                    onClick={() => {
                      navigate("/sign-in");
                      handleScrollTop();
                    }}
                  >
                    Sign In
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            )}
          </NavigationMenu>
        </div>
        {!isAuthRoute && isAuthenticated() && !isProfilePage && (
          <>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/10"
                  aria-label="Notifications"
                >
                  {(notificationsData?.items?.filter(
                    (notification: any) => !notification.IsRead
                  )?.length ?? 0) > 0 && (
                    <span className={`absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ${notificationRingColor}`} />
                  )}
                  <img
                    src={BellIcon}
                    alt="notification icon"
                    className={`h-[22px] w-[22px] ${hasRoleNav ? "brightness-0 invert" : ""}`}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent className={`w-auto pt-8 px-12 mt-15 transform -translate-x-2 ${roleClassesBorder}`}>
                <NotificationsDropdown onViewAll={() => { }} />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild className="hidden md:block hover:cursor-pointer">
                {renderNavbarAvatar("hover:cursor-pointer")}
              </PopoverTrigger>
              <PopoverContent className="mt-15 w-full -translate-x-2 transform px-12 pt-8">
                <div className="flex flex-col gap-7">
                  <div className="flex items-center gap-12">
                    {renderNavbarAvatar()}
                    <div className="flex flex-col">
                      <div className="text-[#144524] text-[14px] poppins-semibold leading-[29px]">
                        {currentUser?.FirstName} {currentUser?.LastName}
                      </div>
                      <div className="text-sm text-[#000] poppins-medium leading-normal opacity-40">
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
                  <div className="h-px bg-[#D9D9D9] w-full" />
                </div>
                <div className="flex items-start w-full flex-col px-20 pt-14 pb-17 gap-10">
                  <div
                    className="flex items-center hover:scale-95 duration-300 gap-7 hover:cursor-pointer"
                    onClick={() => {
                      handleScrollTop();
                      handleNavigateProfile();
                    }}
                  >
                    <img src={ProfileIcon} alt="" />
                    <div className="text-[14px] poppins-medium leading-[29px] text-[#144524]">
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
                    <img src={SignOutIcon} alt="" />
                    <div className="text-[14px] poppins-medium leading-[29px] text-[#144524]">
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
              {renderNavbarAvatar("hover:cursor-pointer")}
            </PopoverTrigger>
            <PopoverContent className="mt-15 w-full -translate-x-2 transform px-12 pt-8">
              <div className="flex flex-col gap-7">
                <div className="flex items-center gap-12">
                  {renderNavbarAvatar()}
                  <div className="flex flex-col">
                    <div className="text-[#144524] text-[14px] poppins-semibold leading-[29px]">
                      {currentUser?.FirstName} {currentUser?.LastName}
                    </div>
                    <div className="text-sm text-[#000] poppins-medium leading-normal opacity-40">
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
                <div className="h-px bg-[#D9D9D9] w-full" />
              </div>
              <div className="flex items-start w-full flex-col px-20 pt-14 pb-17 gap-10">
                <div
                  className="flex items-center hover:scale-95 duration-300 gap-7 hover:cursor-pointer"
                  onClick={() => {
                    handleScrollTop();
                    handleNavigateProfile();
                  }}
                >
                  <img src={ProfileIcon} alt="" />
                  <div className="text-[14px] poppins-medium leading-[29px] text-[#144524]">
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
                  <img src={SignOutIcon} alt="" />
                  <div className="text-[14px] poppins-medium leading-[29px] text-[#144524]">
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
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 transition-colors hover:bg-white/25"
                aria-label="Open menu"
              >
                <MenuIcon className={`lg:hidden ${hasRoleNav ? "text-white" : "text-[#0B538D]"}`} />
              </button>
            </DropdownMenuTrigger>
            {isMobileMenuOpen && (
              <DropdownMenuContent className="w-56 mr-10 transform translate-y-4 px-10 z-[100]">
                {!isAuthRoute && isAuthenticated() && (
                  <>
                    <DropdownMenuGroup className="">
                      <DropdownMenuLabel className="poppins-regular text-xs">
                        <div className="flex items-center gap-7">
                          {renderNavbarAvatar("h-8 w-8")}
                          <div className="flex flex-col">
                            <div className="text-xs poppins-medium leading-[29px] text-[#144524]">
                              {currentUser?.FirstName} {currentUser?.LastName}
                            </div>
                            <div className="text-xs text-[#000] poppins-medium leading-normal opacity-40">
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
                    <DropdownMenuSeparator />
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
                          className="poppins-regular text-xs"
                          onClick={() =>
                            handleNavigation(
                              path?.navigate || (path.link as string)
                            )
                          }
                        >
                          {t(path.name)}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </React.Fragment>
                    );
                  })}
                {/* Show Sign In link only on forgot password page in mobile menu */}
                {isForgotPasswordPage && (
                  <>
                    <DropdownMenuItem
                      className="poppins-regular text-xs"
                      onClick={() => {
                        navigate("/sign-in");
                        handleScrollTop();
                      }}
                    >
                      Sign In
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                {/* Add Sign In link for unauthenticated users in mobile menu (but not on auth pages) */}
                {!isAuthenticated() && !isAuthRoute && !isUserSelectionPage && (
                  <>
                    <DropdownMenuItem
                      className="poppins-regular text-xs"
                      onClick={() => {
                        navigate("/sign-in");
                        handleScrollTop();
                      }}
                    >
                      Sign In
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
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
                      <img src={ProfileIcon} alt="" />
                      <div className="text-xs poppins-medium leading-[29px] text-[#144524]">
                        {t("profile.profileSettings")}
                      </div>
                    </div>
                    <div
                      className="flex items-center hover:scale-95 duration-300 gap-12  hover:cursor-pointer"
                      onClick={handleSignOutClick}
                    >
                      <img src={SignOutIcon} alt="" />
                      <div className="text-xs poppins-medium leading-[29px] text-[#144524]">
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
        <AlertDialogContent className="z-[9999]  w-full max-w-[350px] rounded-xl md:max-w-[500px] lg:max-w-[650px] lg:p-8">
          <div className="relative">
            <div className="absolute transform bg-white p-8 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 max-w-[84.363px] min-h-[84.363px] mih-h-[84.363px] max-h-[84.363px] h-full w-full rounded-full">
              <div className="bg-black h-full w-full rounded-full justify-center items-center flex">
                <img src={SignOutConfirmation} alt="Confirmation" />
              </div>
            </div>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle className="pt-87  max-lg:pt-56 poppins-semibold text-[25px]  max-lg:text-[19px]  leading-normal text-center">
              Are you sure ?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-black opacity-50 poppins-semibold text-[20px]  max-lg:text-[15px]  text-center max-w-[374px] mx-auto">
              Are you sure you want to Sign out?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <div className="pt-30 flex flex-col gap-8 justify-center items-center mx-auto pb-46">
              <AlertDialogAction
                className="lg:min-w-[328px] max-lg:min-w-[200px] max-w-[328px] mih-h-[48px] max-h-[48px] rounded-8"
                onClick={() => {
                  handleScrollTop();
                  handleLogout();
                }}
              >
                Yes
              </AlertDialogAction>
              <AlertDialogCancel className="lg:min-w-[328px] max-lg:min-w-[200px] max-w-[328px] mih-h-[48px] max-h-[48px] rounded-8 border border-black">
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
        <AlertDialogContent className="z-[9999] w-full max-w-[350px] rounded-xl md:max-w-[500px] lg:max-w-[650px] lg:p-8">
          <div className="relative">
            <div className="absolute transform bg-white p-8 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 max-w-[84.363px] min-h-[84.363px] mih-h-[84.363px] max-h-[84.363px] h-full w-full rounded-full">
              <div className="bg-black h-full w-full rounded-full justify-center items-center flex">
                <img src={SignOutConfirmation} alt="Confirmation" />
              </div>
            </div>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle className="pt-87 max-lg:pt-56 poppins-semibold text-[25px] max-lg:text-[19px] leading-normal text-center">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-black opacity-50 poppins-semibold text-[20px] max-lg:text-[15px] text-center max-w-[374px] mx-auto">
              Have you already signed up and want to continue to sign in?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <div className="pt-30 flex flex-col gap-8 justify-center items-center mx-auto pb-46">
              <AlertDialogAction
                className="lg:min-w-[328px] max-lg:min-w-[200px] max-w-[328px] mih-h-[48px] max-h-[48px] rounded-8"
                onClick={handleConfirmSignIn}
              >
                Yes, Sign In
              </AlertDialogAction>
              <AlertDialogCancel className="lg:min-w-[328px] max-lg:min-w-[200px] max-w-[328px] mih-h-[48px] max-h-[48px] rounded-8 border border-black">
                No, Continue Registration
              </AlertDialogCancel>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
