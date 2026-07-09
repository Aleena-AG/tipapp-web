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
import UploadIcon from "@/assets/svg/camera.svg";
import { ProfileImage } from "@/utils/constants/UsersData";
import EditIcon from "@/assets/svg/editIcon-profile.svg";
import { TbPencilCancel } from "react-icons/tb";
import { editProfileValidationSchema } from "@/utils/validations";
import { handleScrollTop } from "@/hooks/hooks";
import SpinLoaderButton from "@/components/atoms/laoder/spin-loader-secondary";
import useDateOfBirthValidation from "@/hooks/useDateOfBirthValidation";
import useAuth from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";

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
  const {
    mutate: uploadFile,
    isSuccess: fileUploadSuccess,
    data: uploadData,
    isError: isUploadError,
    error: uploadError,
  } = useUploadImage();
  const [paypalEmail, setPaypalEmail] = useState(userDetails?.Paypal || "");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [removed, setRemoved] = useState(false);
  const [showUploadButton, setShowUploadButton] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
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
    onSubmit: async (values) => {
      setShowLoading(true);
      try {
        if (userDetails) {
          await updateProfile(values);
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

  useEffect(() => {
    setFieldValue("Paypal", paypalEmail);
  }, [paypalEmail, setFieldValue]);

  const [fileInputKey] = useState(0);

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
      setShowUploadButton(false);
    }
  }, [fileUploadSuccess, uploadData, setFieldValue]);

  const toggleUploadButton = () => {
    setShowUploadButton(!showUploadButton);
  };

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
    localStorage.setItem("user", JSON.stringify(userDetails));
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
          <div className="flex flex-col items-center gap-10">
            {!showUploadButton && (
              <div className="max-h-[189px] min-h-[189px] max-w-[184px] min-w-[184px]">
                {removed && (
                  <>
                    <img
                      src={
                        values.ProfilePictureURL || uploadedImage || ProfileImage
                      }
                      alt="Profile"
                      className="w-full h-full rounded-4 object-contain"
                    />
                  </>
                )}
                {!removed && (
                  <>
                    <img
                      src={
                        values.ProfilePictureURL || uploadedImage || ProfileImage
                      }
                      alt="Profile"
                      className="w-full h-full object-cover rounded-4"
                    />
                  </>
                )}
              </div>
            )}
            {showUploadButton && (
              <div className="flex max-h-[189px] min-h-[189px] max-w-[184px] min-w-[184px] bg-white py-[30px] mx-auto border-[1px] border-[#DBDBDB] rounded-[8px] justify-center items-center relative overflow-hidden">
                <input
                  key={fileInputKey}
                  type="file"
                  // Frontend validation: HTML file type restriction - DISABLED
                  // accept="image/*"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt="Uploaded profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <button
                    type="button"
                    className="flex flex-col gap-[10px] justify-center items-center"
                  >
                    <img
                      src={UploadIcon}
                      alt="upload icon"
                      className="mr-2 h-5"
                    />
                    <span className="text-[#6F6F6F] text-sm poppins-medium leading-[21px]">
                      Upload Picture<br></br>(64KB-4MB)
                    </span>
                  </button>
                )}
              </div>
            )}
            {!showUploadButton && (
              <PrimaryButton
                typo="Remove Profile Image"
                styles={`${roleClassesButton} w-full max-w-[328px] h-[48px] cursor-pointer`}
                handleOnClick={() => {
                  removeUploadedFile();
                }}
                type="submit"
              />
            )}
          </div>
          <div className="relative">
            {!showUploadButton ? (
              <>
                <div
                  className={`cursor-pointer absolute top-0 right-0 trnasform translate-x-1/2 sm:translate-x-0 -translate-y-1/2 ${roleClassesButton} w-8 h-8 flex items-center justify-center rounded-full hover:scale-95 duration-500 gap-6`}
                  onClick={toggleUploadButton}
                >
                  <img src={EditIcon} alt="edit-icon" />
                </div>
              </>
            ) : (
              <>
                <div
                  className={`cursor-pointer absolute top-0 right-0 trnasform translate-x-1/2 sm:translate-x-0 -translate-y-1/2 ${roleClassesButton} w-8 h-8 flex items-center justify-center rounded-full hover:scale-95 duration-500 gap-6`}
                  onClick={toggleUploadButton}
                >
                  <TbPencilCancel className="w-5 h-5 text-white" />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
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
