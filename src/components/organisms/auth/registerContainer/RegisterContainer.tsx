 
import { PrimaryButton } from "@/components/atoms/buttons/primaryButton";
import { PrimaryTypo } from "@/components/atoms/typo/primaryTypo";
import UploadIcon from "@/assets/svg/camera.svg";
import AddressIcon from "@/assets/svg/address.svg";
import PhoneIcon from "@/assets/svg/phone.svg";
import WhatsappIcon from "@/assets/svg/whatapp.svg";
import CountryIcon from "@/assets/svg/country.svg";
import CityIcon from "@/assets/svg/city.svg";
import Dob from "@/assets/svg/dob.svg";
import Bankicon from "@/assets/svg/bank.svg";
import AccountIcon from "@/assets/svg/account.svg";
// import PaypalIcon from "@/assets/svg/paypal.svg";
import { Formik, Form, FormikHelpers, FormikProps } from "formik";
import TextArea from "@/components/atoms/textinput/textArea/TextArea";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import {
  useUploadImage,
  useUpdateUser,
  useGetCurrentUser,
} from "@/api/authApi";
import useAuth from "@/hooks/useAuth";
import ToastProvider from "@/providers/ToastProvider";
import TextInput from "@/components/atoms/textinput/textInput/TextInput";
import { useLocation, useNavigate } from "react-router-dom";
import { generateRegistrationValidationSchema } from "@/utils/validations";
import useDateOfBirthValidation from "@/hooks/useDateOfBirthValidation";
import { useTranslation } from "react-i18next";
import countryList from "react-select-country-list";
import SpinLoaderButton from "@/components/atoms/laoder/spin-loader-secondary";
import { SafeImage } from "@/components/atoms/images/SafeImage";
import { isLegacyFirebaseImageUrl } from "@/utils/imageUtils";
import { FaArrowLeft } from "react-icons/fa";

interface FormValues {
  // Username: string;
  FirstName: string;
  LastName: string;
  Address: string;
  Email: string;
  Phone: string;
  Whatsapp: string;
  Country: string;
  CountryCode: string;
  City: string;
  Bio: string;
  // bankName: string;
  // accountNumber: string;
  // ibanNumber: string;
  DateOfBirth: string;
  // paypal: string;
}

const initialValues: FormValues = {
  // Username: "",
  FirstName: "",
  LastName: "",
  Address: "",
  Email: "",
  Phone: "",
  Whatsapp: "",
  Country: "United Kingdom",
  CountryCode: "GB",
  City: "",
  Bio: "",
  // bankName: "Test",
  // accountNumber: "",
  // ibanNumber: "GB89370400440532013000",
  // paypal: "",
  DateOfBirth: "2000-01-01",
};

function buildInitialFormValues(): FormValues {
  const values: FormValues = { ...initialValues };

  try {
    const googleDataString = localStorage.getItem("googleProfileData");
    if (googleDataString) {
      const googleData = JSON.parse(googleDataString) as {
        firstName?: string;
        lastName?: string;
      };
      values.FirstName = googleData.firstName || values.FirstName;
      values.LastName = googleData.lastName || values.LastName;
    }

    const storedUserString = localStorage.getItem("user");
    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString) as Partial<FormValues> & {
        ProfilePictureURL?: string;
      };
      values.FirstName = storedUser.FirstName || values.FirstName;
      values.LastName = storedUser.LastName || values.LastName;
      values.Address = storedUser.Address || values.Address;
      values.Email = storedUser.Email || values.Email;
      values.Phone = storedUser.Phone || values.Phone;
      values.Whatsapp = storedUser.Whatsapp || values.Whatsapp;
      values.City = storedUser.City || values.City;
      values.Bio = storedUser.Bio || values.Bio;
      values.DateOfBirth = storedUser.DateOfBirth || values.DateOfBirth;
    }
  } catch {
    // ignore malformed local storage
  }

  return values;
}

function getInitialUploadedImage(): string | null {
  try {
    const googleDataString = localStorage.getItem("googleProfileData");
    if (googleDataString) {
      const googleData = JSON.parse(googleDataString) as {
        profilePictureUrl?: string;
      };
      if (
        googleData.profilePictureUrl &&
        !isLegacyFirebaseImageUrl(googleData.profilePictureUrl)
      ) {
        return googleData.profilePictureUrl;
      }
    }

    const storedUserString = localStorage.getItem("user");
    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString) as {
        ProfilePictureURL?: string;
      };
      if (
        storedUser.ProfilePictureURL &&
        !isLegacyFirebaseImageUrl(storedUser.ProfilePictureURL)
      ) {
        return storedUser.ProfilePictureURL;
      }
    }
  } catch {
    // ignore malformed local storage
  }

  return null;
}

