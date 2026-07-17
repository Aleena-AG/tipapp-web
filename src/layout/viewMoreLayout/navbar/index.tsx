 
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { authRoutes, RoutePaths } from "@/routes/routes";
import { RoutePaths } from "@/routes/routes";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../../../components/ui/navigation-menu";
import Logo from "@/assets/images/appLogo.png";
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
import { useEffect, useState } from "react";
import ProfileIcon from "@/assets/svg/profile-icon.svg";
import SignOutIcon from "@/assets/svg/sign-out-icon.svg";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import useAuth from "@/hooks/useAuth";
import { useUser } from "@/contexts/UserContext";
import { handleScrollTop } from "@/hooks/hooks";
import SignOutConfirmation from "@/assets/svg/sign-out-secondary.svg";
import { getUserFromLocalStorage } from "@/utils/localStorageUtils";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import BellIcon from "@/assets/svg/bellIcon.svg";
import { resolveProfileImageSrc } from "@/utils/imageUtils";
import { useGetNotifications } from "@/api/notifications";
import NotificationsDropdown from "@/components/organisms/common/notifications-dropdown/NotificationsDropdown";


export const Navbar = () => {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true);
  const [showSignOutConfirmation, setShowSignOutConfirmation] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
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
    } else {
      navigate(path);
    }
  };

  // const isAuthRoute = authRoutes.includes(location.pathname);

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    return !!(token && userType);
  };

  const handleSignOutClick = () => {
    setIsMobileMenuOpen(false);
    setShowSignOutConfirmation(true);
  };

  {/* Navbar color role handling */ }
  const role = typeof window !== "undefined" ? localStorage.getItem("userType") : null; // "tp" | "sp" | null

  const roleNavClasses =
    role === "tp"
      ? "bg-[#0B538D] shadow-[0_0_15px_0_rgba(11,83,141,0.5)]"
      : role === "sp"
        ? "bg-[#9E2A2B] shadow-[0_0_15px_0_rgba(215,25,33,0.5)]"
        : "bg-background border-b border-border";

  return (
    <div
      className={`sticky-navbar w-full flex min-h-[52px] max-h-[52px] justify-between items-center sm:pl-14 pl-9 pr-9 ${roleNavClasses}`}
    >
      <img
        src={Logo}
        className="h-[40px] w-auto shrink-0 object-contain"
        alt="tip-app-logo"
      />
      <div className="w-fit flex items-center gap-20 sm:gap-[57px]">
        <div className="hidden md:block">
          <NavigationMenu className="w-fit gap-[67px] flex">
            {isAuthenticated() && RoutePaths.map((path) => {
              if (path.name === "Home" && !isAuthenticated()) {
                return null;
              }

              return (
                <NavigationMenuList key={path.name}>
                  <NavigationMenuItem
                    // className={`${isScrolled
                    // ? "bg-app-surface-muted hover:bg-white"
                    // : "bg-white hover:bg-app-surface-muted"
                    // } duration-300 poppins-regular text-[15px] text-black rounded-4`}
                    className="poppins-regular text-[15px] text-white rounded-4"
                  >
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle() + " text-white  px-[10px]"}
                      onClick={() => {
                        handleScrollTop();
                        handleNavigation(path?.navigate as string);
                      }}
                    >
                      {t(path.name)}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              );
            })}
            {!isAuthenticated() && (
              <NavigationMenuList>
                <NavigationMenuItem
                  className={`${isScrolled
                    ? "bg-[#F3F1FB] hover:bg-white dark:bg-slate-800 dark:hover:bg-slate-700"
                    : "bg-white hover:bg-[#F3F1FB] dark:bg-slate-900 dark:hover:bg-slate-800"
                    } duration-300 poppins-regular text-[15px] text-black dark:text-white rounded-4`}
                >
                  <NavigationMenuLink
                    className={
                      navigationMenuTriggerStyle() + " text-black dark:text-white px-[10px]"
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
        <ThemeToggle variant={role ? "onColor" : "default"} />
        {isAuthenticated() && (
          <>
            <Popover>
              <PopoverTrigger asChild>
                <div className="cursor-pointer">
                  <div className="w-10 h-10 relative">
                    {(notificationsData?.items?.filter(
                      (notification: any) => !notification.IsRead
                    )?.length ?? 0) > 0 && (
                        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
                      )}
                    <div className="flex justify-center items-center w-full h-full">
                      <img
                        src={BellIcon}
                        alt="notification icon"
                        className="w-[30px] h-[30px]"
                      />
                    </div>
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto pt-8 px-12 mt-15 transform -translate-x-2">
                <NotificationsDropdown onViewAll={() => { }} />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild className="">
                <Avatar className="hidden h-9 w-9 md:block hover:cursor-pointer ring-[2.5px] ring-[#E8B923] ring-offset-2 ring-offset-[#0B538D] shadow-[0_0_0_1px_rgba(232,185,35,0.55)] dark:ring-offset-[#0A4A7A]">
                  <AvatarImage
                    src={
                      resolveProfileImageSrc(currentUser?.ProfilePictureURL)
                    }
                    alt="@shadcn"
                    className="w-full h-full object-cover"
                  />
                  <AvatarFallback>
                    <img
                      src={
                        resolveProfileImageSrc(currentUser?.ProfilePictureURL)
                      }
                      alt=""
                    />
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="mt-15 w-full -translate-x-2 transform px-12 pt-8 dark:border-white/10 dark:bg-[#0a1629] dark:shadow-[0_0_20px_0_rgba(215,25,33,0.35)]">
                <div className="flex flex-col gap-7">
                  <div className="flex items-center gap-12">
                    <Avatar className="hidden h-9 w-9 md:block ring-[2.5px] ring-[#E8B923] ring-offset-2 ring-offset-background dark:ring-offset-[#0a1629]">
                      <AvatarImage
                        src={resolveProfileImageSrc(currentUser?.ProfilePictureURL)}
                        alt="@shadcn"
                        className="w-full h-full object-cover"
                      />
                      <AvatarFallback>
                        <img
                          src={
                            resolveProfileImageSrc(currentUser?.ProfilePictureURL)
                          }
                          alt=""
                        />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <div className="text-[#144524] dark:text-white text-[14px] poppins-semibold leading-[29px]">
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
          </>
        )}

        <div className="lg:hidden block">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div onClick={toggleMobileMenu}>
                <MenuIcon className="lg:hidden" onClick={toggleMobileMenu} />
              </div>
            </DropdownMenuTrigger>
            {isMobileMenuOpen && (
              <DropdownMenuContent className="w-56 mr-10 transform translate-y-4 px-10 z-[100]">
                {isAuthenticated() && (
                  <>
                    <DropdownMenuGroup className="">
                      <DropdownMenuLabel className="poppins-regular text-xs">
                        <div className="flex items-center gap-7">
                          <div className="flex flex-col">
                            <div className="text-xs poppins-medium leading-[29px] text-[#144524] dark:text-white">
                              {currentUser?.Username}
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
                {isAuthenticated() && RoutePaths.map((path) => {
                  // Hide "Home" link for unauthenticated users
                  if (path.name === "Home" && !isAuthenticated()) {
                    return null;
                  }

                  return (
                    <>
                      <DropdownMenuItem
                        key={path.name}
                        className="poppins-regular text-xs"
                        onClick={() =>
                          handleNavigation(path?.navigate as string)
                        }
                      >
                        {path.name}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  );
                })}
                {/* Add Sign In link for unauthenticated users in mobile menu (but not on auth pages) */}
                {!isAuthenticated() && (
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
            <div className="absolute transform bg-card p-8 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 max-w-[84.363px] min-h-[84.363px] mih-h-[84.363px] max-h-[84.363px] h-full w-full rounded-full">
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
    </div>
  );
};
