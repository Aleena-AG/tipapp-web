import EmailIcon from "@/assets/svg/email.svg";
import PasswordIcon from "@/assets/svg/password.svg";
import GoogleIcon from "@/assets/svg/google.svg";
import AppleIcon from "@/assets/svg/apple.svg";
import FacebookIcon from "@/assets/svg/facebook.svg";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useLogin } from "@/api/authApi";
import { useEffect } from "react";
import ToastProvider from "@/providers/ToastProvider";
import TextInput from "@/components/atoms/textinput/textInput/TextInput";
import useAuth from "@/hooks/useAuth";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthLayout from "@/components/organisms/auth/authLayout/AuthLayout";

const LoginContainer = () => {
  const { t } = useTranslation();
  const { mutate, isLoading, isSuccess, data, isError, error } = useLogin();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t("auth.invalidEmail"))
      .required(t("auth.required")),
    password: Yup.string().required(t("auth.required")),
  });

  const handleSubmit = (values: typeof initialValues) => {
    mutate({
      email: values.email,
      password: values.password,
    });
  };

  useEffect(() => {
    if (isError && error) {
      ToastProvider.error(
        error.response?.data?.message || t("auth.anErrorOccurred")
      );
    }
  }, [isError, error, t]);

  useEffect(() => {
    if (isSuccess && data) {
      // Success message will be shown by handleRedirect function with role-specific message
    }
  }, [isSuccess, data]);

  // Same-origin /api → Vite proxy (dev) or Vercel rewrite (prod)
  const handleGoogleSignIn = () => {
    window.location.href = "/api/auth/google";
  };

  const handleFacebookSignIn = () => {
    window.location.href = "/api/auth/facebook";
  };

  const handleAppleSignIn = () => {
    window.location.href = "/api/auth/apple";
  };

  const { getToken, handleRedirectByRole } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      if (location.pathname.includes("/sign-in") && token) {
        handleRedirectByRole();
      }
    };
    checkAuth();
  }, [location, getToken, handleRedirectByRole]);

  return (
    <AuthLayout>
      <h1 className="poppins-semibold text-[24px] sm:text-[28px] text-center leading-tight">
        {t("auth.welcomeBack")}
      </h1>
      <p className="poppins-regular text-app-muted text-sm text-center mt-2">
        {t("auth.loginSubtitle")}
      </p>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className="mt-6 sm:mt-8 flex flex-col">
            <TextInput
              name="email"
              label={t("forms.email")}
              labelStyles="text-[#333] mb-1 inline-block"
              placeholder={t("auth.emailPlaceholder")}
              iconLeft={<img src={EmailIcon} alt="" />}
            />

            <div className="mt-5">
              <TextInput
                name="password"
                type="password"
                label={t("forms.password")}
                labelStyles="text-[#333] mb-1 inline-block"
                placeholder={t("auth.passwordPlaceholder")}
                iconLeft={<img src={PasswordIcon} alt="" />}
              />
            </div>

            <div className="flex w-full justify-end mt-3">
              <a
                href="/forgot-password"
                className="text-[#9E2A2B] text-sm poppins-medium hover:underline"
              >
                {t("auth.forgotPassword")}
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 w-full h-12 rounded-8 bg-[#9E2A2B] hover:bg-[#861f20] transition-colors text-white text-base poppins-medium disabled:opacity-60"
            >
              {isLoading ? "…" : t("auth.signIn")}
            </button>

            <div className="flex w-full items-center justify-center gap-4 my-5 sm:my-7">
              <div className="h-px w-full bg-[#E4E4E4]" />
              <span className="text-app-muted text-sm poppins-medium">
                {t("auth.or")}
              </span>
              <div className="h-px w-full bg-[#E4E4E4]" />
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleAppleSignIn}
                className="flex items-center justify-center gap-3 w-full h-12 rounded-8 border border-[#E4E4E4] hover:bg-[#F7F7F7] transition-colors poppins-medium text-sm"
              >
                <img src={AppleIcon} alt="" className="h-5 w-5" />
                {t("auth.continueWithApple")}
              </button>
              <button
                type="button"
                onClick={handleFacebookSignIn}
                className="flex items-center justify-center gap-3 w-full h-12 rounded-8 border border-[#E4E4E4] hover:bg-[#F7F7F7] transition-colors poppins-medium text-sm"
              >
                <img src={FacebookIcon} alt="" className="h-5 w-5" />
                {t("auth.continueWithFacebook")}
              </button>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="flex items-center justify-center gap-3 w-full h-12 rounded-8 border border-[#E4E4E4] hover:bg-[#F7F7F7] transition-colors poppins-medium text-sm"
              >
                <img src={GoogleIcon} alt="" className="h-5 w-5" />
                {t("auth.continueWithGoogle")}
              </button>
            </div>

            <div className="flex w-full items-center justify-center gap-2 mt-6 sm:mt-8">
              <span className="text-app-muted text-sm poppins-medium">
                {t("auth.dontHaveAccount")}
              </span>
              <a
                href="/sign-up"
                className="text-[#9E2A2B] underline text-sm poppins-medium"
              >
                {t("auth.signUpHere")}
              </a>
            </div>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
};

export default LoginContainer;
