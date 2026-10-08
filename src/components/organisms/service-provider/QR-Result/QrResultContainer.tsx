/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useRef, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useGetUserDetails } from "@/api/authApi";
import ToastProvider from "@/providers/ToastProvider";
import BounceLoader from "react-spinners/ClipLoader";
import { SafeImage } from "@/components/atoms/images/SafeImage";
import { handleScrollTop } from "@/hooks/hooks";
import { CurrencyContext } from "@/App";
import { getValidAccessToken } from "@/api/axiosInterceptor";
import { useCreateTipPaymentIntent } from "@/api/managePayments";
import { setPendingTipPayment } from "@/utils/pendingTipStorage";
import { useWithdrawAndTipLimit } from "@/api/tipManagement";
import { minimumTipForCurrency } from "@/currency/catalog";
import { useCurrencyCatalog } from "@/currency/useLocationCurrency";
import { normalizeCurrencyCode } from "@/currency/countryCurrency";
import { formatMoney } from "@/currency/format";
import { symbolForCurrency } from "@/currency/catalog";
import { useTranslation } from "react-i18next";
import { useDisableButton } from "@/components/atoms/buttons/DisableButtonContext";
import {
  getUserDisplayName,
  parseKeycloakUserDetailsResponse,
} from "@/utils/userProfile";
import { getRoleAvatarFallback } from "@/utils/imageUtils";
import { FaArrowLeft } from "react-icons/fa";
import { ArrowRight, BadgeCheck, Briefcase, MapPin } from "lucide-react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const PRESET_AMOUNTS = [2, 5, 10, 20];
const REVIEW_LIMIT = 500;

function useActiveTipCurrency() {
  useCurrencyCatalog();
  const { currency: contextCurrency } = useContext(CurrencyContext);
  const { data: tipLimitData } = useWithdrawAndTipLimit();
  const limit = tipLimitData?.tippingLimit ?? {};
  const settingsCurrency = normalizeCurrencyCode(
    limit.currency ||
      limit.Currency ||
      tipLimitData?.currency ||
      tipLimitData?.displayCurrency
  );
  const currency = settingsCurrency || contextCurrency || "GBP";
  const catalogMin = minimumTipForCurrency(currency);
  const rawMin = Number(limit.minimumAmount);
  const rawMax = Number(limit.maximumAmount);
  const minTip = Math.max(
    Number.isFinite(rawMin) ? rawMin : catalogMin,
    catalogMin
  );
  const maxTip = Number.isFinite(rawMax) ? rawMax : undefined;
  return { currency, minTip, maxTip };
}

