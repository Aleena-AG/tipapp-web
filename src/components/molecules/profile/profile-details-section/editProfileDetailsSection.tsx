/* eslint-disable @typescript-eslint/no-explicit-any */
import ProfileEditTextInput from "@/components/atoms/textinput/textInput/ProfileEditTextInput";
import { PrimaryButton } from "@/components/atoms/buttons/primaryButton";
import { ProfileEditTextArea } from "@/components/atoms/textinput/textArea/ProfileEditTextArea";
import { UserDetails } from "@/utils/types/types";
import { useUpdateUser } from "@/api/userDetails";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import ToastProvider from "@/providers/ToastProvider";
import PaymentDetailsSection from "./paymentDetailsSection";
import { useUploadImage } from "@/api/authApi";
import authFetch from "@/api/axiosInterceptor";
import { useQueryClient } from "react-query";
import { ProfileImage } from "@/utils/constants/UsersData";
import EditIcon from "@/assets/svg/editIcon-profile.svg";
import { editProfileValidationSchema } from "@/utils/validations";
import { handleScrollTop } from "@/hooks/hooks";
import SpinLoaderButton from "@/components/atoms/laoder/spin-loader-secondary";
import useDateOfBirthValidation from "@/hooks/useDateOfBirthValidation";
import useAuth from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import AvatarSelectModal from "@/components/molecules/profile/AvatarSelectModal";
import {
  type AvatarGender,
  PROFILE_GENDER_STORAGE_KEY,
  inferGenderFromAvatarUrl,
  resolveAvatarDisplaySrc,
  resolveAvatarStorageUrl,
  toAvatarRelativePath,
} from "@/utils/constants/ProfileAvatars";

