import { PrimaryButton } from "@/components/atoms/buttons/primaryButton";
import TextInput from "@/components/atoms/textinput/textInput/TextInput";
import { PrimaryTypo } from "@/components/atoms/typo/primaryTypo";
import EmailIcon from "@/assets/svg/email.svg";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useForgotPassword } from "@/api/authApi";
import { useEffect, useState } from "react";
import ToastProvider from "@/providers/ToastProvider";
import SpinLoaderButton from "@/components/atoms/laoder/spin-loader-secondary";
import { useTranslation } from "react-i18next";
const ForgotPasswordContainer = () => {
  const { t } = useTranslation();
  const [showLoading, setShowLoading] = useState(false);
  const { mutate, isLoading, isSuccess, data, isError, error } =
    useForgotPassword();
  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t("auth.invalidEmail"))
      .required(t("auth.required")),
  });

  const handleSubmit = (values: typeof initialValues) => {
    setShowLoading(true);
    localStorage.setItem("userEmail", values.email);
    mutate({
      email: values.email,
    });
  };

  useEffect(() => {
    if (isError && error) {
      ToastProvider.error(
        error.response?.data?.message || t("auth.anErrorOccurred")
      );
      setShowLoading(false); // Reset loading state on error
    }
  }, [isError, error, t]);

  useEffect(() => {
    if (isSuccess && data) {
      ToastProvider.success(
        data.message || data.data.message || "Registration successfull!."
      );
      setShowLoading(false); // Reset loading state on success
    }
  }, [isSuccess, data]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form className="md:bg-white max-w-[448px] mx-auto sm:px-[60px] rounded-2xl py-[40px] px-[20px] flex flex-col justify-between sm:shadow-xl">
          <div className="flex flex-col">
            <PrimaryTypo
              typo={t("auth.forgotPassword")}
              styles="text-center !text-[28px] sm:text-[20px] mt-5"
            />
          </div>

          <div className="flex w-full items-center justify-center ">
            <span className="text-[#6F6F6F] px-6 text-center text-sm mt-[18px] leading-[21px]">
              {t("auth.pleaseEnterEmailForOTP")}
            </span>
          </div>

          <div className="mt-[30px]">
            <TextInput
              name="email"
              placeholder={t("auth.emailPlaceholder")}
              inputStyles="w-[253px] !rounded-8"
              iconLeft={<img src={EmailIcon} alt="email logo" />}
            />
          </div>

          <div className="flex flex-col gap-19">
            <PrimaryButton
              typo={
                showLoading ? (
                  <SpinLoaderButton isLoading={true} />
                ) : (
                  t("buttons.next")
                )
              }
              styles="w-full min-w-[280px] mt-[21px] !rounded-8 text-white text-base poppins-regular"
              type="submit"
              isLoading={isLoading}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ForgotPasswordContainer;
