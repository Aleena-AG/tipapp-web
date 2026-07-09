import { useUser } from "@/contexts/UserContext";
import { PrimaryButton } from "@/components/atoms/buttons/primaryButton";
import { PrimaryTypo } from "@/components/atoms/typo/primaryTypo";
import { ProfileDetailsSection } from "@/components/molecules/profile/profile-details-section/profileDetailsSection";
import { useEffect, useState } from "react";
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

const ProfileContainer = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [localUserData, setLocalUserData] = useState<UserDetails | null>(null);

  const { userDetails, isLoading, refetch } = useUser();
  const { getGoogleProfileData } = useAuth();

  // Use localStorage data if available, otherwise fallback to API data
  const currentUserData = localUserData || userDetails;
  const bankDetails = currentUserData?.bankDetails?.[0];

  // Get Google profile data for display
  const googleProfileData = getGoogleProfileData();

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
        : "";

  const roleClassesBorder =
    role === "tp"
      ? "sm:border sm:border-[#0B538D] sm:shadow-[0_0_15px_0_rgba(11,83,141,0.5)]"
      : role === "sp"
        ? "sm:border sm:border-[#d71921] sm:shadow-[0_0_15px_0_rgba(215,25,33,0.5)]"
        : "";


  return (
    <div
      className={`${edit == true
          ? "max-w-[900px] min-h-[950px] lg:max-h-[]  "
          : "max-w-[784px] min-h-[784px] lg:max-h-[]  "
        }  mx-auto sm:bg-white py-34 px-20 lg:px-74 rounded-16 overflow-hidden ${roleClassesBorder}`}
    >
      <div className="flex justify-between items-center w-full">
        <div className="w-full justify-center items-end flex">
          <PrimaryTypo
            typo={`${edit ? "Edit Profile" : "Profile"}`}
            styles="text-center !text-[20px] leading-normal poppins-semibold"
          />
        </div>
      </div>
      <div className="relative mt-20">
        <div className=" w-1/2 justify-end items-end flex absolute top-0 right-0 transform sm:-translate-y-10 -translate-y-20">
          <button
            className={`${edit
                ? "w-[100px] h-[25px] max-h-[25px] max-w-[100px]"
                : "w-[66px] h-[25px] max-h-[25px] max-w-[66px]"
              } ${roleClassesButton} text-white flex items-center justify-center rounded-4 hover:scale-95 duration-500 gap-6`}
            onClick={() => {
              toggleEdit();
            }}
          >
            <img src={EditIcon} alt="edit-icon" />
            <span className="text-[14px] poppins-medium ">
              {edit ? "Cancel" : "Edit"}
            </span>
          </button>
        </div>
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
                  // userName={
                  //   currentUserData?.Username
                  //     ? currentUserData?.Username
                  //     : "Not provided yet"
                  // }
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
                  imageUrl={
                    googleProfileData?.profilePictureUrl ||
                      currentUserData?.ProfilePictureURL
                      ? googleProfileData?.profilePictureUrl ||
                      currentUserData?.ProfilePictureURL
                      : ProfileImage
                  }
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
                  // userName={
                  //   currentUserData?.Username
                  //     ? currentUserData?.Username
                  //     : "Not provided yet"
                  // }
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
                  imageUrl={
                    googleProfileData?.profilePictureUrl ||
                      currentUserData?.ProfilePictureURL
                      ? googleProfileData?.profilePictureUrl ||
                      currentUserData?.ProfilePictureURL
                      : ProfileImage
                  }
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
          <div className="flex justify-center items-center">
            <PrimaryButton
              handleOnClick={() => {
                handleScrollTop();
                handleRouteHome();
              }}
              type="submit"
              typo="Done"
              styles={`${roleClassesButton} w-[238px] min-w-[338px] min-h-[48px] h-[48px]`}
            />
          </div>
        </div>
      )}
      {edit && (
        <>
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
        </>
      )}
    </div>
  );
};

export default ProfileContainer;