const RegistrationContainer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const showBankDetails = false;
  const { getMaxDate, getMinDate } = useDateOfBirthValidation();
  const countries = useMemo(() => countryList().getData(), []);
  const validationSchema = useMemo(
    () => generateRegistrationValidationSchema(showBankDetails),
    [showBankDetails]
  );
  const formikRef = useRef<FormikProps<FormValues>>(null);
  const hasPrefilledFromApiRef = useRef(false);
  const initialFormValues = useMemo(() => buildInitialFormValues(), []);
  const {
    mutate: uploadFile,
    isSuccess: fileUploadSuccess,
    data: uploadData,
    isError: isUploadError,
    error: uploadError,
  } = useUploadImage();
  const [uploadedImage, setUploadedImage] = useState<string | null>(
    getInitialUploadedImage
  );
  const [fileInputKey] = useState(0);
  const {
    handleRegisterRedirect,
    getCurrentEmail,
    setCurrentUser,
    getCurrentUserId,
    getCurrentUserRole,
  } = useAuth();
  const [isdisable, setdisable] = useState(false);
  const { role } = useLocation().state || { role: "" };
  const { mutate: updateUser, isLoading: isUpdating, isSuccess: isUpdateSuccess, data: updateData, isError: isUpdateError, error: updateError } = useUpdateUser();
  const { data: currentUser } = useGetCurrentUser();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (role === "sp" || role === "tp") {
      localStorage.setItem("userType", role);
    }
  }, [role]);

  useEffect(() => {
    if (!currentUser || hasPrefilledFromApiRef.current) return;

    const applyPrefill = () => {
      const form = formikRef.current;
      if (!form) return false;

      hasPrefilledFromApiRef.current = true;
      const { values, setFieldValue } = form;

      const prefillField = (
        field: keyof FormValues,
        nextValue?: string | null
      ) => {
        if (!nextValue || values[field]) return;
        void setFieldValue(field, nextValue);
      };

      prefillField("FirstName", currentUser.FirstName);
      prefillField("LastName", currentUser.LastName);
      prefillField("Address", currentUser.Address);
      prefillField("Email", currentUser.Email);
      prefillField("Phone", currentUser.Phone);
      prefillField("Whatsapp", currentUser.Whatsapp);
      prefillField("City", currentUser.City);
      prefillField("Bio", currentUser.Bio);
      prefillField("DateOfBirth", currentUser.DateOfBirth);

      if (
        !uploadedImage &&
        currentUser.ProfilePictureURL &&
        !isLegacyFirebaseImageUrl(currentUser.ProfilePictureURL)
      ) {
        setUploadedImage(currentUser.ProfilePictureURL);
      }

      return true;
    };

    if (!applyPrefill()) {
      requestAnimationFrame(() => {
        applyPrefill();
      });
    }
  }, [currentUser, uploadedImage]);

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

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    const resolvedRole =
      (await getCurrentUserRole()) ||
      role ||
      localStorage.getItem("userType") ||
      "";
    const id = (await getCurrentUserId()) || "";
    const email = currentUser?.Email || (await getCurrentEmail()) || "";

    if (!id) {
      ToastProvider.error("Please login again");
      return;
    }
    if (!resolvedRole) {
      ToastProvider.error("Please select tipper or service provider first");
      return;
    }

    // Removed bank name check for sp since pre-filled

    const registerData = { ...values, Country: values.CountryCode };

    updateUser(
      {
        ...registerData,
        KeyCloakID: id,
        Role: resolvedRole,
        ProfilePictureURL: uploadedImage || "",
        Email: email,
      },
      {
        onSuccess: () => {
          // Update localStorage with the updated user data
          const updatedUser = {
            ...currentUser,
            ...registerData,
            KeyCloakID: id,
            Role: resolvedRole,
            ProfilePictureURL: uploadedImage || "",
            Email: email,
          };
          setCurrentUser(updatedUser);

          ToastProvider.success("Profile updated successfully!");
          handleRegisterRedirect();
        },
        onError: (error) => {
          console.error("Update error:", error);
          ToastProvider.error(error?.response?.data?.message || "An error occurred. Please try again.");
        },
      }
    );
    setSubmitting(false);
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
    }
  }, [fileUploadSuccess, uploadData]);

  useEffect(() => {
    if (isUpdateError && updateError) {
      console.error(
        "Update error:",
        updateError.response?.data?.message || updateError.message
      );
      ToastProvider.error(
        updateError.response?.data?.message || "An error occurred. Please try again."
      );
    }
  }, [isUpdateError, updateError]);

  useEffect(() => {
    if (isUpdateSuccess && updateData) {
      // Invalidate the user query to force refetch (redirect runs in mutate onSuccess)
      queryClient.invalidateQueries(["get_current_user", "v2"]);
      ToastProvider.success(
        updateData.message || "Profile updated successfully!"
      );
    }
  }, [isUpdateSuccess, updateData, queryClient]);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    navigate("/user-selection");
  }

  {/* Color role handling */ }
  const colorRole = typeof window !== "undefined" ? localStorage.getItem("userType") : null; // "tp" | "sp" | null
  const roleClassesBorder =
    colorRole === "tp"
      ? "md:border md:border-[#0B538D] md:shadow-[0_0_15px_0_rgba(11,83,141,0.5)]"
      : colorRole === "sp"
        ? "md:border md:border-[#d71921] md:shadow-[0_0_15px_0_rgba(215,25,33,0.5)]"
        : "";


  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialFormValues}
      validationSchema={validationSchema}
      validateOnChange={false}
      validateOnBlur
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, dirty, isSubmitting }) => (
        <div className="bg-app-page min-w-[300px] sm:px-[20px] xl:px-[60px]">
          <Form
            className={`max-w-[600px]    ${showBankDetails
              ? "g-red-600"
              : " sm:max-w-[335px] max-w-[320px] md:max-w-[688px] lg:max-w-[843px]"
              }  mx-auto   bg-card   rounded-[16px] lg:px-[70px] py-[44px] lg:py-[30px] px-[20px] flex flex-col justify-between ${roleClassesBorder}`}
          >
              <div className="flex justify-start mb-4">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-gray-800 translation-colors duration-200"
                  type="button">
                  <FaArrowLeft className="text-sm" />
                  <span className="text-sm poppins-medium">
                    {t("buttons.back")}
                  </span>
                </button>
              </div>
              <PrimaryTypo
                typo={showBankDetails ? "Bank Details" : "Registration"}
                styles="text-center   text-[24px] mb-[14px] lg:mb-[45px]"
              />
              {showBankDetails && role === "sp" ? (
                <div className="flex flex-col   max-w-5xl gap-[10px]">
                  <TextInput
                    name="bankName"
                    placeholder="Bank Name"
                    inputStyles="lg:w-[500px] max-lg:w-[290px]"
                    iconLeft={<img src={Bankicon} alt="city icon" />}
                    label="Bank Name"
                    className="flex flex-col gap-[10px] w-full "
                    isRequired={true}
                    autoComplete="off"
                  />
                  {/* Show different fields based on country selection */}
                  {values.CountryCode === 'US' ? (
                    // US: Show Account Number only (routing number is hardcoded in backend for testing)
                    <TextInput
                      name="accountNumber"
                      placeholder="Account Number"
                      inputStyles="lg:w-[500px] max-lg:w-[290px]"
                      iconLeft={<img src={AccountIcon} alt="account icon" />}
                      label="Account Number"
                      className="flex flex-col gap-[10px]"
                      isRequired={true}
                      autoComplete="off"
                    />
                  ) : (
                    // Non-US: Show IBAN only
                    <TextInput
                      name="ibanNumber"
                      placeholder="IBAN Number (e.g., GB82WEST12345698765432 for testing)"
                      inputStyles="lg:w-[500px] max-lg:w-[290px] "
                      iconLeft={<img src={AccountIcon} alt="account icon" />}
                      label="IBAN Number"
                      className="flex flex-col gap-[10px]"
                      isRequired={true}
                      autoComplete="off"
                    />
                  )}
                  {/* <TextInput
                  name="paypal"
                  placeholder="Paypal"
                  inputStyles="lg:w-[500px] max-lg:w-[290px]"
                  iconLeft={<img src={PaypalIcon} alt="account icon" />}
                  label="Paypal"
                  className="flex flex-col gap-[10px]"
                  isRequired={false}
                /> */}
                </div>
              ) : (
                <div className="flex-col flex md:flex-row-reverse  0  items-start gap-[47px]">
                  <div className="flex max-w-[330px] md:max-w-[184px]  lg:w-full max-lg:w-[200px] max-lg:h-[200px] md:h-[206px] bg-card py-[30px] mx-auto border-[1px] border-[#DBDBDB] rounded-[8px] justify-center items-center relative overflow-hidden">
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
                      <SafeImage
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
                        <span className="text-app-muted text-sm poppins-medium leading-[21px]">
                          Upload Picture <br></br>(64KB-4MB)
                        </span>
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col max-w-[466px] gap-[16px] w-full mx-auto">
                    {/* <TextInput
                    label="User Name"
                    name="Username"
                    placeholder="User Name"
                    inputStyles="lg:w-full max-lg:w-[200px]  "
                    className="flex flex-col gap-[10px] "
                    isRequired={true}
                  /> */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                      <TextInput
                        name="FirstName"
                        placeholder="First Name"
                        inputStyles=" "
                        label="First Name"
                        className="flex flex-col gap-[10px]"
                        isRequired={true}
                        autoComplete="off"
                      />

                      <TextInput
                        name="LastName"
                        placeholder="Last Name"
                        inputStyles=" "
                        label="Last Name"
                        className="flex flex-col gap-[10px]"
                        isRequired={true}
                        autoComplete="off"
                      />
                    </div>
                    <TextInput
                      name="Address"
                      placeholder="Street Address"
                      inputStyles=""
                      iconLeft={<img src={AddressIcon} alt="address icon" />}
                      label="Address"
                      className="flex flex-col gap-[10px]"
                      isRequired={true}
                      autoComplete="off"
                    />
                    <TextInput
                      name="DateOfBirth"
                      placeholder="Date Of Birth"
                      inputStyles=""
                      iconLeft={<img src={Dob} alt="calender icon" />}
                      label="Date Of Birth"
                      className="hidden"
                      type="date"
                      isRequired={true}
                      max={getMaxDate()}
                      min={getMinDate()}
                      autoComplete="off"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px]">
                      <TextInput
                        name="Phone"
                        placeholder="Phone (e.g., +1234567890)"
                        inputStyles=""
                        iconLeft={<img src={PhoneIcon} alt="phone icon" />}
                        label="Phone"
                        className="flex flex-col gap-[10px]"
                        type="tel"
                        isRequired={true}
                        autoComplete="off"
                      />
                      <div>
                        <TextInput
                          name="Whatsapp"
                          placeholder="Whatsapp (e.g., +1234567890)"
                          inputStyles=""
                          iconLeft={<img src={WhatsappIcon} alt="country icon" />}
                          label="Whatsapp"
                          className="flex flex-col gap-[10px]"
                          type="tel"
                          disabled={isdisable}
                          autoComplete="off"
                        />
                        <div className="flex gap-[8px] justify-start items-center h-fit">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFieldValue("Whatsapp", values.Phone);
                                setdisable(!isdisable);
                              } else {
                                setFieldValue("Whatsapp", "");
                                setdisable(!isdisable);
                              }
                            }}
                            checked={values.Whatsapp === values.Phone}
                            disabled={!values.Phone}
                          />

                          <label
                            className={`${values.Phone ? "opacity-100" : "opacity-40"
                              } text-[#999999] text-sm poppins-medium leading-[21px]`}
                          >
                            Use same number
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                      <div className="flex flex-col gap-[10px]">
                        <label htmlFor="country-select" className="text-sm font-medium text-[#333333]">
                          Country <span className="text-red-500">*</span>
                        </label>
                        <div className="relative h-10">
                          <img
                            src={CountryIcon}
                            alt="country icon"
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none z-10"
                          />
                          <select
                            id="country-select"
                            name="Country"
                            value={'GB'}
                            onChange={(e) => {
                              const selectedCountry = countries.find(
                                (c: { value: string; label: string }) => c.value === e.target.value
                              );
                              setFieldValue("CountryCode", e.target.value);
                              setFieldValue("Country", selectedCountry?.label || "");
                            }}
                            disabled
                            className="w-full h-[40px] pl-[32px] pr-4 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-card"
                            autoComplete="off"
                          >
                            <option value="">Select Country</option>
                            {countries.map((country: { value: string; label: string }) => (
                              <option key={country.value} value={country.value}>
                                {country.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <TextInput
                        name="City"
                        placeholder="City"
                        inputStyles=""
                        iconLeft={<img src={CityIcon} alt="city icon" />}
                        label="City"
                        className="flex flex-col gap-[10px]"
                        isRequired={true}
                        autoComplete="off"
                      />
                    </div>
                    <TextArea
                      name="Bio"
                      placeholder="Type Here"
                      inputStyles="lg:w-full max-lg:w-[290px] "
                      label="Bio"
                      isRequired={false}
                    />
                  </div>
                </div>
              )}
              {role === "sp" && !showBankDetails ? (
                <div className="flex justify-center items-center">
                  <PrimaryButton
                    typo={
                      isSubmitting || isUpdating ? (
                        <SpinLoaderButton isLoading={true} />
                      ) : (
                        "Next"
                      )
                    }
                    styles="max-w-[328px] w-full   mt-[50px] !rounded-md text-white text-base"
                    type="submit"
                    isDisable={isSubmitting || isUpdating || !dirty}
                  />
                </div>
              ) : (
                <div className="flex justify-center items-center">
                  <PrimaryButton
                    typo={`${isUpdating
                      ? t("common.uploadingDetails")
                      : "Save"
                      }`}
                    styles="max-w-[328px] w-full   mt-[30px] !rounded-md text-white text-base"
                    type="submit"
                    isDisable={!dirty || isUpdating}
                    handleOnClick={() => {
                      scrollTop();
                    }}
                  />
                </div>
              )}
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default RegistrationContainer;
