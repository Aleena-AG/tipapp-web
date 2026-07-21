/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { SecondaryTypo } from "@/components/atoms/typo/secondaryTypo";
import Rating from "@/components/atoms/rating/Rating";
import TextArea from "@/components/atoms/textinput/textArea/TextArea";
import { useNavigate, useParams } from "react-router-dom";
import { useGetUserDetails } from "@/api/authApi";
import ToastProvider from "@/providers/ToastProvider";
import useAuth from "@/hooks/useAuth";
import BounceLoader from "react-spinners/ClipLoader";
import { SafeImage } from "@/components/atoms/images/SafeImage";
import { handleScrollTop } from "@/hooks/hooks";
import { CurrencyContext } from "@/App";
import { useCreateTipPaymentIntent } from "@/api/managePayments";
import { setPendingTipPayment } from "@/utils/pendingTipStorage";
import { useWithdrawAndTipLimit } from "@/api/tipManagement";
import { useTranslation } from "react-i18next";
import { useDisableButton } from "@/components/atoms/buttons/DisableButtonContext";
import {
  getUserDisplayName,
  parseKeycloakUserDetailsResponse,
} from "@/utils/userProfile";
import { getRoleAvatarFallback } from "@/utils/imageUtils";
import { FaArrowLeft } from "react-icons/fa";
import {
  ChevronRight,
  BadgeCheck,
  ShieldCheck,
  Zap,
  Smile,
  Star,
} from "lucide-react";
import { AiFillStar } from "react-icons/ai";
import TipSendMascot from "@/assets/images/tp-send.png";
import TipJarMascot from "@/assets/images/tip-jar.png";