const TipAmountInput = (props: { onChange: (amount: number) => void; t: (key: string) => string }) => {
  const { setDisableButton } = useDisableButton();
  const { currency, minTip, maxTip } = useActiveTipCurrency();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(minTip.toFixed(2));
  const [custom, setCustom] = useState(false);
  const symbol = symbolForCurrency(currency);
  const presets = PRESET_AMOUNTS.filter(
    (amount) => amount + 0.001 >= minTip && (maxTip == null || amount <= maxTip)
  );

  const publish = (next: number, isCustom: boolean) => {
    const fixed = next.toFixed(2);
    setValue(fixed);
    setCustom(isCustom);
    props.onChange(parseFloat(fixed));
    if (next < minTip) {
      setDisableButton(true);
      return;
    }
    if (maxTip != null && next > maxTip) {
      ToastProvider.error(`Maximum amount should be ${formatMoney(maxTip, currency)}`);
      setDisableButton(true);
      return;
    }
    setDisableButton(false);
  };

  useEffect(() => {
    setValue((current) => {
      const parsed = parseFloat(current);
      let next = Number.isFinite(parsed) ? parsed : minTip;
      if (next < minTip) next = minTip;
      if (maxTip != null && next > maxTip) next = maxTip;
      const fixed = next.toFixed(2);
      const matchesPreset = presets.some((amount) => Math.abs(amount - next) < 0.001);
      setCustom(!matchesPreset);
      props.onChange(parseFloat(fixed));
      setDisableButton(false);
      return fixed;
    });
  }, [minTip, maxTip]);

  const numeric = parseFloat(value);
  const activePreset = presets.find((amount) => Math.abs(amount - numeric) < 0.001);

  const incrementValue = () => {
    const next = parseFloat(value) + 1;
    if (maxTip != null && next > maxTip) {
      ToastProvider.error(`Maximum amount should be ${formatMoney(maxTip, currency)}`);
      setDisableButton(true);
      return;
    }
    const matchesPreset = presets.some((amount) => Math.abs(amount - next) < 0.001);
    publish(next, !matchesPreset);
  };

  const decrementValue = () => {
    const next = parseFloat(value) - 1;
    if (next < minTip) return;
    const matchesPreset = presets.some((amount) => Math.abs(amount - next) < 0.001);
    publish(next, !matchesPreset);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    if (inputValue !== "" && !/^\d+(\.\d{0,2})?$/.test(inputValue)) return;
    setValue(inputValue);
    setCustom(true);
    const parsed = parseFloat(inputValue);
    if (!Number.isFinite(parsed)) {
      setDisableButton(true);
      return;
    }
    props.onChange(parsed);
    if (parsed < minTip) {
      setDisableButton(true);
    } else if (maxTip != null && parsed > maxTip) {
      ToastProvider.error(`Maximum amount should be ${formatMoney(maxTip, currency)}`);
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
  };

  const handleBlur = () => {
    const parsed = parseFloat(value);
    if (!Number.isFinite(parsed)) {
      publish(minTip, !presets.some((amount) => Math.abs(amount - minTip) < 0.001));
      return;
    }
    publish(parsed, !presets.some((amount) => Math.abs(amount - parsed) < 0.001));
  };

  const chipClass = (selected: boolean) =>
    `poppins-semibold h-[38px] rounded-full border px-4 text-[12px] transition-colors ${
      selected
        ? "border-[#0B538D] bg-[#EAF4FF] text-[#0B538D]"
        : "border-[#E6EEF5] bg-white text-[#5B6475] hover:bg-[#F7FAFD]"
    }`;

  return (
    <div>
      <div className="mt-16 flex items-center gap-10">
        <button
          className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[14px] border border-[#E6EEF6] bg-white text-[26px] leading-none text-[#0B538D] ${
            numeric <= minTip ? "cursor-not-allowed opacity-40" : ""
          }`}
          onClick={decrementValue}
          type="button"
          disabled={numeric <= minTip}
          aria-label={props.t("common.amount")}
        >
          <span className="-mt-2">−</span>
        </button>
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-label={props.t("common.tipAmount")}
          className={`poppins-bold h-[52px] min-w-0 flex-1 rounded-[14px] border bg-[#F4F7FB] text-center text-[26px] text-[#0B2B4E] outline-none ${
            custom ? "border-[#0B538D]" : "border-transparent"
          }`}
        />
        <button
          className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[14px] bg-[#0B538D] text-[26px] leading-none text-white hover:bg-[#0077B6]"
          onClick={incrementValue}
          type="button"
          aria-label={props.t("common.tipAmount")}
        >
          <span className="-mt-2">+</span>
        </button>
      </div>
      <div className="mt-14 grid grid-cols-5 gap-8">
        {presets.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => publish(amount, false)}
            className={chipClass(!custom && activePreset === amount)}
          >
            {symbol}
            {amount}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            setCustom(true);
            inputRef.current?.focus();
            inputRef.current?.select();
          }}
          className={chipClass(custom)}
        >
          {props.t("common.otherAmount")}
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
    Country: "",
    City: "",
  });
  const { disablebutton } = useDisableButton();
  const [invalidQr, setInvalidQr] = useState(false);
  const { currency, minTip } = useActiveTipCurrency();
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
  } = useCreateTipPaymentIntent();

  const { id } = useParams();

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
    if (!id) {
      setInvalidQr(true);
      return;
    }
    if (values.tip < minTip) {
      ToastProvider.error(
        `Please add an amount of at least ${formatMoney(minTip, currency)}`
      );
      return;
    }
    const guestCheckout = !getValidAccessToken();
    const tipData = {
      TipperID: guestCheckout ? "" : localStorage.getItem("userId") || "",
      ServiceProviderID: id,
      Amount: values.tip,
      Currency: currency.toUpperCase(),
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
        currency: currency.toUpperCase(),
        serviceProviderId: id,
      });

      if (!result?.clientSecret || !result?.paymentIntentId) {
        ToastProvider.error("Failed to create payment intent. Please try again.");
        return;
      }

      setPendingTipPayment({
        tipData: {
          ...tipData,
          TipDate: tipData.TipDate.toISOString(),
        },
        paymentIntentId: result.paymentIntentId,
        clientSecret: result.clientSecret,
        guestCheckout,
      });

      navigate("/payment", {
        state: {
          tipData,
          clientSecret: result.clientSecret,
          paymentIntentId: result.paymentIntentId,
          guestCheckout,
        },
      });
    } catch (error: any) {
      console.error("Failed to create payment intent:", error);
      const status = error?.response?.status;
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create payment intent. Please try again.";
      if (status === 404) {
        setInvalidQr(true);
        return;
      }
      ToastProvider.error(message);
    }
  };

  useEffect(() => {
    if (isGetUserDetailsSuccess && getUserDetailsData) {
      const userData = parseKeycloakUserDetailsResponse(getUserDetailsData);
      if (!userData) return;

      if (userData?.Status === "banned") {
        setInvalidQr(true);
        return;
      }

      setUser({
        FirstName: userData.FirstName ?? "--",
        LastName: userData.LastName ?? "--",
        id: String(userData.KeyCloakID ?? userData.id ?? "--"),
        Bio: userData.Bio ?? "--",
        ProfilePictureURL: userData.ProfilePictureURL ?? "",
        Country: userData.Country ?? "",
        City: userData.City ?? "",
      });
    }
  }, [isGetUserDetailsSuccess, getUserDetailsData]);

  useEffect(() => {
    if (isGetUserDetailsError && getUserDetailsError) {
      const status = getUserDetailsError.response?.status;
      if (status === 404 || status === 400) {
        setInvalidQr(true);
        return;
      }
      ToastProvider.error(
        getUserDetailsError.response?.data?.message ||
          getUserDetailsError.message ||
          "Failed to load user details. Please try again."
      );
    }
  }, [isGetUserDetailsError, getUserDetailsError]);

  useEffect(() => {
    if (!id) {
      setInvalidQr(true);
      return;
    }
    setInvalidQr(false);
    getUserDetailsMutate(id);
  }, [id]);

  const handleBackToHome = () => {
    if (localStorage.getItem("token")) {
      const role = localStorage.getItem("userType");
      if (role === "sp") {
        navigate("/service-provider");
        return;
      }
      if (role === "tp" || role === "both") {
        navigate("/tip-provider");
        return;
      }
    }
    navigate("/");
  };

  if (invalidQr) {
    return (
      <div className="mx-auto flex min-h-[320px] w-full max-w-[480px] flex-col items-center justify-center gap-16 rounded-[20px] border border-[#E4EDF5] bg-card p-32 text-center shadow-sm">
        <h1 className="poppins-semibold text-[22px] text-[#0B2B4E] dark:text-white">
          {t("common.invalidQrCode")}
        </h1>
        <button
          type="button"
          onClick={handleBackToHome}
          className="flex h-[48px] items-center justify-center rounded-[12px] bg-[#0B538D] px-24 text-white"
        >
          <span className="poppins-semibold text-[15px]">{t("common.backToHome")}</span>
        </button>
      </div>
    );
  }

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

  const location = [user.City, user.Country].filter((part) => part && part !== "--").join(", ");
  const displayName = getUserDisplayName(user);
  const hasProfile = Boolean(user.id && user.id !== "--");

  return (
    <div className="relative mx-auto w-full max-w-[440px]">
      <div className="mb-20 flex flex-col gap-16">
        <button
          type="button"
          onClick={handleBackToHome}
          className="inline-flex w-fit items-center gap-8 rounded-full border border-[#E4EDF5] bg-white px-16 py-8 text-[#0B538D] shadow-[0_4px_12px_rgba(11,83,141,0.08)] transition-colors hover:bg-[#EAF3FA]"
        >
          <FaArrowLeft className="text-[12px]" />
          <span className="poppins-semibold text-[13px]">{t("buttons.back")}</span>
        </button>
        <div>
          <h1 className="poppins-bold text-[28px] leading-[1.15] tracking-[-0.03em] text-[#0B2B4E]">
            {t("common.rateAndTip")}
          </h1>
          <p className="poppins-regular mt-6 text-[14px] text-[#8A93A0]">
            {t("common.rateAndTipSubtitle")}
          </p>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values }) => (
          <Form className="flex flex-col gap-14">
            <section className="rounded-[20px] border border-[#E8EEF6] bg-white p-16 shadow-[0_8px_28px_rgba(11,83,141,0.06)]">
              <div className="flex items-center gap-12">
                <SafeImage
                  src={user.ProfilePictureURL}
                  fallbackSrc={getRoleAvatarFallback("sp")}
                  className="h-[52px] w-[52px] shrink-0 rounded-full object-cover"
                  alt={displayName || "profile"}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-6">
                    <h2 className="poppins-semibold truncate text-[16px] text-[#0B2B4E]">
                      {displayName || t("common.noDataAvailableYet")}
                    </h2>
                    {hasProfile && (
                      <BadgeCheck className="h-[18px] w-[18px] shrink-0 fill-[#0B538D] text-white" />
                    )}
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-10 text-[#8A93A0]">
                    {location && (
                      <span className="inline-flex items-center gap-4">
                        <MapPin className="h-[13px] w-[13px]" />
                        <span className="poppins-regular text-[12px]">{location}</span>
                      </span>
                    )}
                    <span className="inline-flex items-center gap-4">
                      <Briefcase className="h-[13px] w-[13px]" />
                      <span className="poppins-regular text-[12px]">
                        {t("userSelection.serviceProvider")}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-14 rounded-[12px] bg-[#F7F9FC] px-14 py-12">
                <p className="poppins-medium text-[11px] text-[#8A93A0]">{t("common.about")}</p>
                <p className="poppins-regular mt-4 line-clamp-3 text-[13px] leading-[20px] text-[#0B2B4E]">
                  {user.Bio && user.Bio !== "--" ? user.Bio : t("common.noDescriptionYet")}
                </p>
              </div>
            </section>

            <section className="rounded-[20px] border border-[#E8EEF6] bg-white p-16 shadow-[0_8px_28px_rgba(11,83,141,0.06)]">
              <div className="flex items-center justify-between gap-12">
                <h3 className="poppins-semibold text-[16px] text-[#0B2B4E]">
                  {t("common.rateTheirService")}
                </h3>
                <span className="poppins-medium shrink-0 rounded-full bg-[#EAF4FF] px-10 py-4 text-[11px] text-[#0B538D]">
                  {t("common.tapToRate")}
                </span>
              </div>
              <Field name="rating">
                {({ field }: any) => (
                  <div className="mt-16 flex justify-between gap-8">
                    {Array.from({ length: 5 }, (_, index) => {
                      const ratingValue = index + 1;
                      const active = ratingValue <= field.value;
                      return (
                        <button
                          key={ratingValue}
                          type="button"
                          onClick={() => setFieldValue("rating", ratingValue)}
                          className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#FFF8E8]"
                          aria-label={`${ratingValue}`}
                        >
                          {active ? (
                            <AiFillStar className="h-[26px] w-[26px] text-[#F5B400]" />
                          ) : (
                            <AiOutlineStar className="h-[26px] w-[26px] text-[#F6D56A]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </Field>

              <h3 className="poppins-semibold mt-18 text-[15px] text-[#0B2B4E]">
                {t("common.leaveReviewOptional")}
              </h3>
              <Field name="review">
                {({ field }: any) => (
                  <div className="relative mt-10">
                    <textarea
                      {...field}
                      maxLength={REVIEW_LIMIT}
                      rows={3}
                      placeholder={t("common.shareYourExperience")}
                      onChange={(event) =>
                        setFieldValue("review", event.target.value.slice(0, REVIEW_LIMIT))
                      }
                      className="poppins-regular w-full resize-none rounded-[14px] border border-[#E6EEF5] bg-[#F7F9FC] px-14 py-12 pb-28 text-[14px] text-[#0B2B4E] outline-none placeholder:text-[#A0A8B4] focus:border-[#0B538D]/40"
                    />
                    <span className="poppins-regular absolute bottom-10 right-12 text-[11px] text-[#A0A8B4]">
                      {String(values.review || "").length}/{REVIEW_LIMIT}
                    </span>
                  </div>
                )}
              </Field>
            </section>

            <section className="rounded-[20px] border border-[#E8EEF6] bg-white p-16 shadow-[0_8px_28px_rgba(11,83,141,0.06)]">
              <div className="flex items-center justify-between gap-12">
                <h3 className="poppins-semibold text-[16px] text-[#0B2B4E]">
                  {t("common.tipAmount")}
                </h3>
                <span className="poppins-semibold inline-flex items-center rounded-full border border-[#E6EEF5] bg-[#F7F9FC] px-12 py-6 text-[12px] text-[#0B2B4E]">
                  {currency}
                </span>
              </div>
              <TipAmountInput
                onChange={(newAmount: number) => setFieldValue("tip", newAmount)}
                t={t}
              />
            </section>

            <button
              type="submit"
              onClick={() => handleScrollTop()}
              disabled={disablebutton || isPaymentIntentLoading || !hasProfile}
              className={`flex h-[52px] w-full items-center justify-center gap-8 rounded-[14px] bg-[#0B538D] text-white shadow-[0_8px_20px_rgba(11,83,141,0.22)] transition-colors hover:bg-[#0077B6] ${
                disablebutton || isPaymentIntentLoading || !hasProfile
                  ? "cursor-not-allowed opacity-40"
                  : ""
              }`}
            >
              <span className="poppins-semibold text-[16px]">
                {isPaymentIntentLoading ? t("common.processing") : t("common.submitTipAndReview")}
              </span>
              {!isPaymentIntentLoading && <ArrowRight className="h-[18px] w-[18px]" />}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default QrResultContainer;
