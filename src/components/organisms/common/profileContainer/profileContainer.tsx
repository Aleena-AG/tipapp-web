import { useUser } from "@/contexts/UserContext";
import { PrimaryButton } from "@/components/atoms/buttons/primaryButton";
import { ProfileDetailsSection } from "@/components/molecules/profile/profile-details-section/profileDetailsSection";
import { useEffect, useState, type MouseEvent } from "react";
import EditIcon from "@/assets/svg/editIcon-profile.svg";
import EditProfileDetailsSection from "@/components/molecules/profile/profile-details-section/editProfileDetailsSection";
import { UserDetails } from "@/utils/types/types";
import { useLocation, useNavigate } from "react-router-dom";
import SpinLoader from "@/components/atoms/laoder/spin-loader";
import { ProfileImage } from "@/utils/constants/UsersData";
import { handleScrollTop } from "@/hooks/hooks";
import ToastProvider from "@/providers/ToastProvider";
import useAuth from "@/hooks/useAuth";
import { getUserFromLocalStorage } from "@/utils/localStorageUtils";
import { resolveAvatarDisplaySrc } from "@/utils/constants/ProfileAvatars";
import { useDeleteCurrentUser } from "@/api/userDetails";
import { useGetBalanceAmount } from "@/api/tipManagement";
import { useQueryClient } from "react-query";
import { Trash2 } from "lucide-react";
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