const TipAmountInput = (props: any & { t: any }) => {
  const [value, setValue] = useState("0.00");
  const { setDisableButton } = useDisableButton();
  const { data: TipLimitData } = useWithdrawAndTipLimit();
  const { currency } = useContext(CurrencyContext);
  const maxTip = TipLimitData?.tippingLimit.maximumAmount;

  useEffect(() => {
    setValue("1.00");
    props.onChange(1.00);
    setDisableButton(false);
  }, []);

  const [, setIsEditable] = useState(false);

  const incrementValue = () => {
    const newValue = (parseFloat(value) + 1).toFixed(2);

    if (parseFloat(newValue) <= maxTip) {
      setValue(newValue);
      setIsEditable(true);
      props.onChange(parseFloat(newValue));
      setDisableButton(false);
    } else {
      ToastProvider.error(
        `Maximum amount should be ${maxTip?.toFixed(2)} ${currency}`
      );
      setDisableButton(true);
    }
  };

  const decrementValue = () => {
    const newValue = (parseFloat(value) - 1).toFixed(2);
    if (parseFloat(newValue) >= 1) {
      setValue(newValue);
      setIsEditable(true);
      props.onChange(parseFloat(newValue));
      setDisableButton(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (/^\d+(\.\d{0,2})?$/.test(inputValue)) {
      setValue(inputValue);
      setIsEditable(true);
      props.onChange(parseFloat(inputValue));

      // Check validation and set button state
      if (parseFloat(inputValue) < 1) {
        setDisableButton(true);
      } else if (parseFloat(inputValue) > maxTip) {
        ToastProvider.error(
          `Maximum amount should be ${maxTip?.toFixed(2)} ${currency}`
        );
        setDisableButton(true);
      } else {
        setDisableButton(false);
      }
    }
  };

  const handleBlur = () => {
    if (!value.includes(".")) {
      setValue(parseFloat(value).toFixed(2));
    } else if (value.split(".")[1].length < 2) {
      setValue(parseFloat(value).toFixed(2));
    }
  };

  return (
    <div className="mt-[30px] flex flex-col items-center">
      <SecondaryTypo
        typo={props.t("common.amount")}
        styles="text-app text-center text-[14px] mb-8"
      />
      <div className="mt-12 flex w-full items-center justify-between gap-16">
        <button
          className={`flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-[16px] border border-[#E4EDF5] bg-card text-[32px] leading-none text-[#0B538D] transition-colors hover:bg-[#EAF3FA] ${
            parseFloat(value) <= 1 ? "cursor-not-allowed opacity-40" : ""
          }`}
          onClick={decrementValue}
          type="button"
          disabled={parseFloat(value) <= 1}
        >
          <span className="-mt-4">−</span>
        </button>
        <div className="flex min-w-0 flex-1 flex-col items-center">
          <input
            type="text"
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full max-w-[160px] rounded-md border-none text-center text-[42px] font-poppins-thin text-app outline-none"
          />
          <SecondaryTypo
            typo={currency}
            styles="text-[#7A7A7A] dark:text-slate-400 text-center text-[13px] mt-2"
          />
        </div>
        <button
          className="flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-[16px] bg-[#0B538D] text-[32px] leading-none text-white transition-colors hover:bg-[#0077B6]"
          onClick={incrementValue}
          type="button"
        >
          <span className="-mt-4">+</span>
        </button>
      </div>
    </div>
  );
};

const QrResultContainer = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState({
    FirstName: "--",
    LastName: "--",
    id: "--",
    Bio: "--",
    ProfilePictureURL: "",
  });
  const { disablebutton } = useDisableButton();

  const [isTipScreenOpen, setIsTipScreenOpen] = useState(false);
  const { currency } = useContext(CurrencyContext);
  const {
    mutate: getUserDetailsMutate,
    isSuccess: isGetUserDetailsSuccess,
    data: getUserDetailsData,
    isError: isGetUserDetailsError,
    error: getUserDetailsError,
    isLoading: isGetUserDetailsLoading,
  } = useGetUserDetails();

  const {
    mutateAsync: createTipPaymentIntentAsync,
    isLoading: isPaymentIntentLoading,
  } = useCreateTipPaymentIntent(
    undefined,
    (error: string) => {
      ToastProvider.error(error || "Failed to create payment intent");
    }
  );

  const { getCurrentUserId } = useAuth();
  const { id } = useParams();
  localStorage.setItem("ServiceProviderID", id as any);

  const initialValues = {
    rating: 0,
    review: "",
    tip: 0,
  };

  const navigate = useNavigate();

  const validationSchema = Yup.object({
    rating: Yup.number().max(5).optional(),
    review: Yup.string().optional(),
    tip: Yup.number().optional(),
  });

  interface FormValues {
    rating: number;
    review: string;
    tip: number;
  }

  const handleSubmit = async (values: FormValues) => {
    const token = localStorage.getItem("token");
    const userid = (await getCurrentUserId()) || "";
    if (!token || !userid) {
      ToastProvider.error("Please login to continue");
      navigate("/sign-in");
      return;
    }
    if (!id) {
      ToastProvider.error("Service provider not found");
      return;
    }
    if (values.rating === 0) {
      ToastProvider.error("Rating cannot be 0");
      return;
    }
    if (values.tip < 1) {
      ToastProvider.error(`Please add an amount of at least 1.00 ${currency}`);
      return;
    }
    const tipData = {
      TipperID: userid,
      ServiceProviderID: id,
      Amount: values.tip,
      Currency: currency,
      TipDate: new Date(),
      Review: values.review,
      Rating: values.rating,
      recipientName: getUserDisplayName(user),
      recipientProfileUrl: user.ProfilePictureURL,
    };

    const amountInCents = Math.round(values.tip * 100);

    try {
      const result = await createTipPaymentIntentAsync({
        amount: amountInCents,
        currency: currency.toLowerCase(),
        serviceProviderId: id,
      });

      setPendingTipPayment({
        tipData: {
          ...tipData,
          TipDate: tipData.TipDate.toISOString(),
        },
        paymentIntentId: result.paymentIntentId,
        clientSecret: result.clientSecret,
      });

      navigate("/payment", {
        state: {
          tipData,
          clientSecret: result.clientSecret,
          paymentIntentId: result.paymentIntentId,
        },
      });
    } catch (error: any) {
      console.error("Failed to create payment intent:", error);
      const status = error?.response?.status;
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create payment intent. Please try again.";
      if (status === 401) {
        ToastProvider.error("Please login to continue");
        navigate("/sign-in");
        return;
      }
      ToastProvider.error(message);
    }
  };

  useEffect(() => {
    if (isGetUserDetailsSuccess && getUserDetailsData) {
      const userData = parseKeycloakUserDetailsResponse(getUserDetailsData);
      if (!userData) return;

      // Check if user is banned
      if (userData?.Status === "banned") {
        ToastProvider.error(
          "This service provider is currently unavailable to receive tips. Please try another service provider."
        );
        navigate("/tip-provider");
        return;
      }

      setUser({
        FirstName: userData.FirstName ?? "--",
        LastName: userData.LastName ?? "--",
        id: String(userData.KeyCloakID ?? userData.id ?? "--"),
        Bio: userData.Bio ?? "--",
        ProfilePictureURL: userData.ProfilePictureURL ?? "",
      });
    }
  }, [isGetUserDetailsSuccess, getUserDetailsData, navigate]);

  useEffect(() => {
    if (isGetUserDetailsError && getUserDetailsError) {
      console.error(
        "User details error:",
        getUserDetailsError.response?.data?.message ||
          getUserDetailsError.message
      );
      if (getUserDetailsError.response?.status === 401) {
        ToastProvider.error("Please login to continue");
        navigate("/sign-in");
      } else {
        // Handle other errors (network issues, etc.) but not 400 since validation happens before navigation
        ToastProvider.error(
          getUserDetailsError.response?.data?.message ||
            getUserDetailsError.message ||
            "Failed to load user details. Please try again."
        );
        // Navigate back to tip provider page for any error except 401
        setTimeout(() => {
          navigate("/tip-provider");
        }, 2000);
      }
    }
  }, [isGetUserDetailsError, getUserDetailsError, navigate]);

  useEffect(() => {
    getUserDetailsMutate(id);
  }, [id]);

  const handleBackToHome = () => {
    navigate("/tip-provider");
  };

  if (isGetUserDetailsLoading) {
    return (
      <div className="mx-auto flex min-h-[320px] w-full max-w-[480px] flex-col items-center justify-center gap-16 rounded-[20px] border border-[#E4EDF5] bg-card p-32 shadow-sm">
        <BounceLoader
          color={"#0B538D"}
          loading={isGetUserDetailsLoading}
          size={56}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        <p className="poppins-medium text-[14px] text-[#7A7A7A] dark:text-slate-400">
          {t("common.loading")}
        </p>
      </div>
    );
  }

  const trustBadges = [
    {
      icon: ShieldCheck,
      title: t("common.secureTipping"),
      desc: t("common.secureTippingDesc"),
    },
    {
      icon: Zap,
      title: t("common.instantPayment"),
      desc: t("common.instantPaymentDesc"),
    },
    {
      icon: Smile,
      title: t("common.leaveFeedback"),
      desc: t("common.leaveFeedbackDesc"),
    },
  ];

  const tipBadges = [
    {
      icon: Smile,
      title: t("common.positiveFeedback"),
      desc: t("common.positiveFeedbackDesc"),
      iconColor: "text-[#0B538D]",
      iconBg: "bg-[#EAF4FF]",
    },
    {
      icon: Zap,
      title: t("common.fastEasyTipping"),
      desc: t("common.fastEasyTippingDesc"),
      iconColor: "text-[#1EA672]",
      iconBg: "bg-[#E6F7EF]",
    },
    {
      icon: ShieldCheck,
      title: t("common.securePrivate"),
      desc: t("common.securePrivateDesc"),
      iconColor: "text-[#8B5CF6]",
      iconBg: "bg-[#F1EBFE]",
    },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[1180px] px-4">
      {/* Decorative dot grids */}
      <div
        className="pointer-events-none absolute right-2 top-4 hidden h-24 w-28 opacity-50 lg:block"
        style={{
          backgroundImage:
            "radial-gradient(rgba(11,83,141,0.25) 1.5px, transparent 1.5px)",
          backgroundSize: "13px 13px",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-2 left-2 hidden h-24 w-28 opacity-50 lg:block"
        style={{
          backgroundImage:
            "radial-gradient(rgba(11,83,141,0.2) 1.5px, transparent 1.5px)",
          backgroundSize: "13px 13px",
        }}
      />

      {/* Page header */}
      <div className="mb-24 flex flex-col gap-16">
        <button
          type="button"
          onClick={isTipScreenOpen ? () => setIsTipScreenOpen(false) : handleBackToHome}
          className="inline-flex w-fit items-center gap-8 rounded-full border border-[#E4EDF5] bg-card px-16 py-8 text-[#0B538D] shadow-[0_4px_12px_rgba(11,83,141,0.08)] transition-colors hover:bg-[#EAF3FA]"
        >
          <FaArrowLeft className="text-[12px]" />
          <span className="poppins-semibold text-[13px]">{t("buttons.back")}</span>
        </button>

        <div>
          <h1 className="poppins-semibold text-[30px] leading-[1.1] tracking-[-0.03em] text-[#0B2B4E] dark:text-white sm:text-[40px]">
            {isTipScreenOpen
              ? t("common.rateMyWork")
              : t("userSelection.serviceProvider")}
          </h1>
          <p className="poppins-regular mt-8 max-w-[480px] text-[14px] text-[#6F7682] dark:text-slate-400 sm:text-[15px]">
            {isTipScreenOpen
              ? t("common.whatElseCanIDoToImproveMyService")
              : t("common.reviewProviderBeforeTipping")}
          </p>
        </div>
      </div>

      <div className="relative grid grid-cols-1 gap-32 lg:grid-cols-2 lg:items-center lg:gap-[56px]">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form className="w-full max-w-[440px] overflow-hidden rounded-[20px] border border-[#E4EDF5] bg-card shadow-[0_8px_32px_rgba(11,83,141,0.08)]">
              {/* Top bar */}
              <div className="flex items-center gap-12 border-b border-[#EEF2F6] px-20 py-16">
                {isTipScreenOpen && (
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EAF4FF]">
                    <Star className="h-[18px] w-[18px] fill-[#0B538D] text-[#0B538D]" />
                  </span>
                )}
                <div>
                  <h2 className="poppins-semibold text-[17px] text-[#0B538D] sm:text-[18px]">
                    {isTipScreenOpen
                      ? t("common.rateMyWork")
                      : t("userSelection.serviceProvider")}
                  </h2>
                  {!isTipScreenOpen && (
                    <p className="poppins-regular text-[12px] text-[#7A7A7A] dark:text-slate-400">
                      {t("common.scanToGetStarted")}
                    </p>
                  )}
                </div>
              </div>

              {!isTipScreenOpen && (
                <div className="flex flex-col px-20 pb-24 pt-24 sm:px-28">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full">
                      <SafeImage
                        src={user.ProfilePictureURL}
                        fallbackSrc={getRoleAvatarFallback("sp")}
                        className="h-[128px] w-[128px] rounded-full object-cover"
                        alt="profile"
                      />
                    </div>
                    <div className="mt-16 flex items-center justify-center gap-6">
                      <h3 className="poppins-semibold text-center text-[20px] text-app">
                        {getUserDisplayName(user) || "User Not Found"}
                      </h3>
                      {user.id && (
                        <BadgeCheck className="h-5 w-5 shrink-0 fill-[#0B538D] text-white" />
                      )}
                    </div>
                  </div>

                  <div className="mt-24">
                    <div className="rounded-[12px] bg-[#F8FBFE] px-16 py-12 dark:bg-[#12233d] dark:ring-1 dark:ring-white/10">
                      <p className="poppins-medium text-[11px] text-[#7A7A7A] dark:text-slate-400">
                        {t("common.description")}
                      </p>
                      <p className="poppins-regular mt-4 line-clamp-3 text-[13px] leading-[22px] text-[#141414] dark:text-white">
                        {user?.Bio && user.Bio !== "--"
                          ? user.Bio.toString()
                          : t("common.noDescriptionYet")}
                      </p>
                    </div>
                  </div>

                  {user.id && (
                    <div className="mt-24 flex flex-col gap-12">
                      <button
                        type="button"
                        onClick={() => setIsTipScreenOpen(true)}
                        className="flex h-[48px] w-full items-center justify-center gap-8 rounded-[12px] bg-[#0B538D] text-white transition-colors hover:bg-[#0077B6]"
                      >
                        <span className="poppins-semibold text-[15px]">
                          {t("common.tipAndServiceReview")}
                        </span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {isTipScreenOpen && (
                <div className="flex flex-col px-20 pb-28 pt-24 sm:px-28">
                  <div className="flex justify-center">
                    <Field name="rating">
                      {({ field }: any) => (
                        <Rating
                          value={field.value}
                          onChange={(value) => setFieldValue("rating", value)}
                        />
                      )}
                    </Field>
                  </div>

                  <div className="mt-20 w-full">
                    <SecondaryTypo
                      typo={t("common.whatElseCanIDoToImproveMyService")}
                      styles="text-[14px] text-app"
                    />
                    <div className="mt-8 w-full">
                      <TextArea
                        name="review"
                        placeholder={t("common.typeHere")}
                        containerStyles="w-full"
                        inputStyles="w-full"
                      />
                    </div>
                  </div>

                  <Field name="tip">
                    {({ field }: any) => (
                      <TipAmountInput
                        value={field.value}
                        onChange={(newAmount: number) => {
                          setFieldValue("tip", newAmount);
                        }}
                        t={t}
                      />
                    )}
                  </Field>

                  <button
                    type="submit"
                    onClick={() => handleScrollTop()}
                    disabled={disablebutton}
                    className={`mt-16 flex h-[48px] w-full items-center justify-center rounded-[12px] bg-[#0B538D] text-white transition-colors hover:bg-[#0077B6] ${
                      disablebutton ? "cursor-not-allowed opacity-40" : ""
                    }`}
                  >
                    <span className="poppins-semibold text-[15px]">
                      {isPaymentIntentLoading
                        ? t("common.processing")
                        : t("common.submit")}
                    </span>
                  </button>
                </div>
              )}
            </Form>
          )}
        </Formik>

        {/* Appreciate section — desktop only */}
        {!isTipScreenOpen && (
          <div className="hidden lg:flex lg:flex-col lg:gap-32">
            <div className="flex items-center gap-24">
              <div className="relative flex shrink-0 items-center justify-center">
                <div className="absolute h-[320px] w-[320px] rounded-full bg-gradient-to-br from-[#EAF4FF] via-[#D7EAF9] to-[#CFE4F6]" />
                <div className="absolute h-[370px] w-[370px] rounded-full border border-[#0B538D]/10" />
                <img
                  src={TipSendMascot}
                  alt="Tip mascot"
                  className="relative z-10 h-[360px] w-auto object-contain drop-shadow-[0_26px_50px_rgba(11,83,141,0.18)]"
                />
              </div>

              <div className="min-w-0">
                <h2 className="poppins-semibold text-[28px] leading-[1.1] tracking-[-0.03em] text-[#0B2B4E] dark:text-white xl:text-[32px]">
                  {t("common.readyToAppreciateLine1")}{" "}
                  <span className="text-[#0B538D]">
                    {t("common.readyToAppreciateLine2")}
                  </span>
                </h2>
                <p className="poppins-regular mt-12 max-w-[280px] text-[15px] leading-relaxed text-[#6F7682] dark:text-slate-400">
                  {t("common.readyToAppreciateSubtext")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-12">
              {trustBadges.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-[16px] border border-[#E5EEF7] bg-card p-16 shadow-[0_10px_28px_rgba(11,83,141,0.06)]"
                >
                  <span className="mb-12 flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF4FF]">
                    <Icon className="h-5 w-5 text-[#0B538D]" />
                  </span>
                  <h3 className="poppins-semibold text-[13px] text-[#0B2B4E] dark:text-white">
                    {title}
                  </h3>
                  <p className="poppins-regular mt-4 text-[11px] leading-relaxed text-[#8A8A8A]">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tip jar illustration + feature cards — desktop only */}
        {isTipScreenOpen && (
          <div className="hidden lg:flex lg:flex-col lg:gap-32">
            <div className="relative flex items-center justify-center">
              {/* Soft lavender blob background */}
              <div className="" />
              <div
                className="pointer-events-none absolute right-6 top-2 h-16 w-20 opacity-40"
               
              />

              <img
                src={TipJarMascot}
                alt="Tip jar mascot"
                className="relative z-10 h-[320px] w-auto object-contain drop-shadow-[0_26px_50px_rgba(11,83,141,0.16)]"
              />

              {/* Speech bubble */}
              <div className="absolute right-0 top-8 z-20 w-[160px] rounded-[18px] border border-[#EEF2F6] bg-card px-16 py-12 text-center shadow-[0_14px_34px_rgba(11,83,141,0.12)]">
                <div className="flex justify-center gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <AiFillStar key={i} className="h-4 w-4 text-[#F4D11B]" />
                  ))}
                </div>
                <p className="poppins-medium mt-6 text-[12px] leading-snug text-[#6F7682] dark:text-slate-400">
                  {t("common.thanksForHelpingMeGrow")}
                </p>
                <span className="absolute -bottom-2 left-6 h-4 w-4 rotate-45 border-b border-r border-border bg-card" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-12">
              {tipBadges.map(({ icon: Icon, title, desc, iconColor, iconBg }) => (
                <div
                  key={title}
                  className="rounded-[16px] border border-[#E5EEF7] bg-card p-16 text-center shadow-[0_10px_28px_rgba(11,83,141,0.06)]"
                >
                  <span
                    className={`mx-auto mb-12 flex h-10 w-10 items-center justify-center rounded-full ${iconBg}`}
                  >
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                  </span>
                  <h3 className="poppins-semibold text-[13px] text-[#0B2B4E] dark:text-white">
                    {title}
                  </h3>
                  <p className="poppins-regular mt-4 text-[11px] leading-relaxed text-[#8A8A8A]">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QrResultContainer;