const EditProfileDetailsSection = ({
  isVerified,
  userDetails,
  toggleEdit,
  bankDetails,
}: {
  isVerified: boolean;
  userDetails: UserDetails;
  toggleEdit: () => void;
  bankDetails: any;
}) => {
  const queryClient = useQueryClient();
  const {
    mutate: uploadFile,
    isSuccess: fileUploadSuccess,
    data: uploadData,
    isError: isUploadError,
    error: uploadError,
  } = useUploadImage();
  const [paypalEmail, setPaypalEmail] = useState(userDetails?.Paypal || "");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [, setRemoved] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [avatarGender, setAvatarGender] = useState<AvatarGender>(() => {
    const saved = localStorage.getItem(PROFILE_GENDER_STORAGE_KEY);
    if (saved === "male" || saved === "female") return saved;
    return "male";
  });
  const { getMaxDate, getMinDate } = useDateOfBirthValidation();
  const { t } = useTranslation();
  const onError = (error: string) => {
    ToastProvider.error(error || t("auth.anErrorOccurred"));
  };

  const onSuccessUpdate = () => {
    ToastProvider.success(t("profile.profileUpdated"));
    toggleEdit();
  };
  const user = localStorage.getItem("user");
  const currentUser = JSON.parse(user || "{}");
  const userType = localStorage.getItem("userType");
  const FALSE = false;

  const { mutate: updateProfile } = useUpdateUser(onSuccessUpdate, onError);
  const { getGoogleProfileData } = useAuth();

  const {
    values,
    setFieldValue,
    setFieldError,
    errors,
    touched,
    handleSubmit,
  } = useFormik({
    initialValues: {
      // Username: "",
      FirstName: "",
      LastName: "",
      DateOfBirth: "",
      Email: "",
      Address: "",
      Phone: "",
      Whatsapp: "",
      Country: "",
      City: "",
      Bio: "",
      bankName: "",
      accountNumber: "",
      ibanNumber: "",
      Paypal: "",
      ProfilePictureURL: "",
    },
    validationSchema: editProfileValidationSchema,
    onSubmit: async (formValues) => {
      setShowLoading(true);
      try {
        if (userDetails) {
          const existing = JSON.parse(localStorage.getItem("user") || "{}");
          const { Gender: _g1, ...safeExisting } = existing;
          const { Gender: _g2, ...safeForm } = formValues as typeof formValues & {
            Gender?: string;
          };
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...safeExisting,
              ...safeForm,
              ProfilePictureURL: formValues.ProfilePictureURL,
            })
          );
          await updateProfile(safeForm as UserDetails);
        }
      } finally {
        setTimeout(() => {
          setShowLoading(false);
        }, 5000);
      }
    },
    validateOnChange: false,
  });

  useEffect(() => {
    if (userDetails) {
      const googleProfileData = getGoogleProfileData();
      const firstName =
        googleProfileData?.firstName || userDetails?.FirstName || "";
      const lastName =
        googleProfileData?.lastName || userDetails?.LastName || "";
      const email = googleProfileData?.email || userDetails?.Email || "";
      const profilePictureUrl =
        googleProfileData?.profilePictureUrl ||
        userDetails?.ProfilePictureURL ||
        currentUser?.ProfilePictureURL ||
        "";

      const savedGender = localStorage.getItem(PROFILE_GENDER_STORAGE_KEY);
      const inferred = inferGenderFromAvatarUrl(profilePictureUrl);
      const nextGender: AvatarGender =
        savedGender === "male" || savedGender === "female"
          ? savedGender
          : inferred === "male" || inferred === "female"
            ? inferred
            : "male";

      setAvatarGender(nextGender);
      setFieldValue("FirstName", firstName);
      setFieldValue("LastName", lastName);
      setFieldValue("Email", email);
      setFieldValue("Address", userDetails?.Address);
      setFieldValue("Phone", userDetails?.Phone);
      setFieldValue("Whatsapp", userDetails?.Whatsapp);
      setFieldValue("Country", userDetails?.Country);
      setFieldValue("City", userDetails?.City);
      setFieldValue("Bio", userDetails?.Bio);
      setFieldValue("bankName", bankDetails?.bankName);
      setFieldValue("accountNumber", bankDetails?.accountNumber);
      setFieldValue("ibanNumber", bankDetails?.ibanNumber);
      setFieldValue("Paypal", userDetails?.Paypal);
      setFieldValue("DateOfBirth", userDetails?.DateOfBirth);
      setFieldValue("ProfilePictureURL", profilePictureUrl);

      updateLocalStorage(userDetails);
    }
  }, [
    userDetails,
    setFieldValue,
    bankDetails?.bankName,
    bankDetails?.accountNumber,
    bankDetails?.ibanNumber,
    currentUser?.ProfilePictureURL,
    getGoogleProfileData,
  ]);

  const handleSelectAvatar = async (
    pathOrUrl: string,
    selectedGender: AvatarGender
  ) => {
    const displayPath = toAvatarRelativePath(pathOrUrl) || pathOrUrl;
    const storageUrl = resolveAvatarStorageUrl(pathOrUrl);

    setAvatarGender(selectedGender);
    setFieldValue("ProfilePictureURL", displayPath);
    setUploadedImage(displayPath);
    setRemoved(false);

    // Remember last avatar-filter choice locally only (not a required profile field)
    localStorage.setItem(PROFILE_GENDER_STORAGE_KEY, selectedGender);
    const existing = JSON.parse(localStorage.getItem("user") || "{}");
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...existing,
        ProfilePictureURL: storageUrl,
      })
    );

    setSavingAvatar(true);
    try {
      await authFetch.patch(`/user-details`, {
        ProfilePictureURL: storageUrl,
        FirstName: values.FirstName || userDetails?.FirstName,
        LastName: values.LastName || userDetails?.LastName,
        Email: values.Email || userDetails?.Email,
        Address: values.Address || userDetails?.Address,
        Phone: values.Phone || userDetails?.Phone,
        Whatsapp: values.Whatsapp || userDetails?.Whatsapp,
        Country: values.Country || userDetails?.Country,
        City: values.City || userDetails?.City,
        Bio: values.Bio || userDetails?.Bio,
        DateOfBirth: values.DateOfBirth || userDetails?.DateOfBirth,
      });
      await queryClient.invalidateQueries(["get_current_user", "v2"]);
      ToastProvider.success("Profile photo saved");
    } catch (error: any) {
      ToastProvider.error(
        error?.response?.data?.message || "Failed to save profile photo"
      );
    } finally {
      setSavingAvatar(false);
    }
  };

  useEffect(() => {
    setFieldValue("Paypal", paypalEmail);
  }, [paypalEmail, setFieldValue]);

  const MIN_BYTES = 64 * 1024; // 64KB
  const MAX_BYTES = 1 * 1024 * 1024; // 1MB


  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size < MIN_BYTES) {
      ToastProvider.error(
        `File size too small. Minimum file size is 64KB, but received ${Math.round(file.size / 1024)}KB`
      );
      event.target.value = "";
      return;
    }

    if (file.size > MAX_BYTES) {
      ToastProvider.error(
        `File size too large. Maximum file size is 1MB, but received ${Math.round((file.size / (1024 * 1024)) * 100) / 100}MB`
      );
      event.target.value = "";
      return;
    }

    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = async () => {
        try {
          const formData = new FormData();
          formData.append("file", file);
          await uploadFile(formData);
        } catch (error) {
          ToastProvider.error("Failed to upload image. Please try again.");
        }
      };
    }
  };

  useEffect(() => {
    if (isUploadError && uploadError) {
      ToastProvider.error(
        uploadError.response?.data?.message ||
        "An error occurred. Please try again."
      );
    }
  }, [isUploadError, uploadError]);

  useEffect(() => {
    if (fileUploadSuccess && uploadData) {
      setUploadedImage(uploadData.fileUrl);
      ToastProvider.success(
        uploadData.message || "File uploaded successfully!"
      );
      setFieldValue("ProfilePictureURL", uploadData.fileUrl);
      setRemoved(false);
      setShowAvatarModal(false);
    }
  }, [fileUploadSuccess, uploadData, setFieldValue]);

  const removeUploadedFile = () => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (userData) {
      userData.ProfilePictureURL = ProfileImage;
      localStorage.setItem("user", JSON.stringify(userData));
      setFieldValue("ProfilePictureURL", ProfileImage);
    }
    setRemoved(true);
    setUploadedImage(null);
    return ProfileImage;
  };

  const updateLocalStorage = (userDetails: UserDetails) => {
    const { Gender: _gender, ...safeUser } = userDetails as UserDetails & {
      Gender?: string | null;
    };
    localStorage.setItem("user", JSON.stringify(safeUser));
  };

  {/*Color role handling */ }
  const role = typeof window !== "undefined" ? localStorage.getItem("userType") : null; // "tp" | "sp" | null

  const roleClassesButton =
    role === "tp"
      ? "bg-[#0B538D] hover:bg-[#0077B6]"
      : role === "sp"
        ? "bg-[#9E2A2B] hover:bg-[#ce260b]"
        : "";

  return (
    <div className="w-full flex flex-col overflow-y-auto">
      <div className="w-full flex flex-col-reverse sm:flex-row pt-48 gap-47">
        <div className="w-full flex flex-col items-start gap-x-47">
          <div className="flex flex:col items-start w-full">
            <div className="w-full flex flex-col gap-y-12">
              <div className="flex flex-col sm:flex-row items-center w-full gap-x-7 gap-y-17">
                <ProfileEditTextInput
                  placeholder={t("forms.firstName")}
                  value={values.FirstName}
                  id={"FirstName"}
                  name="FirstName"
                  type="text"
                  containerStyles="!sm:w-1/2"
                  label={t("forms.firstName")}
                  onChange={(e) => {
                    setFieldValue("FirstName", e.currentTarget.value);
                    setFieldError("FirstName", undefined);
                  }}
                  isError={Boolean(errors.FirstName && touched.FirstName)}
                  errorMsg={errors.FirstName}
                  onBlur={() => setFieldError("Username", undefined)}
                />
                <ProfileEditTextInput
                  placeholder={t("forms.lastName")}
                  value={values.LastName}
                  id={"LastName"}
                  name="LastName"
                  type="text"
                  containerStyles="!sm:w-1/2"
                  label={t("forms.lastName")}
                  onChange={(e) => {
                    setFieldValue("LastName", e.currentTarget.value);
                    setFieldError("LastName", undefined);
                  }}
                  isError={Boolean(errors.LastName && touched.LastName)}
                  errorMsg={errors.LastName}
                  onBlur={() => setFieldError("LastName", undefined)}
                />
              </div>
              <div className="flex flex-col sm:flex-row items-center w-full gap-x-7 gap-y-17 ">
                <ProfileEditTextInput
                  placeholder={t("forms.email")}
                  value={values.Email}
                  id={"Email"}
                  name="Email"
                  type="email"
                  containerStyles="!sm:w-1/2"
                  label={t("forms.email")}
                  onChange={(e) => {
                    setFieldValue("Email", e.currentTarget.value);
                    setFieldError("Email", undefined);
                  }}
                  onBlur={() => setFieldError("Email", undefined)}
                  disabled
                />
                <ProfileEditTextInput
                  placeholder={t("forms.dateOfBirth")}
                  value={values.DateOfBirth}
                  id={"DateOfBirth"}
                  name="DateOfBirth"
                  type="date"
                  containerStyles="!sm:w-1/2"
                  label={t("forms.dateOfBirth")}
                  min={getMinDate()}
                  max={getMaxDate()}
                  onChange={(e) => {
                    setFieldValue("DateOfBirth", e.currentTarget.value);
                    setFieldError("DateOfBirth", undefined);
                  }}
                  isError={Boolean(errors.DateOfBirth && touched.DateOfBirth)}
                  errorMsg={errors.DateOfBirth}
                  onBlur={() => setFieldError("DateOfBirth", undefined)}
                />
              </div>
              <div>
                <ProfileEditTextInput
                  placeholder={t("forms.address")}
                  value={values.Address}
                  id={"Address"}
                  name="Address"
                  type="text"
                  containerStyles=""
                  label={t("forms.address")}
                  onChange={(e) => {
                    setFieldValue("Address", e.currentTarget.value);
                    setFieldError("Address", undefined);
                  }}
                  isError={Boolean(errors.Address && touched.Address)}
                  errorMsg={errors.Address}
                  onBlur={() => setFieldError("Address", undefined)}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-y-17 w-full pt-17">
            <div className="flex flex-col sm:flex-row items-center w-full gap-x-7 gap-y-17">
              <ProfileEditTextInput
                placeholder="Phone Number"
                value={values.Phone}
                id={"Phone"}
                name="Phone"
                type="text"
                containerStyles="!sm:w-1/2"
                label="Phone"
                onChange={(e) => {
                  setFieldValue("Phone", e.currentTarget.value);
                  setFieldError("Phone", undefined);
                }}
                isError={Boolean(errors.Phone && touched.Phone)}
                errorMsg={errors.Phone}
                onBlur={() => setFieldError("Phone", undefined)}
              />
              <ProfileEditTextInput
                placeholder="Whatsapp Number"
                value={values.Whatsapp}
                id={"Whatsapp"}
                name="Whatsapp"
                type="text"
                containerStyles="!sm:w-1/2"
                label="WhatsApp"
                onChange={(e) => {
                  setFieldValue("Whatsapp", e.currentTarget.value);
                  setFieldError("Whatsapp", undefined);
                }}
                isError={Boolean(errors.Whatsapp && touched.Whatsapp)}
                errorMsg={errors.Whatsapp}
                onBlur={() => setFieldError("Whatsapp", undefined)}
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center w-full gap-x-7 gap-y-17">
              <ProfileEditTextInput
                placeholder="Country"
                value={values.Country}
                id={"Country"}
                name="Country"
                type="text"
                containerStyles="!sm:w-1/2"
                label="Country"
                onChange={(e) => {
                  setFieldValue("Country", e.currentTarget.value);
                  setFieldError("Country", undefined);
                }}
                isError={Boolean(errors.Country && touched.Country)}
                errorMsg={errors.Country}
                onBlur={() => setFieldError("Country", undefined)}
              />
              <ProfileEditTextInput
                placeholder="City"
                value={values.City}
                id={"City"}
                name="City"
                type="text"
                containerStyles="!sm:w-1/2"
                label="City"
                onChange={(e) => {
                  setFieldValue("City", e.currentTarget.value);
                  setFieldError("City", undefined);
                }}
                isError={Boolean(errors.City && touched.City)}
                errorMsg={errors.City}
                onBlur={() => setFieldError("City", undefined)}
              />
            </div>
            <div className="">
              <ProfileEditTextArea
                placeholder="Type Here"
                value={values.Bio || ""}
                id={"Bio"}
                name="Bio"
                type="text"
                containerStyles=""
                label="Bio"
                onChange={(e) => {
                  setFieldValue("Bio", e.currentTarget.value);
                  setFieldError("Bio", undefined);
                }}
                isError={Boolean(errors.Bio && touched.Bio)}
                errorMsg={errors.Bio}
                onBlur={() => setFieldError("Bio", undefined)}
              />
            </div>
            {isVerified && FALSE && (
              <div className="flex items-center w-full py-14">
                <div className="h-px bg-[#E0E0E0] w-full opacity-40" />
                <div className="poppins-medium text-[14px] w-[466px] text-center">
                  {userDetails?.Role === "tp"
                    ? "Payment Details"
                    : userDetails?.Role === "sp"
                      ? "Bank Details"
                      : userDetails?.Role === "both" && userType === "tp"
                        ? "Payment Details"
                        : userDetails?.Role === "both" && userType === "sp"
                          ? "Bank Details"
                          : ""}
                </div>
                <div className="h-px bg-[#E0E0E0] w-full opacity-40" />
              </div>
            )}
            {userDetails?.Role === "sp" && FALSE && (
              <>
                <div className="flex flex-col sm:flex-row items-center w-full gap-x-7 gap-y-17">
                  <ProfileEditTextInput
                    placeholder="User Bank Name"
                    // value={
                    //   bankDetails
                    //     ? bankDetails.bankName
                    //     : "Not Provided yet"
                    // }
                    value={values.bankName}
                    id={"bankName"}
                    name="bankName"
                    type="text"
                    containerStyles="!sm:w-1/2"
                    label="Bank Name"
                    onChange={(e) => {
                      setFieldValue("bankName", e.currentTarget.value);
                      setFieldError("bankName", undefined);
                    }}
                    onBlur={() => setFieldError("bankName", undefined)}
                  />
                  <ProfileEditTextInput
                    placeholder="User Account Number"
                    // value={
                    //   bankDetails ? bankDetails.accountNumber : "Not Provided yet"
                    // }
                    value={values.accountNumber}
                    id={"AccNumber"}
                    name="AccNumber"
                    type="text"
                    containerStyles="!sm:w-1/2"
                    label="Account Number"
                    onChange={(e) => {
                      setFieldValue("AccNumber", e.currentTarget.value);
                      setFieldError("AccNumber", undefined);
                    }}
                    onBlur={() => setFieldError("AccNumber", undefined)}
                  />
                </div>
                <div className="flex flex-col sm:flex-row items-center w-full gap-x-7 gap-y-17">
                  <ProfileEditTextInput
                    placeholder="User IBAN Number"
                    value={values.ibanNumber}
                    id={"IBANNumber"}
                    name="IBANNumber"
                    type="text"
                    containerStyles="!sm:w-1/2"
                    label="IBAN Number"
                    onChange={(e) => {
                      setFieldValue("IBANNumber", e.currentTarget.value);
                      setFieldError("IBANNumber", undefined);
                    }}
                    onBlur={() => setFieldError("IBANNumber", undefined)}
                  />
                  {/* <ProfileEditTextInput
                    placeholder="User Paypal Account"
                    value={values.Paypal ? values.Paypal : "Not Provided yet"}
                    id={"Paypal"}
                    name="Paypal"
                    type="text"
                    containerStyles="!sm:w-1/2"
                    label="Paypal"
                    onChange={(e) => {
                      setFieldValue("Paypal", e.currentTarget.value);
                      setFieldError("Paypal", undefined);
                    }}
                  /> */}
                </div>
              </>
            )}
            {userDetails?.Role === "tp" && FALSE && (
              <>
                {isVerified && (
                  <PaymentDetailsSection
                    cardDetails={userDetails?.BankDetails}
                    paypalEmail={paypalEmail}
                    setPaypalEmail={setPaypalEmail}
                    errors={errors}
                    touched={touched}
                  />
                )}
              </>
            )}
            {userDetails?.Role === "both" && userType === "tp" && FALSE && (
              <>
                <PaymentDetailsSection
                  paypalEmail={paypalEmail}
                  setPaypalEmail={setPaypalEmail}
                  errors={errors}
                  touched={touched}
                />
              </>
            )}
            {userDetails?.Role === "both" && userType === "sp" && FALSE && (
              <>
                <div className="flex flex-col sm:flex-row items-center w-full gap-x-7 gap-y-17">
                  <ProfileEditTextInput
                    placeholder="User Bank Name"
                    // value={
                    //   values.BankDetails
                    //     ? values.BankDetails
                    //     : "Not Provided yet"
                    // }
                    value={values.bankName}
                    id={"bankName"}
                    name="bankName"
                    type="text"
                    containerStyles="!sm:w-1/2"
                    label="Bank Name"
                    onChange={(e) => {
                      setFieldValue("bankName", e.currentTarget.value);
                      setFieldError("bankName", undefined);
                    }}
                    onBlur={() => setFieldError("BankDetails", undefined)}
                  />
                  <ProfileEditTextInput
                    placeholder="User Account Number"
                    value={values.accountNumber}
                    id={"AccNumber"}
                    name="AccNumber"
                    type="text"
                    containerStyles="!sm:w-1/2"
                    label="Account Number"
                    onChange={(e) => {
                      setFieldValue("AccNumber", e.currentTarget.value);
                      setFieldError("AccNumber", undefined);
                    }}
                    onBlur={() => setFieldError("AccNumber", undefined)}
                  />
                </div>
                <div className="flex flex-col sm:flex-row items-center w-full gap-x-7 gap-y-17">
                  <ProfileEditTextInput
                    placeholder="User IBAN Number"
                    value={values.ibanNumber}
                    id={"IBANNumber"}
                    name="IBANNumber"
                    type="text"
                    containerStyles="!sm:w-1/2"
                    label="IBAN Number"
                    onChange={(e) => {
                      setFieldValue("IBANNumber", e.currentTarget.value);
                      setFieldError("IBANNumber", undefined);
                    }}
                    onBlur={() => setFieldError("IBANNumber", undefined)}
                  />
                  {/* <ProfileEditTextInput
                    placeholder="User Paypal Account"
                    value={values.Paypal ? values.Paypal : "Not Provided yet"}
                    id={"Paypal"}
                    name="Paypal"
                    type="text"
                    containerStyles="!sm:w-1/2"
                    label="Paypal"
                    onChange={(e) => {
                      setFieldValue("Paypal", e.currentTarget.value);
                      setFieldError("Paypal", undefined);
                    }}
                  /> */}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex justify-center">
          <div className="relative flex flex-col items-center gap-10">
            <div className="h-[140px] w-[140px] overflow-hidden rounded-full ring-[3px] ring-[#E8B923] ring-offset-2 ring-offset-white shadow-[0_8px_20px_rgba(232,185,35,0.25)] sm:h-[160px] sm:w-[160px] dark:ring-offset-[#0a1629] dark:shadow-[0_8px_20px_rgba(232,185,35,0.2)]">
              <img
                src={resolveAvatarDisplaySrc(
                  values.ProfilePictureURL || uploadedImage || ProfileImage
                )}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>

            <button
              type="button"
              aria-label="Choose profile photo"
              className={`absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-full ${roleClassesButton} text-white shadow-md transition hover:scale-95`}
              onClick={() => setShowAvatarModal(true)}
            >
              <img src={EditIcon} alt="" className="h-[14px] w-[14px]" />
            </button>

            <PrimaryButton
              typo="Remove Profile Image"
              styles={`${roleClassesButton} w-full max-w-[220px] h-[44px] cursor-pointer rounded-[12px]`}
              handleOnClick={() => {
                removeUploadedFile();
              }}
              type="button"
            />
          </div>
        </div>
      </div>

      <AvatarSelectModal
        open={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        gender={avatarGender}
        selectedUrl={values.ProfilePictureURL || uploadedImage || undefined}
        onConfirm={(url, selectedGender) => {
          void handleSelectAvatar(url, selectedGender);
        }}
        accentColor={role === "sp" ? "#9E2A2B" : "#0B538D"}
        onUploadFile={handleFileUpload}
      />

      {savingAvatar ? (
        <p className="poppins-regular mt-10 text-center text-[12px] text-[#6B7A8A] dark:text-slate-400">
          Saving profile photo...
        </p>
      ) : null}

      <div className="flex items-center w-full mx-auto justify-center py-40">
        <PrimaryButton
          typo={showLoading ? <SpinLoaderButton isLoading={true} /> : "Update"}
          styles={`w-full max-w-[328px] h-[48px] ${roleClassesButton} cursor-pointer`}
          handleOnClick={() => {
            handleSubmit();
            handleScrollTop();
          }}
          type="submit"
        />
      </div>
    </div>
  );
};

export default EditProfileDetailsSection;