const ProfileContainer = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [localUserData, setLocalUserData] = useState<UserDetails | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { userDetails, isLoading, refetch } = useUser();
  const { getGoogleProfileData, handleLogout } = useAuth();
  const queryClient = useQueryClient();
  const {
    data: tipBalance,
    isLoading: isBalanceLoading,
    refetch: refetchBalance,
  } = useGetBalanceAmount("GBP");

  // Use localStorage data if available, otherwise fallback to API data
  const currentUserData = localUserData || userDetails;
  const bankDetails = currentUserData?.bankDetails?.[0];

  // Get Google profile data for display
  const googleProfileData = getGoogleProfileData();
  const availableBalance = Number(
    tipBalance?.balance ?? currentUserData?.BalanceOriginal ?? 0
  );
  const hasAvailableBalance =
    Number.isFinite(availableBalance) && availableBalance > 0;

  const { mutate: deleteAccount, isLoading: isDeletingAccount } =
    useDeleteCurrentUser(
      (message) => {
        setDeleteDialogOpen(false);
        ToastProvider.success(message);
        queryClient.clear();
        void handleLogout();
      },
      (error) => {
        ToastProvider.error(error);
      }
    );

  const handleOpenDeleteDialog = async () => {
    setDeleteDialogOpen(true);
    await refetchBalance();
  };

  const handleConfirmDelete = (event: MouseEvent<HTMLButtonElement>) => {
    // Keep the dialog open until the request finishes so failed deletes
    // still show the confirmation and error toast.
    event.preventDefault();
    if (hasAvailableBalance || isDeletingAccount) return;
    deleteAccount();
  };

  const { verifyUser } = useLocation().state || { verifyUser: "" };

  // Load user data from localStorage on component mount
  useEffect(() => {
    const localData = getUserFromLocalStorage();
    if (localData) {
      setLocalUserData(localData);
    }
  }, []);

  // Update localUserData when userDetails from context changes
  useEffect(() => {
    if (userDetails) {
      setLocalUserData(userDetails);
      // Also update localStorage to keep it in sync
      localStorage.setItem("user", JSON.stringify(userDetails));
    }
  }, [userDetails]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  // Refetch user data when coming from registration
  useEffect(() => {
    if (verifyUser === "true") {
      // Add a small delay to ensure backend is ready
      const timer = setTimeout(() => {
        refetch();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [verifyUser, refetch]);

  // Ensure data is loaded when navigating to profile
  useEffect(() => {
    // If we have authentication but no user data and not currently loading, trigger refetch
    if (!currentUserData && !isLoading) {
      const token = localStorage.getItem("token");
      const userType = localStorage.getItem("userType");

      if (token && userType) {
        // User is authenticated but data not loaded, trigger refetch
        refetch();
      }
    }
  }, [currentUserData, isLoading, refetch]);

  const [edit, setEdit] = useState<boolean>(false);

  const toggleEdit = () => {
    setEdit(!edit);
  };

  const navigate = useNavigate();

  const handleRouteHome = () => {
    // Show success message if coming from registration completion
    if (verifyUser === "true") {
      if (currentUserData?.Role === "sp") {
        ToastProvider.success(
          "Welcome! Your Service Provider account has been created successfully."
        );
        navigate("/service-provider");
      } else if (currentUserData?.Role === "tp") {
        ToastProvider.success(
          "Welcome! Your Tipper account has been created successfully."
        );
        navigate("/tip-provider");
      } else if (currentUserData?.Role === "both") {
        const userType = localStorage.getItem("userType");
        if (userType === "sp") {
          ToastProvider.success(
            "Welcome! Your Service Provider account has been created successfully."
          );
          navigate("/service-provider");
        } else {
          ToastProvider.success(
            "Welcome! Your Tipper account has been created successfully."
          );
          navigate("/tip-provider");
        }
      }
    } else {
      // Regular navigation without success message
      if (currentUserData?.Role === "sp") {
        navigate("/service-provider");
      } else if (currentUserData?.Role === "tp") {
        navigate("/tip-provider");
      } else if (currentUserData?.Role === "both") {
        const userType = localStorage.getItem("userType");
        if (userType === "sp") {
          navigate("/service-provider");
        } else {
          navigate("/tip-provider");
        }
      }
    }
  };

  {/*Color role handling */ }
  const role = typeof window !== "undefined" ? localStorage.getItem("userType") : null; // "tp" | "sp" | null

  const roleClassesButton =
    role === "tp"
      ? "bg-[#0B538D] hover:bg-[#0077B6]"
      : role === "sp"
        ? "bg-[#9E2A2B] hover:bg-[#ce260b]"
        : "bg-[#0B538D] hover:bg-[#0077B6]";

  const isSp = role === "sp";

  const BrandUnderline = () => (
    <div className="mx-auto flex h-[3px] w-[48px] overflow-hidden rounded-full">
      <span className="h-full w-1/2 bg-[#0B538D]" />
      <span className="h-full w-1/2 bg-[#d71921]" />
    </div>
  );

  return (
    <div
      className={`ta-animate-fade mx-auto w-full overflow-hidden rounded-[20px] border border-[#E4EAF2] bg-card px-20 py-28 shadow-[0_10px_32px_rgba(11,83,141,0.08)] sm:px-28 sm:py-32 lg:px-40 dark:border-white/10 dark:bg-[#0a1629]/95 dark:shadow-[0_10px_32px_rgba(0,0,0,0.45)] ${
        edit ? "max-w-[900px]" : "max-w-[840px]"
      } ${isSp ? "border-t-[3px] border-t-[#d71921]" : "border-t-[3px] border-t-[#0B538D]"}`}
    >
      <div className="relative mb-8 flex flex-col items-center gap-8 text-center">
        <button
          type="button"
          className={`absolute right-0 top-0 flex items-center gap-6 rounded-full px-14 py-7 text-white transition-all duration-200 hover:scale-[0.98] ${roleClassesButton}`}
          onClick={toggleEdit}
        >
          <img src={EditIcon} alt="" className="h-[14px] w-[14px]" />
          <span className="text-[13px] poppins-medium">
            {edit ? "Cancel" : "Edit"}
          </span>
        </button>

        <h1 className="poppins-semibold text-[24px] leading-none text-[#0B2C4A] dark:text-white sm:text-[28px]">
          {edit ? "Edit Profile" : "Profile"}
        </h1>
        <BrandUnderline />
        <p className="poppins-regular max-w-[420px] text-[13px] leading-[20px] text-[#5A6A7A] dark:text-slate-400 sm:text-[14px]">
          {edit
            ? "Update your personal details and keep your TipTapp account current."
            : "Your TipTapp account details and contact information."}
        </p>
      </div>

      {!edit && (
        <div>
          {loading || (!currentUserData && !isLoading) ? (
            <SpinLoader
              isLoading={loading || (!currentUserData && !isLoading)}
            />
          ) : (
            <>
              {verifyUser === "true" ? (
                <ProfileDetailsSection
                  email={
                    googleProfileData?.email || currentUserData?.Email
                      ? googleProfileData?.email || currentUserData?.Email
                      : "Not provided yet"
                  }
                  address={
                    currentUserData?.Address
                      ? currentUserData?.Address
                      : "Not provided yet"
                  }
                  phone={
                    currentUserData?.Phone
                      ? currentUserData?.Phone
                      : "Not provided yet"
                  }
                  DateOfBirth={
                    currentUserData?.DateOfBirth
                      ? currentUserData?.DateOfBirth
                      : "Not provided yet"
                  }
                  country={
                    currentUserData?.Country
                      ? currentUserData?.Country
                      : "Not provided yet"
                  }
                  lname={
                    googleProfileData?.lastName || currentUserData?.LastName
                      ? googleProfileData?.lastName || currentUserData?.LastName
                      : "Not provided yet"
                  }
                  name={
                    googleProfileData?.firstName || currentUserData?.FirstName
                      ? `${googleProfileData?.firstName ||
                      currentUserData?.FirstName
                      }`
                      : "Not provided yet"
                  }
                  bankName={
                    bankDetails ? bankDetails?.bankName : "Not provided yet"
                  }
                  ibanNumber={
                    bankDetails ? bankDetails?.ibanNumber : "Not provided yet"
                  }
                  bio={
                    currentUserData?.Bio
                      ? currentUserData?.Bio
                      : "Not provided yet"
                  }
                  imageUrl={resolveAvatarDisplaySrc(
                    googleProfileData?.profilePictureUrl ||
                      currentUserData?.ProfilePictureURL ||
                      ProfileImage
                  )}
                  city={
                    currentUserData?.City
                      ? currentUserData?.City
                      : "Not provided yet"
                  }
                  whatsapp={
                    currentUserData?.Whatsapp
                      ? currentUserData?.Whatsapp
                      : "Not provided yet"
                  }
                  role={
                    currentUserData?.Role
                      ? currentUserData?.Role
                      : "Not provided yet"
                  }
                  accNumber={
                    bankDetails ? bankDetails.accountNumber : "Not provided yet"
                  }
                />
              ) : (
                <ProfileDetailsSection
                  email={
                    googleProfileData?.email || currentUserData?.Email
                      ? googleProfileData?.email || currentUserData?.Email
                      : "Not provided yet"
                  }
                  DateOfBirth={
                    currentUserData?.DateOfBirth
                      ? currentUserData?.DateOfBirth
                      : "Not provided yet"
                  }
                  address={
                    currentUserData?.Address
                      ? currentUserData?.Address
                      : "Not provided yet"
                  }
                  phone={
                    currentUserData?.Phone
                      ? currentUserData?.Phone
                      : "Not provided yet"
                  }
                  country={
                    currentUserData?.Country
                      ? currentUserData?.Country
                      : "Not provided yet"
                  }
                  bankName={
                    bankDetails ? bankDetails?.bankName : "Not provided yet"
                  }
                  ibanNumber={
                    bankDetails ? bankDetails?.ibanNumber : "Not provided yet"
                  }
                  name={
                    googleProfileData?.firstName || currentUserData?.FirstName
                      ? `${googleProfileData?.firstName ||
                      currentUserData?.FirstName
                      }`
                      : "Not provided yet"
                  }
                  lname={
                    googleProfileData?.lastName || currentUserData?.LastName
                      ? googleProfileData?.lastName || currentUserData?.LastName
                      : "Not provided yet"
                  }
                  bio={
                    currentUserData?.Bio
                      ? currentUserData?.Bio
                      : "Not provided yet"
                  }
                  imageUrl={resolveAvatarDisplaySrc(
                    googleProfileData?.profilePictureUrl ||
                      currentUserData?.ProfilePictureURL ||
                      ProfileImage
                  )}
                  city={
                    currentUserData?.City
                      ? currentUserData?.City
                      : "Not provided yet"
                  }
                  whatsapp={
                    currentUserData?.Whatsapp
                      ? currentUserData?.Whatsapp
                      : "Not provided yet"
                  }
                  accNumber={
                    bankDetails ? bankDetails.accountNumber : "Not provided yet"
                  }
                  role={
                    currentUserData?.Role
                      ? currentUserData?.Role
                      : "Not provided yet"
                  }
                />
              )}
            </>
          )}
          <div className="mt-28 flex justify-center">
            <PrimaryButton
              handleOnClick={() => {
                handleScrollTop();
                handleRouteHome();
              }}
              type="submit"
              typo="Done"
              styles={`${roleClassesButton} h-[48px] min-h-[48px] w-full max-w-[280px] rounded-[12px] sm:max-w-[320px]`}
            />
          </div>
        </div>
      )}
      {edit && (
        <>
          {verifyUser === "true" ? (
            <EditProfileDetailsSection
              isVerified={false}
              userDetails={currentUserData as UserDetails}
              toggleEdit={toggleEdit}
              bankDetails={bankDetails}
            />
          ) : (
            <EditProfileDetailsSection
              isVerified={true}
              userDetails={currentUserData as UserDetails}
              toggleEdit={toggleEdit}
              bankDetails={bankDetails}
            />
          )}
        </>
      )}
      {!edit && currentUserData && (
        <div className="mt-32 border-t border-[#E4EAF2] pt-24 dark:border-white/10">
          <div className="flex flex-col items-center gap-8 text-center">
            <p className="poppins-semibold text-[14px] text-[#9E2A2B] dark:text-red-400">
              Delete account
            </p>
            <p className="poppins-regular max-w-[440px] text-[12px] leading-[19px] text-[#6B7A8A] dark:text-slate-400">
              This permanently removes your profile and cannot be undone. Your
              available balance must be zero before deletion.
            </p>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <button
                type="button"
                disabled={isDeletingAccount}
                onClick={() => {
                  void handleOpenDeleteDialog();
                }}
                className="poppins-medium mt-4 inline-flex h-11 items-center justify-center gap-8 rounded-[12px] border border-[#9E2A2B] px-20 text-[13px] text-[#9E2A2B] transition-colors hover:bg-[#9E2A2B] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-white"
              >
                <Trash2 className="h-4 w-4" />
                Delete account
              </button>

              <AlertDialogContent className="max-w-[440px] rounded-[18px] border-[#E4EAF2] bg-card p-24 dark:border-white/10 dark:bg-[#0a1629]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="poppins-semibold text-[19px] text-[#0B2C4A] dark:text-white">
                    {isBalanceLoading
                      ? "Checking account balance"
                      : hasAvailableBalance
                        ? "Account cannot be deleted"
                        : "Delete account permanently?"}
                  </AlertDialogTitle>
                  <AlertDialogDescription className="poppins-regular pt-4 text-[13px] leading-[21px] text-[#6B7A8A] dark:text-slate-400">
                    {isBalanceLoading
                      ? "Please wait while we verify that your available balance is zero."
                      : hasAvailableBalance
                        ? `Your account still has GBP ${availableBalance.toFixed(
                            2
                          )}. Withdraw or use the full balance before deleting your account.`
                        : "Are you sure? Your profile and account data will be permanently deleted. This action cannot be undone."}
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="mt-12 gap-8">
                  <AlertDialogCancel
                    disabled={isDeletingAccount}
                    className="poppins-medium h-11 rounded-[10px]"
                  >
                    {hasAvailableBalance ? "Close" : "Keep account"}
                  </AlertDialogCancel>
                  {!isBalanceLoading && !hasAvailableBalance && (
                    <AlertDialogAction
                      disabled={isDeletingAccount}
                      onClick={handleConfirmDelete}
                      className="poppins-medium h-11 rounded-[10px] bg-[#9E2A2B] text-white hover:bg-[#7E2021]"
                    >
                      {isDeletingAccount
                        ? "Deleting..."
                        : "Yes, delete permanently"}
                    </AlertDialogAction>
                  )}
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileContainer;
